import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { logError } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { AiParseError, parseStructuredOutput } from "@/lib/ai/client";
import {
  geminiParseLogRawSchema,
  geminiParseLogResponseSchema,
  parseLogUtteranceSchema,
} from "@/lib/ai/schemas";
import { Habit } from "@/models/Habit";
import { WorkoutTemplate } from "@/models/Workout";
import { habitEntrySchema, workoutLogSchema } from "@/lib/validation";

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 20;

function rateLimitedResponse(retryAfterSec: number) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Too many AI requests. Please try again later.",
        code: "RATE_LIMITED",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "Cache-Control": "no-store",
      },
    },
  );
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function matchHabitId(
  habitName: string,
  habits: { _id: unknown; name: string }[],
): string | null {
  const target = normalizeName(habitName);
  const exact = habits.find((h) => normalizeName(h.name) === target);
  if (exact) return String(exact._id);

  const partial = habits.find(
    (h) =>
      normalizeName(h.name).includes(target) ||
      target.includes(normalizeName(h.name)),
  );
  return partial ? String(partial._id) : null;
}

function buildPrompt(args: {
  utterance: string;
  templateNames: string[];
  habitNames: string[];
  today: string;
}): string {
  return `You are FitTrack's logging parser. Classify the user utterance as a workout log, a habit check-in, or unknown.

Rules:
- Prefer matching habit names and workout template names from the user's lists when relevant.
- For workouts, extract exercise name(s), sets with positive integer reps and non-negative weight (kg). Use today's date (${args.today}) if none is given. Date as YYYY-MM-DD is fine.
- For habits, set habitName to the closest matching name from the habit list. Mark completed true unless they clearly say they skipped. Include numeric value only when they mention one.
- If the utterance is ambiguous, unrelated, or you cannot extract a reliable draft, set type to "unknown" with low confidence and a short reason.
- Do not invent habits that are not close to the provided list when type is habit — use unknown instead.
- Fill workout only when type is workout; fill habit only when type is habit; otherwise leave them null.

User workout templates: ${JSON.stringify(args.templateNames)}
User habits: ${JSON.stringify(args.habitNames)}

Utterance:
"""
${args.utterance}
"""`;
}

export async function POST(req: NextRequest) {
  let userId: string | undefined;

  try {
    const user = await requireUser(req);
    userId = user.id;

    const limited = rateLimit(
      `ai:parse-log:${user.id}`,
      LIMIT,
      WINDOW_MS,
    );
    if (!limited.success) {
      return rateLimitedResponse(limited.retryAfterSec);
    }

    const json = await req.json();
    const parsedBody = parseLogUtteranceSchema.safeParse(json);
    if (!parsedBody.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const { utterance } = parsedBody.data;
    const today = new Date().toISOString().slice(0, 10);

    await dbConnect();

    const [templates, habits] = await Promise.all([
      WorkoutTemplate.find({ userId: user.id }).select("name").lean(),
      Habit.find({ userId: user.id }).select("name").lean(),
    ]);

    const templateNames = templates.map((t) => t.name);
    const habitNames = habits.map((h) => h.name);

    const raw = await parseStructuredOutput(
      buildPrompt({
        utterance,
        templateNames,
        habitNames,
        today,
      }),
      geminiParseLogRawSchema,
      geminiParseLogResponseSchema,
    );

    if (
      raw.type === "unknown" ||
      raw.confidence === "low" ||
      (raw.type === "workout" && !raw.workout) ||
      (raw.type === "habit" && !raw.habit)
    ) {
      return apiError(
        raw.reason?.trim() ||
          "Couldn't understand that. Try something like \"bench 3x5 @ 80kg\" or \"done water\".",
        { status: 422, code: "PARSE_FAILED" },
      );
    }

    if (raw.type === "workout" && raw.workout) {
      const draftCheck = workoutLogSchema.safeParse(raw.workout);
      if (!draftCheck.success) {
        return apiError("Couldn't understand that workout.", {
          status: 422,
          code: "PARSE_FAILED",
        });
      }

      return apiOk({
        type: "workout" as const,
        draft: draftCheck.data,
        confidence: raw.confidence,
      });
    }

    if (raw.type === "habit" && raw.habit) {
      const habitId = matchHabitId(raw.habit.habitName, habits);
      if (!habitId) {
        return apiError(
          habitNames.length === 0
            ? "Create a habit first, then try natural-language check-in."
            : `Couldn't match a habit named "${raw.habit.habitName}". Pick one from your list or rephrase.`,
          { status: 422, code: "PARSE_FAILED" },
        );
      }

      const draft = {
        habitId,
        date: raw.habit.date,
        completed: raw.habit.completed,
        value: raw.habit.value ?? null,
      };
      const draftCheck = habitEntrySchema.safeParse(draft);
      if (!draftCheck.success) {
        return apiError("Couldn't understand that habit check-in.", {
          status: 422,
          code: "PARSE_FAILED",
        });
      }

      return apiOk({
        type: "habit" as const,
        draft: draftCheck.data,
        confidence: raw.confidence,
        matchedHabitName:
          habits.find((h) => String(h._id) === habitId)?.name ??
          raw.habit.habitName,
      });
    }

    return apiError("Couldn't understand that.", {
      status: 422,
      code: "PARSE_FAILED",
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED" });
    }

    if (err instanceof AiParseError) {
      if (err.code === "NOT_CONFIGURED") {
        return apiError("AI logging is not configured on this server.", {
          status: 503,
          code: "AI_NOT_CONFIGURED",
        });
      }
      if (err.code === "QUOTA") {
        logError("api/ai/parse-log", err, {
          userId,
          errorCode: err.code,
          hadUtterance: true,
        });
        return apiError(err.message, {
          status: 429,
          code: "AI_QUOTA_EXCEEDED",
        });
      }
      if (err.code === "AUTH") {
        logError("api/ai/parse-log", err, {
          userId,
          errorCode: err.code,
          hadUtterance: true,
        });
        return apiError(err.message, {
          status: 503,
          code: "AI_AUTH_FAILED",
        });
      }
      // Safe meta only — never log the utterance content.
      logError("api/ai/parse-log", err, {
        userId,
        errorCode: err.code,
        hadUtterance: true,
      });
      return apiError(
        "Couldn't understand that. Try rephrasing or use the manual form.",
        { status: 422, code: "PARSE_FAILED" },
      );
    }

    logError("api/ai/parse-log", err, {
      userId,
      hadUtterance: true,
    });
    return apiError("Internal error", {
      status: 500,
      code: "INTERNAL_ERROR",
    });
  }
}

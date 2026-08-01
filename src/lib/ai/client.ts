import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
  type ResponseSchema,
} from "@google/generative-ai";
import type { z } from "zod";

export class AiParseError extends Error {
  readonly code:
    | "NOT_CONFIGURED"
    | "INVALID_JSON"
    | "SCHEMA_MISMATCH"
    | "UPSTREAM"
    | "QUOTA"
    | "AUTH";

  constructor(
    message: string,
    code: AiParseError["code"] = "UPSTREAM",
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "AiParseError";
    this.code = code;
  }
}

function mapUpstreamError(err: unknown): AiParseError {
  const status =
    err instanceof GoogleGenerativeAIFetchError
      ? err.status
      : typeof err === "object" &&
          err !== null &&
          "status" in err &&
          typeof (err as { status: unknown }).status === "number"
        ? (err as { status: number }).status
        : undefined;

  const message = err instanceof Error ? err.message : String(err);

  if (status === 429 || /quota|rate.?limit|too many requests/i.test(message)) {
    return new AiParseError(
      "AI quota exceeded. Wait a bit, switch AI_MODEL, or enable billing in Google AI Studio.",
      "QUOTA",
      { cause: err },
    );
  }

  if (
    status === 401 ||
    status === 403 ||
    /API key|permission|unauthorized/i.test(message)
  ) {
    return new AiParseError("AI provider rejected the API key.", "AUTH", {
      cause: err,
    });
  }

  return new AiParseError("AI provider request failed", "UPSTREAM", {
    cause: err,
  });
}

/**
 * Thin Gemini adapter: JSON mode + responseSchema, then Zod as final gate.
 */
export async function parseStructuredOutput<T>(
  prompt: string,
  zodSchema: z.ZodType<T>,
  geminiSchema: ResponseSchema,
): Promise<T> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new AiParseError(
      "AI is not configured. Set AI_API_KEY.",
      "NOT_CONFIGURED",
    );
  }

  // gemini-2.0-flash free-tier often returns limit:0; gemini-flash-latest is the stable alias.
  const modelName = process.env.AI_MODEL?.trim() || "gemini-flash-latest";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
    },
  });

  let text: string;
  try {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (err) {
    throw mapUpstreamError(err);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new AiParseError(
      "Couldn't understand that — model returned invalid JSON",
      "INVALID_JSON",
      { cause: err },
    );
  }

  const parsed = zodSchema.safeParse(json);
  if (!parsed.success) {
    throw new AiParseError(
      "Couldn't understand that — response didn't match expected shape",
      "SCHEMA_MISMATCH",
    );
  }

  return parsed.data;
}

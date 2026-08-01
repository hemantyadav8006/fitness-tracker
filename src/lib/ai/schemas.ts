import { z } from "zod";
import { SchemaType, type ResponseSchema } from "@google/generative-ai";
import { workoutLogSchema } from "@/lib/validation";

/** Raw model output before habitId resolution — Zod is the source of truth. */
export const geminiParseLogRawSchema = z.object({
  type: z.enum(["workout", "habit", "unknown"]),
  confidence: z.enum(["high", "medium", "low"]),
  reason: z.string().max(500).nullable().optional(),
  workout: workoutLogSchema.nullable().optional(),
  habit: z
    .object({
      habitName: z.string().min(1).max(100),
      date: z.string().min(1),
      completed: z.boolean(),
      value: z.number().nonnegative().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type GeminiParseLogRaw = z.infer<typeof geminiParseLogRawSchema>;

/**
 * Hand-written Gemini responseSchema mirroring geminiParseLogRawSchema.
 * Keep in sync when changing the Zod shape above.
 */
export const geminiParseLogResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    type: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["workout", "habit", "unknown"],
      description: "Classification of the user utterance",
    },
    confidence: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["high", "medium", "low"],
      description: "How confident the model is in the parse",
    },
    reason: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Short reason when type is unknown or confidence is low",
    },
    workout: {
      type: SchemaType.OBJECT,
      nullable: true,
      description: "Filled when type is workout",
      properties: {
        date: {
          type: SchemaType.STRING,
          description: "ISO date or YYYY-MM-DD",
        },
        exercises: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              exerciseId: {
                type: SchemaType.STRING,
                nullable: true,
              },
              sets: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    reps: { type: SchemaType.INTEGER },
                    weight: { type: SchemaType.NUMBER },
                    notes: {
                      type: SchemaType.STRING,
                      nullable: true,
                    },
                  },
                  required: ["reps", "weight"],
                },
              },
            },
            required: ["name", "sets"],
          },
        },
      },
      required: ["date", "exercises"],
    },
    habit: {
      type: SchemaType.OBJECT,
      nullable: true,
      description: "Filled when type is habit — use habitName from user list",
      properties: {
        habitName: { type: SchemaType.STRING },
        date: {
          type: SchemaType.STRING,
          description: "ISO date or YYYY-MM-DD",
        },
        completed: { type: SchemaType.BOOLEAN },
        value: {
          type: SchemaType.NUMBER,
          nullable: true,
          description: "Numeric value when the habit is numeric",
        },
      },
      required: ["habitName", "date", "completed"],
    },
  },
  required: ["type", "confidence"],
};

export const parseLogUtteranceSchema = z.object({
  utterance: z.string().trim().min(1).max(500),
});

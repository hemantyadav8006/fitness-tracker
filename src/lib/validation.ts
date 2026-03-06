import { z } from "zod";
import type { HabitTargetType } from "@/types/domain";

export const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email().max(254),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(6).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export const verifyResetOtpSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const workoutTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
      }),
    )
    .min(1),
});

export const workoutLogSchema = z.object({
  date: z.string().datetime().or(z.string().min(1)),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().optional().nullable(),
        name: z.string().min(1).max(100),
        sets: z
          .array(
            z.object({
              reps: z.number().int().positive(),
              weight: z.number().nonnegative(),
              notes: z.string().max(500).optional(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

export const habitSchema = z.object({
  name: z.string().min(1).max(100),
  targetType: z.custom<HabitTargetType>(
    (val) => val === "boolean" || val === "numeric",
  ),
  targetValue: z.number().positive().optional().nullable(),
});

export const habitEntrySchema = z.object({
  habitId: z.string(),
  date: z.string().datetime().or(z.string().min(1)),
  value: z.number().nonnegative().optional().nullable(),
  completed: z.boolean(),
});

export const progressEntrySchema = z.object({
  date: z.string().datetime().or(z.string().min(1)),
  weight: z.number().positive().optional().nullable(),
  waist: z.number().positive().optional().nullable(),
  notes: z.string().max(500).optional(),
});

export const personalRecordSchema = z.object({
  exerciseName: z.string().min(1).max(100),
  maxWeight: z.number().positive(),
  reps: z.number().int().positive(),
  date: z.string().datetime().or(z.string().min(1)),
});

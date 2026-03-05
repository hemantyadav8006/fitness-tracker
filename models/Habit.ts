import { Schema, model, models, type Model } from "mongoose";
import type { HabitTargetType } from "@/types/domain";

export interface HabitDocument {
  _id: string;
  userId: string;
  name: string;
  targetType: HabitTargetType;
  targetValue?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntryDocument {
  _id: string;
  userId: string;
  habitId: string;
  date: Date;
  value?: number | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<HabitDocument>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    targetType: {
      type: String,
      enum: ["boolean", "numeric"],
      required: true
    },
    targetValue: { type: Number }
  },
  {
    timestamps: true
  }
);

HabitSchema.index({ userId: 1, name: 1 }, { unique: true });

const HabitEntrySchema = new Schema<HabitEntryDocument>(
  {
    userId: { type: String, required: true, index: true },
    habitId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    value: { type: Number },
    completed: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

HabitEntrySchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export const Habit: Model<HabitDocument> =
  (models.Habit as Model<HabitDocument>) || model<HabitDocument>("Habit", HabitSchema);

export const HabitEntry: Model<HabitEntryDocument> =
  (models.HabitEntry as Model<HabitEntryDocument>) || model<HabitEntryDocument>("HabitEntry", HabitEntrySchema);


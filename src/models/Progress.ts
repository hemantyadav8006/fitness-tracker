import { Schema, model, models, type Model } from "mongoose";

export interface ProgressEntryDocument {
  _id: string;
  userId: string;
  date: Date;
  weight?: number | null;
  waist?: number | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalRecordDocument {
  _id: string;
  userId: string;
  exerciseName: string;
  maxWeight: number;
  reps: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressEntrySchema = new Schema<ProgressEntryDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    weight: { type: Number },
    waist: { type: Number },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

ProgressEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const PersonalRecordSchema = new Schema<PersonalRecordDocument>(
  {
    userId: { type: String, required: true, index: true },
    exerciseName: { type: String, required: true },
    maxWeight: { type: Number, required: true },
    reps: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

PersonalRecordSchema.index({
  userId: 1,
  exerciseName: 1,
  maxWeight: -1,
  reps: -1,
});

export const ProgressEntry: Model<ProgressEntryDocument> =
  (models.ProgressEntry as Model<ProgressEntryDocument>) ||
  model<ProgressEntryDocument>("ProgressEntry", ProgressEntrySchema);

export const PersonalRecord: Model<PersonalRecordDocument> =
  (models.PersonalRecord as Model<PersonalRecordDocument>) ||
  model<PersonalRecordDocument>("PersonalRecord", PersonalRecordSchema);

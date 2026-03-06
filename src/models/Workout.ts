import { Schema, model, models, type Model } from "mongoose";

export interface WorkoutTemplateExerciseDocument {
  _id: string;
  name: string;
}

export interface WorkoutTemplateDocument {
  _id: string;
  userId: string;
  name: string;
  exercises: WorkoutTemplateExerciseDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSetDocument {
  reps: number;
  weight: number;
  notes?: string;
}

export interface WorkoutExerciseLogDocument {
  exerciseId?: string | null;
  name: string;
  sets: WorkoutSetDocument[];
}

export interface WorkoutLogDocument {
  _id: string;
  userId: string;
  date: Date;
  exercises: WorkoutExerciseLogDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutTemplateExerciseSchema =
  new Schema<WorkoutTemplateExerciseDocument>(
    {
      name: { type: String, required: true },
    },
    { _id: true },
  );

const WorkoutTemplateSchema = new Schema<WorkoutTemplateDocument>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    exercises: [WorkoutTemplateExerciseSchema],
  },
  {
    timestamps: true,
  },
);

WorkoutTemplateSchema.index({ userId: 1, name: 1 }, { unique: true });

const WorkoutSetSchema = new Schema<WorkoutSetDocument>(
  {
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    notes: { type: String },
  },
  { _id: false },
);

const WorkoutExerciseLogSchema = new Schema<WorkoutExerciseLogDocument>(
  {
    exerciseId: { type: String },
    name: { type: String, required: true },
    sets: { type: [WorkoutSetSchema], default: [] },
  },
  { _id: true },
);

const WorkoutLogSchema = new Schema<WorkoutLogDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    exercises: { type: [WorkoutExerciseLogSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

WorkoutLogSchema.index({ userId: 1, date: -1 });

export const WorkoutTemplate: Model<WorkoutTemplateDocument> =
  (models.WorkoutTemplate as Model<WorkoutTemplateDocument>) ||
  model<WorkoutTemplateDocument>("WorkoutTemplate", WorkoutTemplateSchema);

export const WorkoutLog: Model<WorkoutLogDocument> =
  (models.WorkoutLog as Model<WorkoutLogDocument>) ||
  model<WorkoutLogDocument>("WorkoutLog", WorkoutLogSchema);

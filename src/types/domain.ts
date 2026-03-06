export type UserRole = "user" | "admin";

export type HabitTargetType = "boolean" | "numeric";

export interface UserSafe {
  id: string;
  username: string;
  role: UserRole;
}

export interface WorkoutTemplateExercise {
  _id: string;
  name: string;
}

export interface WorkoutTemplateDTO {
  _id: string;
  name: string;
  exercises: WorkoutTemplateExercise[];
}

export interface WorkoutSetDTO {
  reps: number;
  weight: number;
  notes?: string;
}

export interface WorkoutExerciseLogDTO {
  exerciseId?: string | null;
  name: string;
  sets: WorkoutSetDTO[];
}

export interface WorkoutLogDTO {
  _id: string;
  userId: string;
  date: string;
  exercises: WorkoutExerciseLogDTO[];
}

export interface HabitDTO {
  _id: string;
  userId: string;
  name: string;
  targetType: HabitTargetType;
  targetValue?: number | null;
}

export interface HabitEntryDTO {
  _id: string;
  userId: string;
  habitId: string;
  date: string;
  value?: number | null;
  completed: boolean;
}

export interface ProgressEntryDTO {
  _id: string;
  userId: string;
  date: string;
  weight?: number | null;
  waist?: number | null;
  notes?: string;
}

export interface PersonalRecordDTO {
  _id: string;
  userId: string;
  exerciseName: string;
  maxWeight: number;
  reps: number;
  date: string;
}

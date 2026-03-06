import { Schema, model, models, type Model } from "mongoose";
import type { UserRole } from "@/types/domain";

export interface UserDocument {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  resetPasswordOTP?: string | null;
  resetPasswordOTPExpire?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordOTP: { type: String, required: false, index: true },
    resetPasswordOTPExpire: { type: Date, required: false },
  },
  {
    timestamps: true,
  },
);

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", UserSchema);

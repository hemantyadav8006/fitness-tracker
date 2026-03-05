import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "./db";
import { User } from "@/models/User";
import type { UserSafe, UserRole } from "@/types/domain";

const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? "10");

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signAuthToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function getUserFromRequest(req?: NextRequest): Promise<UserSafe | null> {
  const token =
    req?.cookies.get("auth_token")?.value ??
    // fallback to server cookie store when used in server components
    cookies().get("auth_token")?.value;

  if (!token) return null;

  const decoded = verifyAuthToken(token);
  if (!decoded) return null;

  await connectToDatabase();

  const user = await User.findById(decoded.sub).lean();
  if (!user) return null;

  return {
    id: String(user._id),
    username: user.username,
    role: user.role
  };
}

export async function requireUser(req?: NextRequest): Promise<UserSafe> {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}


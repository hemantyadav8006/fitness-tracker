import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { signAuthToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import type { UserSafe } from "@/types/domain";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const { username, password } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ username });
    if (!user) {
      return apiError("Invalid credentials", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return apiError("Invalid credentials", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = signAuthToken({
      sub: String(user._id),
      username: user.username,
      role: user.role,
    });

    await setAuthCookie(token);

    const safeUser: UserSafe = {
      id: String(user._id),
      username: user.username,
      role: user.role,
    };

    return apiOk(safeUser);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

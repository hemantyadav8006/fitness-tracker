import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";
import { verifyOtpHash } from "@/lib/otp";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = resetPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const email = parsed.data.email.toLowerCase();
    const { otp, newPassword } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    const expires = user.resetPasswordOTPExpire
      ? new Date(user.resetPasswordOTPExpire)
      : null;

    if (
      !user.resetPasswordOTP ||
      !expires ||
      expires.getTime() <= Date.now() ||
      !verifyOtpHash(otp, user.resetPasswordOTP)
    ) {
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpire = null;
    await user.save();

    return apiOk({ message: "Password updated. You can now sign in." });
  } catch (err) {
    logError("api/auth/reset-password", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

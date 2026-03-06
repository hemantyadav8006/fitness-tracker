import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";
import crypto from "crypto";

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

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
    const otpHash = hashOtp(parsed.data.otp);
    const newPassword = parsed.data.newPassword;

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      // Don't leak whether the email exists.
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    const expires = user.resetPasswordOTPExpire
      ? new Date(user.resetPasswordOTPExpire)
      : null;

    if (!user.resetPasswordOTP || !expires || expires.getTime() <= Date.now()) {
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    const match = crypto.timingSafeEqual(
      Buffer.from(user.resetPasswordOTP),
      Buffer.from(otpHash),
    );

    if (!match) {
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
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

import { NextRequest } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetOtpEmail } from "@/lib/sendOtpEmail";

function generateOtp(): string {
  const otp = crypto.randomInt(0, 1000000);
  return String(otp).padStart(6, "0");
}

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = forgotPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const email = parsed.data.email.toLowerCase();

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return apiError("User not found", {
        status: 404,
        code: "USER_NOT_FOUND",
      });
    }

    const otp = generateOtp();
    const hashed = hashOtp(otp);
    const expire = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    user.resetPasswordOTP = hashed;
    user.resetPasswordOTPExpire = expire;
    await user.save();

    await sendPasswordResetOtpEmail(email, otp);

    return apiOk({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

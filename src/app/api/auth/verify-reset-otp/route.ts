import { NextRequest } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { verifyResetOtpSchema } from "@/lib/validation";

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = verifyResetOtpSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const email = parsed.data.email.toLowerCase();
    const hashed = hashOtp(parsed.data.otp);

    await dbConnect();

    const user = await User.findOne({ email }).lean();
    if (!user) {
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
      Buffer.from(hashed),
    );

    if (!match) {
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    return apiOk({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

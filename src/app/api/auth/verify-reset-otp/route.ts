import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { verifyResetOtpSchema } from "@/lib/validation";
import { verifyOtpHash } from "@/lib/otp";
import { logError } from "@/lib/logger";

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
    const otp = parsed.data.otp;

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

    return apiOk({ message: "OTP verified" });
  } catch (err) {
    logError("api/auth/verify-reset-otp", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

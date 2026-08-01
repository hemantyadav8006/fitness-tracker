import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validation";
import { generateOTP, hashOtp, otpExpiryFromNow } from "@/lib/otp";
import { sendPasswordResetOtpEmail } from "@/lib/sendOtpEmail";

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
      // Same response shape whether or not the account exists (avoid enumeration).
      return apiOk({
        message: "If an account exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = hashOtp(otp);
    user.resetPasswordOTPExpire = otpExpiryFromNow();
    await user.save();

    await sendPasswordResetOtpEmail(email, otp);

    return apiOk({
      message: "If an account exists, an OTP has been sent.",
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

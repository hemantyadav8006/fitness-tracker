import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { generateOTP } from "@/lib/generateOtp";
import { sendOtpEmail } from "@/lib/sendOtpEmail";
import { z } from "zod";

const resendOtpSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = resendOtpSchema.safeParse(json);
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
      // Do not leak user existence.
      return apiOk({ message: "OTP resent if account exists." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return apiOk({ message: "OTP resent if account exists." });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

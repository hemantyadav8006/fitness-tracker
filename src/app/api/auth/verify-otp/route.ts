import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = verifyOtpSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const email = parsed.data.email.toLowerCase();
    const otp = parsed.data.otp;

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    if (user.otp !== otp || user.otpExpiry.getTime() <= Date.now()) {
      return apiError("Invalid or expired OTP.", {
        status: 400,
        code: "INVALID_OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return apiOk({ message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

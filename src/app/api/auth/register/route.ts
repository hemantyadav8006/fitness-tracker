import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { generateOTP } from "@/lib/generateOtp";
import { sendOtpEmail } from "@/lib/sendOtpEmail";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    console.log("v: ", parsed);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    const { username, email, password } = parsed.data;

    await dbConnect();

    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }).lean(),
      User.findOne({ email: email.toLowerCase() }).lean(),
    ]);

    if (existingUsername) {
      return apiError("Username already taken", {
        status: 409,
        code: "USERNAME_TAKEN",
      });
    }
    if (existingEmail) {
      return apiError("Email already in use", {
        status: 409,
        code: "EMAIL_TAKEN",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
    });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp);

    return apiOk(
      {
        message:
          "Registration successful. Please verify your email with the OTP sent.",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

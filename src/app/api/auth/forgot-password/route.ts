import { NextRequest } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { User } from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendEmail } from "@/utils/sendEmail";

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

    await sendEmail({
      to: email,
      subject: "Your Password Reset Code",
      html: `
      <div style="background-color:#f8fafc;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        
        <div style="max-width:520px;margin:0 auto;background:white;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
          
          <!-- Header -->
          <div style="padding:28px 32px;border-bottom:1px solid #f1f5f9;text-align:center;">
            <h1 style="font-size:20px;margin:0;color:#111827;">Password Reset</h1>
          </div>
    
          <!-- Body -->
          <div style="padding:36px 32px;text-align:center;">
            
            <p style="margin:0 0 20px 0;color:#374151;font-size:15px;">
              We received a request to reset your password.
            </p>
    
            <p style="margin:0 0 24px 0;color:#374151;font-size:15px;">
              Enter the following verification code to continue:
            </p>
    
            <!-- OTP Box -->
            <div style="
              display:inline-block;
              font-size:34px;
              font-weight:700;
              letter-spacing:8px;
              color:#111827;
              padding:18px 28px;
              border-radius:10px;
              background:#f3f4f6;
              border:1px solid #e5e7eb;
            ">
              ${otp}
            </div>
    
            <p style="margin-top:24px;color:#6b7280;font-size:14px;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
    
          </div>
    
          <!-- Divider -->
          <div style="border-top:1px solid #f1f5f9;"></div>
    
          <!-- Footer -->
          <div style="padding:24px 32px;text-align:center;">
            <p style="margin:0;color:#6b7280;font-size:13px;">
              If you didn't request this, you can safely ignore this email.
            </p>
    
            <p style="margin-top:16px;color:#9ca3af;font-size:12px;">
              © ${new Date().getFullYear()} Your App. All rights reserved.
            </p>
          </div>
    
        </div>
    
      </div>
      `,
    });

    return apiOk({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

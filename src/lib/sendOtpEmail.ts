import { sendEmail } from "@/utils/sendEmail";

export async function sendOtpEmail(to: string, otp: string) {
  const subject = "FitTrack Email Verification OTP";
  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px 0;">Verify your email</h2>
      <p style="margin: 0 0 8px 0;">Your FitTrack verification OTP is:</p>
      <p style="font-size: 24px; font-weight: 600; letter-spacing: 4px; margin: 0 0 12px 0;">
        ${otp}
      </p>
      <p style="margin: 0 0 8px 0;">This code will expire in <strong>10 minutes</strong>.</p>
      <p style="margin: 16px 0 0 0; font-size: 12px; color: #6b7280;">
        If you did not create an account, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail({ to, subject, html });
}

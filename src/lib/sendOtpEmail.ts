import { sendEmail } from "@/utils/sendEmail";
import { renderOtpEmail } from "@/lib/email-templates";

export async function sendOtpEmail(to: string, otp: string) {
  const { subject, html } = renderOtpEmail({ kind: "verify", otp });
  await sendEmail({ to, subject, html });
}

export async function sendPasswordResetOtpEmail(to: string, otp: string) {
  const { subject, html } = renderOtpEmail({ kind: "reset", otp });
  await sendEmail({ to, subject, html });
}

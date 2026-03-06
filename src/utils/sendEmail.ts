import nodemailer from "nodemailer";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const host = requireEnv("EMAIL_HOST");
  const port = Number(requireEnv("EMAIL_PORT"));
  const user = requireEnv("EMAIL_USER");
  const pass = requireEnv("EMAIL_PASS");
  const from = requireEnv("EMAIL_FROM");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

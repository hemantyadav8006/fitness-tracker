/**
 * Shared FitTrack email brand — mirrors the app UI revamp
 * (lime accent, charcoal neutrals, dark-first).
 * Inline styles only for email client compatibility.
 */

export const emailBrand = {
  colors: {
    canvas: "#12161c",
    card: "#181d25",
    cardAlt: "#1c222c",
    primary: "#b8ff40",
    primaryMuted: "#84cc16",
    primaryFg: "#0f1408",
    text: "#f4f1ea",
    textMuted: "#9aa3b2",
    border: "#2a3140",
    otpBg: "#243016",
    otpBorder: "#4d7c0f",
    white: "#ffffff",
  },
  fontFamily:
    "'Sora', 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  radius: "14px",
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type FitTrackEmailOptions = {
  title: string;
  previewText: string;
  heading: string;
  bodyHtml: string;
  otp?: string;
  footerNote?: string;
};

/**
 * Modern dark email shell with lime accent bar and optional OTP block.
 */
export function renderFitTrackEmail({
  title,
  previewText,
  heading,
  bodyHtml,
  otp,
  footerNote = "If you didn’t request this, you can safely ignore this email.",
}: FitTrackEmailOptions): string {
  const year = new Date().getFullYear();
  const c = emailBrand.colors;
  const safeOtp = otp ? escapeHtml(otp) : "";

  const otpBlock = otp
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px auto 8px;width:100%;">
        <tr>
          <td align="center">
            <div style="
              display:inline-block;
              font-family:${emailBrand.fontFamily};
              font-size:32px;
              font-weight:700;
              letter-spacing:10px;
              color:${c.primary};
              padding:18px 28px;
              border-radius:12px;
              background:${c.otpBg};
              border:1px solid ${c.otpBorder};
              line-height:1.2;
            ">${safeOtp}</div>
          </td>
        </tr>
      </table>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${c.canvas};color:${c.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(previewText)}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${c.canvas};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;">
          <!-- Brand -->
          <tr>
            <td style="padding:0 0 20px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;width:36px;height:36px;">
                    <!--[if !mso]><!-->
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 32 32" fill="none" style="display:block;">
                      <rect width="32" height="32" rx="10" fill="#181d25"/>
                      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9.25" stroke="#2a3140" stroke-width="1.5"/>
                      <circle cx="16" cy="16" r="9" stroke="#2f3a28" stroke-width="2.5" fill="none"/>
                      <path d="M16 7a9 9 0 1 1-7.794 4.5" stroke="#b8ff40" stroke-width="2.75" stroke-linecap="round" fill="none"/>
                      <circle cx="8.2" cy="11.5" r="2" fill="#b8ff40"/>
                      <circle cx="16" cy="16" r="3.25" fill="#b8ff40"/>
                      <circle cx="16" cy="16" r="1.35" fill="#0f1408"/>
                    </svg>
                    <!--<![endif]-->
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="30%" fillcolor="#181d25" stroke="false" style="width:36px;height:36px;">
                      <center style="color:#b8ff40;font-size:16px;font-weight:bold;">●</center>
                    </v:roundrect>
                    <![endif]-->
                  </td>
                  <td style="padding-left:10px;font-family:${emailBrand.fontFamily};font-size:16px;font-weight:700;letter-spacing:-0.02em;color:${c.text};vertical-align:middle;">
                    FitTrack
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="
              background-color:${c.card};
              border:1px solid ${c.border};
              border-radius:${emailBrand.radius};
              overflow:hidden;
            ">
              <!-- Lime accent bar -->
              <div style="height:3px;background:linear-gradient(90deg, ${c.primaryMuted}, ${c.primary}, ${c.primaryMuted});font-size:0;line-height:0;">&nbsp;</div>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:28px 32px 12px;text-align:center;">
                    <p style="
                      margin:0 0 8px;
                      font-family:${emailBrand.fontFamily};
                      font-size:11px;
                      font-weight:600;
                      letter-spacing:0.16em;
                      text-transform:uppercase;
                      color:${c.primaryMuted};
                    ">FitTrack</p>
                    <h1 style="
                      margin:0;
                      font-family:${emailBrand.fontFamily};
                      font-size:22px;
                      font-weight:700;
                      letter-spacing:-0.025em;
                      line-height:1.3;
                      color:${c.text};
                    ">${escapeHtml(heading)}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 32px 32px;font-family:${emailBrand.fontFamily};">
                    <div style="
                      color:${c.textMuted};
                      font-size:15px;
                      line-height:1.6;
                      text-align:center;
                    ">
                      ${bodyHtml}
                    </div>
                    ${otpBlock}
                  </td>
                </tr>
                <tr>
                  <td style="
                    border-top:1px solid ${c.border};
                    padding:20px 32px 24px;
                    text-align:center;
                    background-color:${c.cardAlt};
                  ">
                    <p style="
                      margin:0;
                      font-family:${emailBrand.fontFamily};
                      font-size:13px;
                      line-height:1.5;
                      color:${c.textMuted};
                    ">${escapeHtml(footerNote)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 8px 0;text-align:center;">
              <p style="
                margin:0;
                font-family:${emailBrand.fontFamily};
                font-size:12px;
                color:${c.textMuted};
              ">
                Track workouts. Build streaks. Stay consistent.
              </p>
              <p style="
                margin:10px 0 0;
                font-family:${emailBrand.fontFamily};
                font-size:11px;
                color:#6b7280;
              ">
                © ${year} FitTrack. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderOtpEmail(opts: {
  kind: "verify" | "reset";
  otp: string;
}): { subject: string; html: string } {
  const { kind, otp } = opts;

  if (kind === "verify") {
    return {
      subject: "Verify your FitTrack email",
      html: renderFitTrackEmail({
        title: "Verify your email",
        previewText: `Your FitTrack verification code is ${otp}`,
        heading: "Verify your email",
        bodyHtml: `
          <p style="margin:0 0 12px;">Welcome to FitTrack. Use this code to confirm your account:</p>
          <p style="margin:20px 0 0;font-size:13px;color:${emailBrand.colors.textMuted};">
            This code expires in <strong style="color:${emailBrand.colors.text};">10 minutes</strong>.
          </p>
        `,
        otp,
        footerNote:
          "If you didn’t create a FitTrack account, you can safely ignore this email.",
      }),
    };
  }

  return {
    subject: "Reset your FitTrack password",
    html: renderFitTrackEmail({
      title: "Password reset",
      previewText: `Your FitTrack password reset code is ${otp}`,
      heading: "Password reset",
      bodyHtml: `
        <p style="margin:0 0 12px;">We received a request to reset your password.</p>
        <p style="margin:0 0 12px;">Enter this verification code to continue:</p>
        <p style="margin:20px 0 0;font-size:13px;color:${emailBrand.colors.textMuted};">
          This code expires in <strong style="color:${emailBrand.colors.text};">10 minutes</strong>.
        </p>
      `,
      otp,
      footerNote:
        "If you didn’t request a password reset, you can safely ignore this email.",
    }),
  };
}

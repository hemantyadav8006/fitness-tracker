import * as Sentry from "@sentry/nextjs";

/**
 * Edge runtime init — used by middleware and edge routes.
 * Keep this lean; the Edge SDK surface is smaller than Node.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  sendDefaultPii: false,
});

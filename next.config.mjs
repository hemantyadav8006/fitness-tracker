import { withSentryConfig } from "@sentry/nextjs";

/**
 * Central Next.js config.
 * App Router is enabled by default in Next 13+ when using the `app` directory.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Quiet locally; louder in CI when source maps upload.
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  // Don't fail the build if Sentry credentials are missing (local/dev).
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});

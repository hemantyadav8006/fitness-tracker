# FitTrack

**Modern fitness tracking** — log workouts, build habits, and watch progress in one dark-first dashboard.

**Live demo:** [fitness-tracker-github.vercel.app](https://fitness-tracker-github.vercel.app/)

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [User guide](#user-guide)
- [User flows](#user-flows)
- [Tech stack](#tech-stack)
- [Getting started (developers)](#getting-started-developers)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [API overview](#api-overview)
- [Design system](#design-system)
- [Email](#email)
- [Deploy](#deploy)

---

## Overview

FitTrack is a full-stack web app for people who want a calm, focused place to track training and body metrics—not a noisy social feed.


| Audience           | What you get                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Everyday users** | Sign up, verify email, log workouts & habits, record weight/waist, see charts                           |
| **Developers**     | Next.js App Router, MongoDB/Mongoose, JWT auth, Tailwind design tokens, Framer Motion + Three.js polish |


The product defaults to a **dark theme** (better for data-dense screens), with a lime accent, glass navigation, and a subtle 3D progress-ring background. Light mode is available via the theme toggle.

---

## Features

- **Auth** — register, email OTP verification, login, logout, forgot/reset password (OTP)
- **Dashboard** — high-level stats and charts (workouts, habits, weight, waist)
- **Workouts** — create templates, quick-log sessions
- **Habits** — define habits, daily check-ins, completion views / heatmap
- **Progress** — weight & waist entries over time with charts
- **Marketing site** — landing page with features, pricing, and CTAs
- **UI** — responsive layout (sidebar desktop / bottom nav mobile), theme toggle, motion + 3D ambience

---

## User guide

### For first-time visitors

1. Open the [live site](https://fitness-tracker-github.vercel.app/) or your local `http://localhost:3000`.
2. Browse the landing page, or click **Get Started** / **Register**.
3. Create an account with **username**, **email**, and **password**.
4. Check your email for a **6-digit OTP** (expires in 10 minutes).
5. Open **Verify email**, enter the code, then **Log in**.
6. Use the sidebar (or mobile bottom bar) to move between **Dashboard**, **Workouts**, **Habits**, and **Progress**.

### Day-to-day usage


| Page          | What to do                                                              |
| ------------- | ----------------------------------------------------------------------- |
| **Dashboard** | Glance at totals and trend charts                                       |
| **Workouts**  | Create a template (name, exercises notes), then quick-log a session     |
| **Habits**    | Add habits, mark today’s completion / values                            |
| **Progress**  | Add weight (kg) and waist (cm) with optional notes; browse past entries |
| **Theme**     | Sun/moon control in the navbar — switch light/dark anytime              |


### Password reset

1. On **Login**, open **Forgot password**.
2. Enter your email → receive an OTP.
3. On **Reset password**, enter email + OTP + new password.
4. Sign in with the new password.

### Tips

- OTPs expire after **10 minutes**; use **Resend OTP** if needed.
- You must **verify email** before login succeeds.
- Charts need a few logged entries before trends look meaningful.

---

## User flows

### Registration & verification

```text
Landing → Register → Email OTP sent
       → Verify OTP → Login → Dashboard
```

### Login (already verified)

```text
Landing / Login → credentials → Dashboard
```

### Forgot password

```text
Login → Forgot password → OTP email
     → Reset password (OTP + new password) → Login
```

### Core tracking loop

```text
Dashboard (overview)
    ├─ Workouts → template / quick log → charts update
    ├─ Habits   → define / check in   → completion charts
    └─ Progress → weight & waist      → trend charts
```

```mermaid
flowchart TD
  A[Landing] --> B{Signed in?}
  B -->|No| C[Register / Login]
  C --> D[Verify email OTP if needed]
  D --> E[Dashboard]
  B -->|Yes| E
  E --> F[Workouts]
  E --> G[Habits]
  E --> H[Progress]
  F --> E
  G --> E
  H --> E
```



---

## Tech stack


| Layer       | Choice                                                                    |
| ----------- | ------------------------------------------------------------------------- |
| Framework   | **Next.js 16** (App Router) + **React 19** + **TypeScript**               |
| Styling     | **Tailwind CSS 3**, CSS variables (light/dark), `clsx` + `tailwind-merge` |
| Motion / 3D | **Framer Motion**, **Three.js** via `@react-three/fiber` + `drei`         |
| Charts      | **Recharts**                                                              |
| Icons       | **Lucide React**                                                          |
| Theme       | **next-themes** (`class="dark"` on `<html>`)                              |
| Database    | **MongoDB** + **Mongoose**                                                |
| Auth        | **JWT** (cookie), **bcryptjs**, OTP via email                             |
| Validation  | **Zod**                                                                   |
| Email       | **Nodemailer** + shared HTML templates (`src/lib/email-templates.ts`)     |


---

## Getting started (developers)

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm (or yarn / pnpm / bun)
- A MongoDB database (Atlas or local)
- SMTP credentials for OTP emails (e.g. Gmail App Password)

### Install

```bash
git clone https://github.com/hemantyadav8006/fitness-tracker.git
cd fitness-tracker
npm install
```

### Configure environment

Create a `.env` file in the project root (see [Environment variables](#environment-variables)). Never commit real secrets.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Quality checks

```bash
npm run lint
npm run typecheck
npm run format
```

---

## Environment variables

Copy the shape below into `.env`. Values shown are placeholders only.

```env
# MongoDB
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/DB_NAME

# Auth
JWT_SECRET=replace-with-long-random-secret
BCRYPT_SALT_ROUNDS=10

# Email (Nodemailer / SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=your-app-password
EMAIL_FROM=you@example.com
```


| Variable             | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `MONGODB_URI`        | Connection string for Mongoose                              |
| `JWT_SECRET`         | Signs session JWTs — use a long random string in production |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost (e.g. `10`)                           |
| `EMAIL_*`            | SMTP for verification & password-reset OTPs                 |


---

## Scripts


| Command             | Description                 |
| ------------------- | --------------------------- |
| `npm run dev`       | Next.js development server  |
| `npm run build`     | Production build            |
| `npm start`         | Serve production build      |
| `npm run lint`      | ESLint                      |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run format`    | Prettier write              |


---

## Project structure

```text
fitness-tracker/
├── public/                 # Static assets (favicon, logo, manifest)
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout: fonts, theme, 3D background
│   │   ├── page.tsx        # Marketing landing
│   │   ├── globals.css     # Design tokens + base styles
│   │   ├── (auth)/         # login, register, verify-otp, forgot/reset
│   │   ├── (dashboard)/    # dashboard, workouts, habits, progress
│   │   └── api/            # Route handlers (auth, habits, progress, workouts)
│   ├── components/
│   │   ├── ui/             # Button, Card, Input, Modal, Badge, …
│   │   ├── layout/         # Navbar, Sidebar, MobileNav
│   │   ├── marketing/      # Landing sections + mocks
│   │   ├── charts/         # Recharts wrappers
│   │   ├── habits/         # Habit forms & heatmap
│   │   ├── workouts/       # Template & quick-log forms
│   │   ├── progress/       # Progress form & entries
│   │   ├── scene/          # Three.js background (lazy)
│   │   ├── theme-*.tsx     # Theme provider & toggle
│   │   └── motion-reveal.tsx
│   ├── lib/                # auth, db, validation, email templates, cn, motion
│   ├── models/             # Mongoose: User, Habit, Workout, Progress
│   ├── types/              # Shared DTOs / domain types
│   └── utils/              # sendEmail, helpers
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

### Route groups


| Group         | Routes                                                                      | Notes                                     |
| ------------- | --------------------------------------------------------------------------- | ----------------------------------------- |
| Marketing     | `/`                                                                         | Public landing                            |
| `(auth)`      | `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password` | Unauthenticated flows                     |
| `(dashboard)` | `/dashboard`, `/workouts`, `/habits`, `/progress`                           | JWT required; redirects to `/` if missing |


---

## API overview

All handlers live under `src/app/api/`. Responses typically use helpers in `src/lib/api-response.ts`. Inputs are validated with Zod (`src/lib/validation.ts`).

### Auth


| Method | Path                         | Purpose                       |
| ------ | ---------------------------- | ----------------------------- |
| `POST` | `/api/auth/register`         | Create user + send verify OTP |
| `POST` | `/api/auth/verify-otp`       | Confirm email                 |
| `POST` | `/api/auth/resend-otp`       | Resend verify OTP             |
| `POST` | `/api/auth/login`            | Issue JWT cookie              |
| `POST` | `/api/auth/logout`           | Clear auth cookie             |
| `POST` | `/api/auth/forgot-password`  | Send reset OTP                |
| `POST` | `/api/auth/verify-reset-otp` | Validate reset OTP            |
| `POST` | `/api/auth/reset-password`   | Set new password              |


### Domain


| Area     | Paths (examples)                                                                     |
| -------- | ------------------------------------------------------------------------------------ |
| Habits   | `/api/habits`, `/api/habits/[id]`, `/api/habits/entries`, `/api/habits/completion`   |
| Workouts | `/api/workouts/templates`, `/api/workouts/logs`, `/api/workouts/frequency`           |
| Progress | `/api/progress`, `/api/progress/[id]`, `/api/progress/weight`, `/api/progress/waist` |


Protected routes expect a valid session from `getUserFromRequest()` (`src/lib/auth.ts`).

---

## Design system

- **Accent:** vivid lime (energy / streaks)
- **Neutrals:** charcoal family (not flat gray)
- **Mode:** dark-first; light tokens tuned for marketing
- **Type:** Sora (display / stats) + Inter (UI body) via `next/font`
- **Tokens:** CSS variables in `globals.css`, mapped in `tailwind.config.ts`
- **Motion:** Framer Motion with `prefers-reduced-motion` support
- **Background:** centered Three.js progress ring (lazy-loaded; disabled under reduced motion)
- **Email:** same brand language in `src/lib/email-templates.ts`

---

## Email

OTP emails (verify + password reset) share one dark HTML shell:

- Lime accent bar and OTP block
- FitTrack branding and short footer
- Expiry copy: **10 minutes**

SMTP must be configured via `EMAIL_*` env vars or auth emails will fail at runtime.

---

## Deploy

The app is Vercel-friendly (Next.js App Router).

1. Push the repo to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Add the same environment variables as local `.env`.
4. Deploy — production URL will be assigned (or use your custom domain).

Ensure MongoDB Atlas network access allows your host (or `0.0.0.0/0` for serverless if you accept that tradeoff).

---



## Author

Built by [hemantyadav8006](https://github.com/hemantyadav8006) — repo: [fitness-tracker](https://github.com/hemantyadav8006/fitness-tracker).
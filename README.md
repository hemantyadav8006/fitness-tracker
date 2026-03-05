### Fitness Tracker – Next.js App

A minimal, production-ready fitness tracking web app built with **Next.js App Router**, **TypeScript (strict)**, **Tailwind CSS**, **MongoDB/Mongoose**, **JWT auth**, and **Recharts**.

### Tech stack

- **Frontend**: Next.js 14 App Router, React 18, Tailwind CSS, Recharts
- **Backend**: Next.js route handlers (serverless-friendly), MongoDB, Mongoose
- **Auth**: Username/password, bcrypt hashing, JWT in HTTP-only cookie
- **Validation**: Zod schemas shared across API routes

### Folder structure (high level)

- `app/` – App Router pages and layouts
  - `(auth)/` – Public auth routes (`/login`, `/register`)
  - `(dashboard)/` – Protected dashboard routes (`/dashboard/*`)
  - `api/` – All API route handlers (`/api/auth/*`, `/api/workouts/*`, `/api/habits/*`, `/api/progress/*`)
- `components/` – Reusable UI components and Recharts charts
- `lib/` – Cross-cutting concerns (`db` connection, `auth` helpers, `validation`, API response helpers)
- `models/` – Mongoose models for all entities
- `types/` – Shared TypeScript domain and API types

### Environment variables

Copy `.env.example` to `.env.local` and set:

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Long random secret for JWT signing
- `BCRYPT_SALT_ROUNDS` – Bcrypt cost factor (e.g. 10–12)

### Running locally

```bash
pnpm install # or npm install / yarn
pnpm dev
```

Then open `http://localhost:3000`.

### Deployment

Deploy directly to Vercel:

- Set environment variables in the Vercel dashboard
- Use the default **Build Command** (`next build`) and **Output Directory** (`.next`)


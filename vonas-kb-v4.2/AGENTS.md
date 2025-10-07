# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Next.js 15 app (App Router)
  - `src/app/`: Routes, API routes under `app/api`
  - `src/components/`: UI components
  - `src/hooks/`: React hooks
  - `src/lib/`: Utilities, query client, Sanity client (server-side)
  - `src/data/`: Static types and seed data
- `sanity/` + `sanity.config.ts`: Sanity Studio schemas and config (kb schema used by app)
- `shared/`: Cross‑cutting code and database schema (e.g., `shared/schema.ts` for Drizzle ORM)
- `attached_assets/`: Static assets referenced via `@assets/*`
- `archive/`: Archived legacy code (e.g., previous Vite client or Express server)

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js in development (app + API on one port)
- `npm run build`: Build Next.js production bundle
- `npm start`: Run the production server (`next start`)
- `npm run check`: TypeScript type check
- `npm run db:push`: Apply Drizzle schema changes to the database

## Coding Style & Naming Conventions
- Indentation: 2 spaces; TypeScript strict mode enabled
- Components: PascalCase exports; files and folders use kebab‑case (e.g., `components/content/main-content.tsx`)
- Imports: Prefer `@/...` aliases over deep relative paths; use `@shared/*` for cross‑runtime code
- Styling: TailwindCSS utilities; keep class lists readable and co-locate related UI pieces

## Testing Guidelines
- No test framework is configured yet. Validate changes via `npm run dev`, exercise key flows, and ensure `npm run check` passes.
- For PRs, include manual test steps and expected results; add small, pure functions to ease future unit testing.

## Commit & Pull Request Guidelines
- Commits: Imperative, concise summaries (e.g., “Add AI search option”); keep under ~72 chars; group related changes.
- PRs: Clear description, linked issues, reproduction steps, and screenshots/GIFs for UI changes; note any env or migration impacts.

## Security & Configuration Tips
- Env: Copy `.env.local.example` to `.env.local` and set `DATABASE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`. Never commit secrets.
- Do not hard‑code tokens in scripts; read from environment instead. Rotate any leaked credentials and update `.gitignore` as needed.

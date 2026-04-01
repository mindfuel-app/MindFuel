# AGENTS.md

This file is for coding agents working in `MindFuel`.
Follow these repo-specific rules before making changes.

## 1) Project Snapshot

- Stack: Next.js (Pages Router), React 18, TypeScript, Tailwind CSS.
- API layer: tRPC (`src/server/api`).
- Auth: NextAuth (`src/server/auth.ts`).
- DB: Prisma + PostgreSQL/Supabase (`prisma/schema.prisma`).
- Package manager: npm (`package-lock.json` present).
- Path alias: `~/*` => `src/*` (see `tsconfig.json`).

## 2) Source of Truth for Tooling

- Scripts: `package.json`.
- Lint rules: `.eslintrc.cjs`.
- Formatting: `prettier.config.cjs` with Tailwind plugin.
- TS strictness: `tsconfig.json` (`strict: true`, `noUncheckedIndexedAccess: true`).
- PWA behavior: `next.config.js` (`next-pwa`, disabled in dev).

## 3) Cursor/Copilot Rules

- No `.cursor/rules/` found.
- No `.cursorrules` found.
- No `.github/copilot-instructions.md` found.
- If these files are added later, treat them as higher-priority repo guidance.

## 4) Setup and Run Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Start built app: `npm run start`
- Lint: `npm run lint`
- Prisma client generation: `npx prisma generate`
- Prisma schema status: `npx prisma migrate status --schema prisma/schema.prisma`
- Prisma introspection (when needed): `npx prisma db pull --schema prisma/schema.prisma`

## 5) Test Commands (Current State + Single Test)

There is currently **no test runner configured** in `package.json`.

- No Jest config found.
- No Vitest config found.
- No Playwright/Cypress config found.

Practical quality gate right now:

- Run `npm run lint` after changes.
- Run `npm run build` when touching app-wide behavior.

If a test framework is introduced, use these single-test patterns:

- Jest single file: `npx jest path/to/file.test.ts`
- Jest single test: `npx jest path/to/file.test.ts -t "test name"`
- Vitest single file: `npx vitest run path/to/file.test.ts`
- Vitest single test: `npx vitest run path/to/file.test.ts -t "test name"`

## 6) Environment and Secrets

- Required server envs are validated in `src/env.mjs`.
- Do not hardcode secrets.
- Do not print secret values in logs, PR text, or generated docs.
- If DB connectivity fails with Prisma `P1001`, verify:
  - `DATABASE_URL` is current and valid.
  - Supabase host/port/protocol/SSL params match dashboard values.
  - Network/firewall allows outgoing DB connection.

## 7) Architecture and File Placement

- Pages: `src/pages/**`.
- Reusable UI/components: `src/components/**`.
- Hooks: `src/hooks/**`.
- Server routers: `src/server/api/routers/**`.
- tRPC root: `src/server/api/root.ts`.
- Prisma client init: `src/server/db.ts`.

When adding features:

- Add new backend behavior as a tRPC router/procedure.
- Register new router in `src/server/api/root.ts`.
- Consume via `api.*` hooks from `src/utils/api.ts`.

## 8) Code Style and Formatting

- Language: TypeScript first.
- Quotes: double quotes.
- Semicolons: required (match existing files).
- Formatting: Prettier defaults + Tailwind class sorting.
- Keep lines readable; avoid dense one-liners.
- Use `cn(...)` utility for conditional class names.

## 9) Imports and Module Conventions

- Prefer absolute imports via `~/*` for `src` modules.
- Keep external imports before internal imports.
- Keep related imports grouped; remove unused imports.
- Prefer `import type` where appropriate (ESLint warns for consistency).
- Avoid deep relative chains like `../../../` when alias can be used.

## 10) Types and Data Safety

- Respect strict TypeScript settings.
- Avoid `any`; prefer inferred tRPC/Prisma/Zod types.
- Validate external inputs with Zod schemas.
- For tRPC procedures, type input with `z.object(...)`.
- For nullable DB fields, guard before use in UI.
- Do not silence type errors globally to “make it pass”.

## 11) Naming Conventions

- Components: PascalCase (`TaskCard`, `ProfileLayout`).
- Hooks: `useXxx` (`useTasks`, `useTheme`).
- Variables/functions: camelCase.
- Constants: camelCase or UPPER_SNAKE_CASE for true constants.
- File names: match existing local convention in folder.

## 12) UI and Frontend Patterns

- Tailwind is primary styling mechanism.
- Reuse existing layout shells before creating new wrappers.
- Keep theme-aware styling (`teal` / `orange-red`) via `useTheme` and `cn`.
- Use Framer Motion sparingly and meaningfully.
- Preserve responsive behavior (mobile-first, desktop enhanced).
- Keep accessibility basics: labels, button semantics, focus states.

## 13) Error Handling

- Prefer explicit user-facing feedback on mutations:
  - `onSuccess` for refresh/close/toast flows.
  - `onError` for actionable messages.
- For auth/route guards, follow existing redirect patterns.
- For async client calls, avoid unhandled promises.
- On server, throw clear errors (tRPC/NextAuth paths already do this).

## 14) Lint and Existing Technical Debt

- `npm run lint` currently reports legacy issues in some server files.
- Do not broaden unrelated refactors while fixing a focused task.
- If you touch a file with lint debt, improve nearby code safely.
- Avoid adding new `eslint-disable` unless justified and narrow in scope.

## 15) Agent Workflow Checklist

Before editing:

- Read target files and nearby shared components.
- Check whether there is an existing pattern you can reuse.

While editing:

- Keep diffs focused and minimal.
- Preserve behavior unless change is requested.

After editing:

- Run `npm run lint`.
- Run `npm run build` for larger or risky changes.
- Summarize changed files and any follow-up needed.

## 16) Git Hygiene for Agents

- Never revert unrelated local changes.
- Avoid destructive git commands.
- Do not commit secrets or `.env` values.
- Keep commit scope small and descriptive when asked to commit.

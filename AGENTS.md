# Agent Guidelines & Engineering Reference

This repository is **Mingo**, a gold-themed language learning web application built with Next.js App Router, TypeScript, and Bun.

## Architecture & Code Organization

For full module boundaries, domain layouts, and product terminology, see:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`tasks/plan.md`](tasks/plan.md) and [`tasks/todo.md`](tasks/todo.md)

### Layer Rules

- `src/app/`: Next.js App Router composition only.
- `src/features/<domain>/`: Self-contained domains (`auth`, `onboarding`, `course`, `lesson`, `review`, `progress`).
- `src/shared/calc/`: Pure, zero-dependency calculation functions (scoring, intervals, streaks).
- `src/server/db/`: Server-only database client and operations. Never import into client components.
- No barrel files (`index.ts`) and no dumping directories (`utils/`, `common/`).

## Canonical Commands

All commands run via Bun:
- `bun run dev`: Start local development server.
- `bun run build`: Build production Next.js application.
- `bun run start`: Start production server.
- `bun run lint`: Run Biome formatter and linter checks (`biome check .`).
- `bun run lint:fix`: Format and autofix lint errors with Biome (`biome check --write .`).
- `bun run format`: Format code with Biome (`biome format --write .`).
- `bun run typecheck`: Run reference typecheck (`tsc --noEmit`).
- `bun run typecheck:fast`: Run fast typecheck with `tsrs` (`tsrs -p tsconfig.json --noEmit`).
- `bun test`: Run logic unit tests using Bun's built-in test runner.
- `bun run verify`: Run lint, typecheck, unit tests, and production build.

## Pre-Commit & CI

- Lefthook runs fast staged-file Biome checks and `typecheck:fast` on pre-commit.
- Emergency hook bypass: `LEFTHOOK=0 git commit` or `git commit --no-verify`.
- CI runs `bun install --frozen-lockfile`, `bun run lint`, both typecheck lanes, `bun test`, and `bun run build`.

## Browser Verification

- Fast DOM snapshot: `agent-browser --engine lightpanda open <url> && agent-browser snapshot`
- Visual & console error check: `agent-browser --engine chrome open <url> && agent-browser screenshot`

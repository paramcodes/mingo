# Implementation Plan: Gold-Themed Language Learning MVP

## Overview

Build a responsive web app for short, structured language lessons with a warm gold-yellow visual identity. The MVP should deliver a complete learning loop: choose a course and goal, follow a guided path, complete lessons with useful feedback, review material later, and see saved progress. This is a product inspired by effective language-learning interaction patterns, with its own brand, copy, illustrations, and characters.

This is a plan only. The repository is currently empty; no application code or dependencies have been added.

## Goals and Non-Goals

### Goals

- A working onboarding-to-lesson-to-review flow with authenticated, persistent learner progress.
- A small curated starter course and a repeatable content format.
- Responsive, accessible UI with motion that respects reduced-motion preferences.
- Reproducible Bun setup, clear architecture, and the requested agent-first tooling.

### Non-goals for the MVP

- Native mobile applications, multiple full course catalogs, leaderboards, friend features, subscriptions, a shop, AI conversation, speech scoring, or offline mode.
- Reusing Duolingo's name, logo, characters, bespoke typefaces, or illustrations.

## Architecture Decisions

- **Web framework:** Next.js App Router with TypeScript. Use server components for static/course data and server-side access; keep lesson interaction and animation in small client components. If this becomes a purely authenticated SPA with no public landing/content pages, reconsider Vite before scaffolding.
- **UI and styling:** HeroUI with Tailwind CSS and project-owned design tokens. Define cream surfaces, deep ink text, and gold/amber accents; do not use bright yellow for small text.
- **Motion:** Motion for routine interaction and state transitions; Rive for original mascot/reward assets; GSAP only for isolated, deliberately choreographed sequences. Avoid implementing the same interaction in multiple motion systems.
- **Data and auth:** Supabase Postgres, Auth, and Storage. Use Row Level Security for learner-owned records. The Supabase SSR integration is documented as beta, so validate it in a small auth spike before committing the app architecture.
- **Content access:** Start with curated, versioned lesson content and a simple internal authoring/import path. Keep course structures separate from rendering. Add an editor only if authoring friction warrants it.
- **Package manager/runtime:** Bun with committed text `bun.lock`; use frozen-lockfile installation in CI. Keep deployment on the platform-compatible Node runtime unless Bun runtime deployment is separately validated.
- **Lint and formatting:** Biome is the sole formatter and JS/TS linter. Lefthook runs only fast staged-file checks; longer checks belong in CI.
- **Logic tests:** Use Bun's built-in `bun test` for pure scheduling, scoring, and schema logic to avoid adding a second test runner for the MVP.
- **Type checking:** Use `tsrs` as the requested fast checker after a compatibility spike. It is a Rust port targeting TypeScript 7 with an explicit conformance goal; keep `tsc --noEmit` as a CI/reference check until the app's framework and library types are shown to agree.
- **Browser verification:** Use Vercel `agent-browser` CLI. Use its Lightpanda engine for fast DOM-driven smoke flows where supported; use its Chrome engine for visual/CSS checks because Lightpanda does not render pixels and documents partial Web API support. Do not make the test suite depend on Playwright Test.
- **Project structure:** Keep Next route files as thin transport/composition. Put domain code under `src/features/<domain>/`; one-way dependencies flow UI/routes → services → repositories → the single server DB client. Keep pure scheduling/scoring under `src/shared/calc/`. No barrel files or generic `utils`/`common` dumping folders.
- **Observability:** Track a small set of product events (onboarding completed, lesson started/completed, review completed, return visit) with privacy-conscious properties. Defer session replay and broad autocapture until needed.

## MVP Feature Slices

1. **Foundation and design system:** responsive app shell, gold-theme tokens, accessibility baseline, repository instructions, and reproducible toolchain.
2. **Onboarding and account:** choose a target course and daily goal; sign up/sign in; persist learner profile. A placement check is optional and only included if starter-course content supports it.
3. **Guided course path:** show units, lesson steps, locked/current/completed states, and resume position from persisted progress.
4. **Lesson session:** support a small exercise set (choice, typed recall, listening); provide immediate correctness feedback, accepted-answer handling, and concise explanation; persist completion and earned progress.
5. **Review session:** schedule missed/learned concepts for future retrieval using a simple, explainable scheduler; surface due reviews and persist outcomes.
6. **Progress and return loop:** show course progress, daily goal, and a simple streak. Instrument the core learning funnel.
7. **Release polish:** reduced-motion behavior, keyboard/touch behavior, browser smoke coverage, error/loading/empty states, and production deployment configuration.

## Task List

See `tasks/todo.md` for task acceptance criteria, verification, dependencies, and likely files.

### Phase 1: Foundation

- Task 1: Scaffold the app and responsive shell.
- Task 2: Document architecture and agent context.
- Task 3: Configure Biome and Lefthook.
- Task 4: Configure Bun scripts, `tsrs`, reference typecheck, and CI.
- Task 5: Prove agent-browser with Lightpanda and Chrome.

### Checkpoint: Foundation

- Confirm Bun frozen installs, Biome, Lefthook, `tsrs` plus reference typecheck, build, and `agent-browser` flows work from a clean checkout.
- Review the initial architecture and token system before feature slices.

### Phase 2: First Learning Loop

- Task 6: Add account setup and learner onboarding.
- Task 7: Define starter-course content and guided path.
- Task 8: Deliver the interactive lesson session.
- Task 9: Add review scheduling and review session.

### Checkpoint: Learning loop

- A learner can onboard, complete a lesson, leave, return, and complete due review with progress preserved.

### Phase 3: Retention and Release Readiness

- Task 10: Add progress summary, daily goal/streak, and product events.
- Task 11: Finish responsive/accessibility/error states and deployment readiness.

### Checkpoint: MVP complete

- Core criteria are satisfied; checks report real outcomes; no unresolved blocker prevents a learner from completing the full loop.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `tsrs` targets TypeScript 7 and may differ in framework/library diagnostics | Medium | Run a compatibility spike; retain `tsc --noEmit` in CI as the reference until parity is confirmed. |
| Lightpanda is headless without graphical rendering and has partial Web API support | Medium | Use Lightpanda for fast supported DOM flows; use agent-browser with Chrome for screenshot/layout and unsupported APIs. |
| Agent-browser and Lightpanda versions/options evolve quickly | Medium | Pin the CLI and engine in project docs/config; validate the combined invocation before feature implementation. |
| Supabase SSR package is beta | Medium | Validate session refresh, server auth checks, and RLS before relying on it; keep auth access behind a server boundary. |
| Three motion systems can create inconsistent timing and cleanup | Medium | Assign Motion/Rive/GSAP distinct roles and prefer Motion unless an authored asset or timeline requires another tool. |
| A full language curriculum is content-heavy | High | Limit MVP to one defined course slice and establish a content schema/authoring workflow early. |
| Gold-yellow palette can reduce readability | Medium | Pair gold accents with deep ink text; check contrast for all semantic states and interactive controls. |

## Open Questions / Assumptions

- **Assumption:** the first deliverable is a responsive web app, not native mobile.
- **Open:** which source and target language pair should the starter course teach?
- **Open:** should learners be able to try a lesson before creating an account, or is sign-in required up front?
- **Open:** is Supabase an accepted backend choice, or should the backend remain local/mock data for the first UI milestone?
- **Open:** should reminders be in-app only for MVP, or should email/push delivery be included?
- **Call to confirm during foundation:** current `tsrs` is an early TypeScript 7 checker; this plan treats it as the local primary checker and retains official `tsc` as a reference check until compatibility is established.

## Research References

- [Duolingo learning path and spaced review overview](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [HeroUI introduction](https://heroui.com/docs/introduction)
- [Motion for React](https://motion.dev/docs/react)
- [GSAP documentation](https://gsap.com/docs/v3/GSAP/)
- [Rive runtimes overview](https://rive.app/docs/auth)
- [Bun lockfile documentation](https://bun.com/docs/pm/lockfile)
- [Biome linter](https://biomejs.dev/linter/)
- [Lefthook with Biome](https://next.biomejs.dev/recipes/git-hooks/)
- [Vercel agent-browser](https://github.com/vercel-labs/agent-browser)
- [Lightpanda documentation](https://lightpanda.io/docs/)
- [Oxc tsrs](https://github.com/oxc-project/tsrs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Vocabulary learning study on spacing, feedback, and testing](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638698/)

# Task List: Gold-Themed Language Learning MVP

## Phase 1: Foundation

### Task 1: Scaffold the app and responsive shell

**Description:** Create a responsive Next.js App Router application with TypeScript, Bun, and a minimal route/shell. Establish the gold-theme token entry point without building full feature screens.

**Acceptance criteria:**
- [ ] A clean checkout can install and start the app with Bun; the initial route renders.
- [ ] The app shell responds at phone and desktop widths and uses the project-owned color tokens.
- [ ] No product UI imports Duolingo marks, characters, copy, or proprietary fonts.

**Verification:**
- [ ] `bun install --frozen-lockfile` succeeds from a clean checkout.
- [ ] `bun run dev` starts and the root route returns successfully over HTTP.
- [ ] Inspect the initial route at phone and desktop widths in Chrome.

**Dependencies:** None.

**Files likely touched:** `package.json`, `bun.lock`, `app/`, `src/app.css`, `.gitignore`.

**Estimated scope:** Medium.

### Task 2: Document architecture and agent context

**Description:** Define the domain-oriented layout, dependency directions, server/client boundaries, and current product vocabulary. Add one concise root `AGENTS.md` that routes future sessions to the architecture and task docs.

**Acceptance criteria:**
- [ ] Root `AGENTS.md` is concise and points to `docs/ARCHITECTURE.md`; no duplicate instruction files drift.
- [ ] Routes/composition, feature domains, shared calculations, and server database access have explicit locations and one-way dependency rules.
- [ ] Content, progress, lesson, review, and auth terminology is consistent in docs.

**Verification:**
- [ ] Review the route and source tree against the architecture document.
- [ ] Confirm all commands recorded in `AGENTS.md` exist in package scripts or docs.

**Dependencies:** Task 1.

**Files likely touched:** `AGENTS.md`, `docs/ARCHITECTURE.md`.

**Estimated scope:** Small.

### Task 3: Configure Biome and Lefthook

**Description:** Configure Biome as the only JS/TS formatter and linter, and Lefthook for fast staged-file checks. Keep hooks deterministic and leave longer checks to CI.

**Acceptance criteria:**
- [ ] Biome format/check scripts work and no second JS/TS formatter or linter is configured.
- [ ] Lefthook runs only fast checks on staged files and has a documented bypass for emergency use.
- [ ] CI can run the same Biome check without relying on installed git hooks.

**Verification:**
- [ ] Run the Biome scripts and inspect exit codes.
- [ ] Confirm a staged formatting/lint violation is caught by Lefthook.

**Dependencies:** Tasks 1 and 2.

**Files likely touched:** `package.json`, `biome.json`, `lefthook.yml`, `AGENTS.md`.

**Estimated scope:** Small.

### Task 4: Configure Bun scripts, typechecking, and CI

**Description:** Add canonical Bun scripts, adopt `tsrs` as the requested fast checker, retain `tsc --noEmit` as the reference lane while compatibility is assessed, and configure CI with frozen Bun installs.

**Acceptance criteria:**
- [ ] `bun.lock` is committed and CI installs with `bun install --frozen-lockfile`.
- [ ] `tsrs` and `tsc --noEmit` both run against the framework configuration; their initial results and incompatibilities are documented.
- [ ] CI runs frozen install, Biome, both typecheck lanes, Bun unit tests, and production build without global tools.
- [ ] Deployment uses Node unless a separate Bun runtime deployment check demonstrates compatibility.

**Verification:**
- [ ] Run all configured package scripts locally and inspect exit codes.
- [ ] Run a clean CI-equivalent sequence with frozen lockfile.
- [ ] Confirm the unit test command is Bun's built-in `bun test`.

**Dependencies:** Tasks 1–3.

**Files likely touched:** `package.json`, `tsconfig.json`, CI workflow, `AGENTS.md`.

**Estimated scope:** Medium.

### Task 5: Prove agent-browser with Lightpanda and Chrome

**Description:** Pin/configure Vercel `agent-browser` and verify both its Lightpanda engine and Chrome engine. Use Lightpanda for fast supported DOM interaction and Chrome for rendered layout, screenshots, and browser behaviors Lightpanda does not support.

**Acceptance criteria:**
- [ ] One documented CLI command opens the local app and captures a useful DOM snapshot in Lightpanda.
- [ ] One documented CLI command opens the local app in Chrome and captures a screenshot plus console/page errors.
- [ ] The project does not add Playwright Test as its test runner; any required browser libraries are only those agent-browser itself needs.
- [ ] Unsupported Lightpanda behavior has a documented Chrome fallback.

**Verification:**
- [ ] Run both commands against the local app and record browser/engine versions.
- [ ] Confirm agent-browser reports browser errors and screenshot output as expected.

**Dependencies:** Tasks 1 and 4.

**Files likely touched:** `package.json`, browser tooling config/docs, `AGENTS.md`, `.gitignore`.

**Estimated scope:** Small.

## Checkpoint: Foundation

- [ ] Bun frozen install, Biome, Lefthook, both typecheck lanes, and build complete as documented.
- [ ] Agent-browser works with Lightpanda for DOM checks and Chrome for visual checks.
- [ ] Architecture and gold-theme tokens reviewed before feature development.

## Phase 2: First Learning Loop

### Task 6: Add account setup and learner onboarding

**Description:** Set up Supabase access behind server boundaries and add sign-up/sign-in plus onboarding for target course and daily goal. Persist a learner profile with Row Level Security. Keep placement optional unless starter content supports it.

**Acceptance criteria:**
- [ ] A learner can create an account, sign in, and complete onboarding.
- [ ] Course and daily-goal choices persist and appear when the learner returns.
- [ ] Authenticated routes and learner-owned rows are protected by server checks and database policies.
- [ ] Loading, invalid-input, and auth-failure states are usable with keyboard and touch.

**Verification:**
- [ ] Run focused service/schema checks and the agent-browser auth/onboarding flow.
- [ ] Verify unauthenticated access is rejected and one learner cannot read another learner's profile.
- [ ] Validate session refresh and server auth behavior with the selected Supabase SSR integration.

**Dependencies:** Tasks 1–5.

**Files likely touched:** `src/features/auth/`, `src/features/onboarding/`, `src/server/db/`, Supabase migrations/policies, route files.

**Estimated scope:** Medium.

### Task 7: Define starter-course content and guided path

**Description:** Add the starter-course content schema and a small curated unit, then implement the learner path with current, completed, locked, and resume states. Keep course content separate from rendering.

**Acceptance criteria:**
- [ ] A learner sees the current lesson, completed lessons, and the next available step.
- [ ] Course and unit structure is versioned and validated against a runtime schema.
- [ ] Current position and lesson availability derive from learner progress rather than presentation-only state.
- [ ] Content data can represent accepted answer variants, explanations, and listening assets.

**Verification:**
- [ ] Schema checks accept valid sample content and reject malformed content.
- [ ] Agent-browser verifies path states and resume position in Lightpanda where supported.
- [ ] Chrome visual check covers desktop/mobile layout and focus states.

**Dependencies:** Task 6.

**Files likely touched:** `src/features/course/`, course content data, relevant route files.

**Estimated scope:** Medium.

### Task 8: Deliver the interactive lesson session

**Description:** Implement a focused lesson session with choice, typed recall, and listening exercises; provide immediate feedback and explanations; persist attempts and completion.

**Acceptance criteria:**
- [ ] Lesson answers are validated and receive immediate correct/incorrect feedback with a useful explanation.
- [ ] Accepted answer variants and listening assets are consumed from the course content contract.
- [ ] Completing a lesson saves progress and allows resuming at the next step.
- [ ] Lesson interaction works with keyboard and touch and exposes semantic answer states.

**Verification:**
- [ ] Unit checks cover scoring, accepted variants, and completion calculations.
- [ ] Agent-browser completes representative correct and incorrect lesson paths in Lightpanda where supported.
- [ ] Chrome visual check covers audio controls and reduced-motion behavior.

**Dependencies:** Task 7.

**Files likely touched:** `src/features/lesson/`, `src/shared/calc/`, focused route/component files.

**Estimated scope:** Medium.

### Task 9: Add review scheduling and review session

**Description:** Implement a simple, explainable review scheduler for learned concepts and missed answers, then surface due material as a short review session and save outcomes.

**Acceptance criteria:**
- [ ] Correct and incorrect responses update a concept's next review time according to documented scheduler rules.
- [ ] Due concepts are retrievable in a stable order and can be practiced in a review session.
- [ ] Review attempts persist and are isolated to the learner.
- [ ] Scheduler logic is pure and can be verified without browser or database dependencies.

**Verification:**
- [ ] Unit checks cover interval boundaries, repeated correct answers, mistakes, and timezone/day boundaries.
- [ ] Agent-browser completes a due-review flow and confirms progress survives reload.

**Dependencies:** Task 8.

**Files likely touched:** `src/features/review/`, `src/shared/calc/`, repository/service files, migrations.

**Estimated scope:** Medium.

## Checkpoint: Learning loop

- [ ] A learner can onboard, complete a lesson, return, and complete a due review with progress preserved.
- [ ] Auth boundaries and database policies are exercised with multiple learner accounts.
- [ ] Lightpanda and Chrome verification paths are both exercised; unsupported engine behavior is recorded.

## Phase 3: Retention and Release Readiness

### Task 10: Add progress summary, daily goal/streak, and product events

**Description:** Add a compact progress view, daily goal completion and streak calculation, plus a small privacy-conscious analytics event set to assess the core learning loop.

**Acceptance criteria:**
- [ ] Progress view reflects completed lessons, reviewed concepts, and daily goal status from persisted records.
- [ ] Streak calculation handles day boundaries and missing days deterministically.
- [ ] Events capture onboarding, lesson start/completion, review completion, and return without sending exercise answers or sensitive content.
- [ ] Motion and rewards remain optional/nonessential and honor reduced-motion preferences.

**Verification:**
- [ ] Unit checks cover streak/day-boundary behavior and event payload shape.
- [ ] Agent-browser verifies the progress view before and after a completed session.
- [ ] Inspect emitted analytics payloads for data minimization.

**Dependencies:** Tasks 6–9.

**Files likely touched:** `src/features/progress/`, `src/shared/telemetry/`, event configuration, route files.

**Estimated scope:** Medium.

### Task 11: Finish responsive/accessibility/error states and deployment readiness

**Description:** Close visual and behavioral gaps in key flows, check reduced motion, keyboard/touch interaction, empty/loading/error states, and prepare production configuration with secrets and migrations documented.

**Acceptance criteria:**
- [ ] Key onboarding, path, lesson, review, and progress screens work at phone and desktop sizes.
- [ ] Interactive controls have visible focus, semantic labels, and sufficient contrast; reduced-motion mode suppresses nonessential movement.
- [ ] Errors, loading, empty content, missing audio, and offline/network failure have understandable recovery states.
- [ ] Deployment setup documents environment variables, database migrations, and the production runtime choice.

**Verification:**
- [ ] Run agent-browser Lightpanda smoke path and Chrome visual/browser-error review.
- [ ] Run all unit checks, both typecheck lanes, Biome, and production build.
- [ ] Review the full diff and verify a clean checkout can reproduce the documented workflow.

**Dependencies:** Task 10.

**Files likely touched:** feature UI files, `docs/`, deployment config, CI workflow, `AGENTS.md`.

**Estimated scope:** Medium.

## Checkpoint: MVP complete

- [ ] All acceptance criteria are met and each verification result is recorded honestly.
- [ ] Core learner loop succeeds from onboarding through review and return.
- [ ] No test command reports zero collected tests; browser commands execute against the built app.
- [ ] No unresolved high-impact auth, content, or deployment blocker remains.

# Architecture & Engineering Standards

Mingo is a responsive web application for structured, bite-sized language learning with gold-standard retention.

## Project Structure & Boundaries

```
mingo/
├── app/ -> src/app/          # Next.js App Router: transport & page composition only
├── src/
│   ├── app/                  # Route layouts, pages, API handlers
│   ├── features/             # Feature domains (UI, services, repositories)
│   │   ├── auth/             # Sign-up, sign-in, session state
│   │   ├── onboarding/       # Course selection, daily goal setting
│   │   ├── course/           # Guided learning path, unit/lesson index
│   │   ├── lesson/           # Interactive exercise session & feedback
│   │   ├── review/           # Spaced repetition scheduling & review session
│   │   └── progress/         # Daily goals, streaks, learner profile
│   ├── server/
│   │   └── db/               # Server-only database client & RLS policies
│   └── shared/
│       ├── calc/             # Pure calculations (scoring, intervals, streaks)
│       ├── tokens/           # Design tokens, color system, spacing
│       └── telemetry/        # Privacy-conscious client/server product events
├── docs/                     # Architectural documentation
└── tasks/                    # Implementation plan and task tracking
```

## Dependency Direction Rules

Dependencies flow strictly in one direction:
1. `src/app/` (routes) may import from `src/features/` and `src/shared/`.
2. `src/features/<domain>/` contains:
   - UI components (`components/`)
   - Domain operations (`services/`)
   - Data access (`repositories/`)
3. Domain services may import pure calculations from `src/shared/calc/`.
4. Domain repositories may import server DB access from `src/server/db/`.
5. `src/server/db/` is server-only; client components must never import from `src/server/db/`.
6. Cross-feature circular imports and generic dumping folders (`utils/`, `common/`, barrel `index.ts` files) are forbidden.

## Product Vocabulary

- **Course:** A language learning curriculum targeting a specific pair (e.g., Spanish for English speakers).
- **Unit:** A themed group of lessons (e.g., Greetings & Essentials).
- **Lesson:** A short, sequenced session of interactive exercises.
- **Exercise:** A single challenge (multiple choice, typed recall, listening).
- **Concept:** A discrete vocabulary item or grammar rule with review history.
- **Review Session:** A targeted practice session exercising due or missed concepts.
- **Learner:** An authenticated user with progress, goal, and review history.
- **Streak:** Consecutive active days meeting the daily goal.

## Design & Color Tokens

- **Palette:** Cream surface backgrounds (`#FAF6EE`), deep ink text (`#1C1917`), and warm gold/amber accents (`#D97706`).
- **Contrast:** Small body text never uses low-contrast bright yellow.
- **Motion:** Micro-interactions respect `prefers-reduced-motion`.
- **Identity:** Original visual identity and character marks; no Duolingo marks or copy.

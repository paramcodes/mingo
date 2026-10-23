# Production Deployment Guide

This document covers running Mingo in production, configuring secrets, and applying database migrations.

## Production Runtime Choice

Per architecture decision, production builds use standard **Node.js runtime** (`node:22-alpine` or `node:20-alpine`) or containerized hosting platforms (Docker, Vercel, Railway, Render).
- Build command: `bun run build` or `npm run build`
- Start command: `node .next/standalone/server.js` or `bun run start` / `next start`

## Environment Variables

| Variable                        | Description                                         | Required | Default                  |
| ------------------------------- | --------------------------------------------------- | -------- | ------------------------ |
| `NODE_ENV`                      | Runtime environment (`production` or `development`) | Yes      | `development`            |
| `PORT`                          | HTTP port to listen on                              | No       | `3000`                   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project API URL                            | Optional | Fallback to local SQLite |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key                            | Optional | Fallback to local SQLite |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase server-only admin key                      | Optional | Fallback to local SQLite |
| `SESSION_SECRET`                | Secret token for cookie integrity                   | Optional | Generated per instance   |

## Database Schema & Migrations

For cloud production environments with Supabase:
1. Open the Supabase SQL editor or run via Supabase CLI.
2. Execute the migration file: [`src/server/db/schema.sql`](../src/server/db/schema.sql).
3. The script creates `learners`, `progress`, and `concept_reviews` tables with Row Level Security (RLS) policies isolating learner data.

For self-hosted or zero-credential deployments:
- Mingo automatically initializes local SQLite (`.data/mingo.db`) using native `node:sqlite` / `bun:sqlite` with identical relational cascade rules and index constraints.

## Health Check Endpoint

Monitoring systems and load balancers can query:
- `GET /api/health`
- Response: `{"status": "healthy", "service": "mingo", "timestamp": "..."}` with HTTP 200.

## Clean Checkout Reproduction Sequence

```bash
# 1. Install dependencies with exact lockfile
bun install --frozen-lockfile

# 2. Run all lint, typecheck, and logic tests
bun run lint
bun run typecheck
bun run typecheck:fast
bun test

# 3. Create production build
bun run build

# 4. Start production server
bun run start -- -p 3000
```

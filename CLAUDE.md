# Summit Sports Index

## Project Overview
College athletics ranking and intelligence dashboard tracking 5 seed schools across rankings, Title IX/EADA compliance, donor intelligence, reputation signals, and alerts.

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Supabase (Postgres + Realtime)
- **UI:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **AI:** Claude API (claude-sonnet-4-20250514) for narrative generation
- **Email:** Resend (stubbed)
- **Scraping:** Playwright (stubbed as API routes)

## Getting Started
```bash
npm install
cp .env.example .env.local  # Fill in Supabase + API keys
npx supabase start           # Start local Supabase
npx supabase db push          # Run migrations
npm run dev                   # Start dev server at localhost:3000
```

## Architecture

### App Router Pages
- `src/app/overview/` — Dashboard overview with school cards and metrics
- `src/app/rankings/` — Sortable, filterable ranking table
- `src/app/title-ix/` — Title IX compliance + EADA financial charts
- `src/app/donors/` — Donor tracker with role-based anonymization
- `src/app/reputation/` — Sentiment timeline + AI narratives + event feed
- `src/app/alerts/` — Alert feed with configurable thresholds

### API Routes
- `src/app/api/ai/narrative/` — Claude narrative generation
- `src/app/api/seed/` — Demo mode event generator
- `src/app/api/scrapers/*` — 4 scraper stubs (rankings, eada, chronicle, donors)
- `src/app/api/alerts/send/` — Resend email stub

### Key Directories
- `src/components/layout/` — Sidebar, header, role toggle, demo mode toggle
- `src/components/{feature}/` — Feature-specific components
- `src/components/shared/` — Reusable components (DataTable, RoleGuard, ChartContainer)
- `src/lib/providers/` — React context providers (Role, DemoMode, SchoolFilter)
- `src/lib/constants/` — Schools, roles, tabs definitions
- `src/lib/utils/` — Formatters, permission helpers
- `src/lib/hooks/` — Realtime subscriptions, demo simulator
- `supabase/migrations/` — DDL and seed SQL

## Role System
Single demo login. Role toggle in header: **Admin**, **Donor**, **Researcher**.
- **Admin:** Full access
- **Donor:** Financial data visible, Chronicle complaints hidden
- **Researcher:** All data visible, donor names shown as "Anonymous Donor"
Permissions enforced at component level via `RoleGuard` and `useRole()`.

## Demo Mode
Toggle in header. When active:
- Reads only `is_demo = true` data
- Simulates real-time events every 15 seconds via `/api/seed`
- Default: ON (set via `NEXT_PUBLIC_DEMO_MODE_DEFAULT`)

## Seed Schools
1. Michigan (Big Ten) — slug: `michigan`
2. Alabama (SEC) — slug: `alabama`
3. Oregon (Big Ten) — slug: `oregon`
4. Duke (ACC) — slug: `duke`
5. Kansas (Big 12) — slug: `kansas`

## Database
10 tables in Supabase. See `supabase/migrations/001_create_tables.sql`. All monetary values stored in **cents** (BIGINT), formatted on display.

## Conventions
- Server Components for data fetching, Client Components for interactivity
- All charts wrapped in `ChartContainer` (responsive Recharts wrapper)
- shadcn/ui for all UI primitives
- `'use client'` directive on all interactive components
- School slugs are lowercase, hyphen-free identifiers

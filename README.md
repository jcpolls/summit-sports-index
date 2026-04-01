# Summit Sports Index

College athletics ranking and intelligence dashboard. Tracks 5 seed schools across composite rankings, Title IX/EADA compliance, donor intelligence, reputation signals, coach movement alerts, and campus press coverage.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in Supabase credentials and API keys (see Required Env Vars below)

# 3. Start local Supabase emulator
npx supabase start

# 4. Run database migrations
npx supabase db push

# 5. Seed the database
npx ts-node --project scripts/tsconfig.json scripts/seed.ts

# 6. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Required Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Local or hosted Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server routes) |
| `TWITTER_BEARER_TOKEN` | Optional | Twitter API v2 Bearer Token for Social Media Surveillance |
| `RESEND_API_KEY` | Optional | Resend key for coach alert email notifications |
| `ANTHROPIC_API_KEY` | Optional | Claude API key for AI narratives, sentiment scoring, reputation analysis |
| `SCRAPER_SECRET` | Optional | Shared secret authenticating scraper POST endpoints |
| `WEBHOOK_SECRET` | Optional | Secret for Supabase DB webhook to `/api/alerts/notify` |
| `NEXT_PUBLIC_SITE_URL` | Optional | Base URL for email CTA links (default: http://localhost:3000) |

Without optional keys the app runs entirely in demo mode with hardcoded seed data.

---

## Seed Data

The seed script populates all 5 schools with realistic data:

```bash
npx ts-node --project scripts/tsconfig.json scripts/seed.ts
```

Inserts:
- 5 institutions (Michigan, Alabama, Oregon, Duke, Kansas)
- 10 programs per institution
- 15 EADA filings (3 years × 5 schools)
- 6 Title IX complaints
- 125 donor events (25 per school, spanning 2023–2025)
- 100 social signals with sentiment scores
- 75 campus news items
- 3 coach events
- 180 survey results (6 dimensions × 3 respondent types × 2 waves × 5 schools)

---

## Running Scrapers

Each scraper is a POST endpoint requiring `x-scraper-secret` header:

```bash
# Donor scraper (athletics foundation honor rolls)
curl -X POST http://localhost:3000/api/scraper/donor \
  -H "x-scraper-secret: $SCRAPER_SECRET" \
  -d '{"institutionSlug": "michigan"}'

# Coach monitor (ESPN, 247Sports, press releases, Google News RSS)
curl -X POST http://localhost:3000/api/scraper/coaches \
  -H "x-scraper-secret: $SCRAPER_SECRET" \
  -d '{"institutionSlug": "michigan"}'

# Social media (Twitter v2 + Claude Haiku sentiment)
GET /api/social/twitter?institutionSlug=michigan

# Campus news (RSS + Claude Haiku batch sentiment)
GET /api/reputation/news?slug=michigan
```

Recommended cron schedule: Social (15min), Coaches (1hr), News (2hr), Donors (6hr).

---

## EADA / Financial Integration

EADA filings are seeded from `scripts/seed.ts`. The Title IX / EADA tab renders compliance scores across 11 EADA areas, year-over-year financial charts, and proportionality gap tracking.

To pull live EADA data, implement a scraper targeting EADA's IPEDS data portal at `https://ope.ed.gov/athletics/` using the OPE ID stored per institution.

---

## TrueDot API Hook

Survey results on the Rankings and Overview tabs use mock data from `src/lib/seed-data/scoring-seed.ts`.

To connect live TrueDot wave data:
1. Add your API key in **Settings → TrueDot Integration**
2. The key is stored in Supabase Vault
3. Survey results will be fetched from TrueDot's `/v1/waves/{school_id}/results` endpoint
4. Historical waves are preserved for trend comparisons

---

## Demo Mode

Demo mode is the default. When enabled:
- All data comes from hardcoded seed files in `src/lib/seed-data/`
- No Supabase queries are made
- LiveTicker and SocialPanel simulate real-time events every 8 seconds
- API routes return mock data without requiring external credentials
- Header shows amber "Demo ON" badge
- Data Freshness Bar shows fake timestamps (12–45 minutes ago)

Toggle via the badge in the top navigation bar.

---

## Role Permissions

Three roles are available via the role toggle in the header:

| Feature | Admin | Donor | Researcher |
|---|---|---|---|
| All tabs visible | ✅ | ✅ | ✅ |
| Title IX / EADA tile | ✅ | ❌ (hidden) | ✅ |
| Donor full names | ✅ | ✅ | ❌ ("Donor #01") |
| Chronicle complaints | ✅ | ❌ | ✅ |
| Confirm coach events | ✅ | ❌ | ❌ |
| Alert subscriptions | ✅ | ✅ | ✅ |

Role-gating is enforced via `<RoleGate allowedRoles={[...]}>` and `withRoleGate()` HOC in `src/lib/withRoleGate.tsx`.

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages + API routes
    overview/             # Command Center dashboard
    rankings/             # Composite scoring + weight sliders
    title-ix/             # EADA compliance + financial charts
    donor-tracker/        # Donation feed + live ticker
    reputation/           # Social + AI analysis + campus press
    alerts/               # Coach movement alerts + subscriptions
    settings/             # API keys, schedules, school management
    api/                  # All API routes
  components/
    layout/               # AppNav, DataFreshnessBar
    alerts/               # AlertFeed, AlertSetup
    donor/                # LiveTicker, charts
    rankings/             # WeightSliders, RankingsTable, PeerComparison
    reputation/           # SocialPanel, AIPanel, NewsPanel
    shared/               # ChartContainer, RoleGuard, DataTable
  lib/
    contexts/             # app-contexts.tsx (Role, School, DemoMode)
    seed-data/            # Hardcoded demo data
    scoring.ts            # 6-dimension composite scoring engine
    withRoleGate.tsx      # Role-gating HOC + RoleGate component
  scrapers/               # Playwright stubs (donor, coach, newspaper)
  config/
    newspapers.json       # RSS feed config per school
  types/
    database.ts           # TypeScript types for all DB tables
supabase/
  migrations/             # Schema DDL + seed SQL
scripts/
  seed.ts                 # TypeScript seeder (ts-node)
```

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (Postgres + Realtime)
- **UI**: Tailwind CSS v3 + shadcn/ui v2
- **Charts**: Recharts
- **AI**: Claude API (`claude-sonnet-4-20250514`, `claude-haiku-4-5-20251001`)
- **Email**: Resend
- **Scraping**: Playwright (stubs — activate by uncommenting selector patterns)
- **RSS Parsing**: fast-xml-parser

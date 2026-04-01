// Hardcoded scoring data matching the seed script (scripts/seed.ts)
// Used as fallback when Supabase is not connected.
// Institution slugs are used as IDs since we don't have UUIDs at build time.

import type { ScoringData } from '@/lib/scoring'

export const INSTITUTION_IDS = ['michigan', 'alabama', 'oregon', 'duke', 'kansas']

export const INSTITUTION_META: Record<string, { name: string; shortName: string; conference: string; primaryColor: string }> = {
  michigan: { name: 'University of Michigan', shortName: 'Michigan', conference: 'Big Ten', primaryColor: '#00274C' },
  alabama: { name: 'University of Alabama', shortName: 'Alabama', conference: 'SEC', primaryColor: '#9E1B32' },
  oregon:  { name: 'University of Oregon',  shortName: 'Oregon',  conference: 'Big Ten', primaryColor: '#154733' },
  duke:    { name: 'Duke University',        shortName: 'Duke',    conference: 'ACC',     primaryColor: '#003087' },
  kansas:  { name: 'University of Kansas',   shortName: 'Kansas',  conference: 'Big 12',  primaryColor: '#0051A5' },
}

// Trailing-12mo donor totals derived from seed data (in USD)
const DONOR_TOTALS: Record<string, number> = {
  michigan: 12_000_000,
  alabama:  18_000_000,
  oregon:   22_000_000,
  duke:     14_000_000,
  kansas:    8_000_000,
}

// Represent each school's trailing-12mo as a single synthetic donor event
// dated within the window so the scoring engine picks it up
const TODAY = new Date()
const TRAILING_DATE = new Date(TODAY)
TRAILING_DATE.setMonth(TRAILING_DATE.getMonth() - 6) // within 12mo window
const TRAILING_ISO = TRAILING_DATE.toISOString().split('T')[0]

// EADA 2024 overall scores from seed.ts
const EADA_2024: Record<string, number> = {
  michigan: 83,
  alabama:  85,
  oregon:   78,
  duke:     73,
  kansas:   66,
}

// Football program data from seed.ts
const FOOTBALL_PROGRAMS: Record<string, { ncaa_apr_score: number; win_pct_current: number; conference_championships: number; ncaa_appearances_5yr: number }> = {
  michigan: { ncaa_apr_score: 984, win_pct_current: 0.692, conference_championships: 3, ncaa_appearances_5yr: 0 },
  alabama:  { ncaa_apr_score: 980, win_pct_current: 0.778, conference_championships: 5, ncaa_appearances_5yr: 0 },
  oregon:   { ncaa_apr_score: 975, win_pct_current: 0.731, conference_championships: 1, ncaa_appearances_5yr: 0 },
  duke:     { ncaa_apr_score: 992, win_pct_current: 0.538, conference_championships: 0, ncaa_appearances_5yr: 0 },
  kansas:   { ncaa_apr_score: 978, win_pct_current: 0.462, conference_championships: 0, ncaa_appearances_5yr: 0 },
}

// Avg sentiment scores derived from social + news seed data (scale -100 to +100)
const AVG_SENTIMENTS: Record<string, number> = {
  michigan: 46,
  alabama:  51,
  oregon:   42,
  duke:     28,
  kansas:   18,
}

// Survey wave 2 (2025-02-01) averages across all dimensions and respondent types
const SURVEY_AVG_WAVE2: Record<string, number> = {
  michigan: 79.0,
  alabama:  81.0,
  oregon:   76.0,
  duke:     80.0,
  kansas:   64.0,
}

// ─── Assemble ScoringData ─────────────────────────────────────────────────────

export const SEED_SCORING_DATA: ScoringData = {
  donorEvents: INSTITUTION_IDS.map((id) => ({
    institution_id: id,
    amount_usd: DONOR_TOTALS[id],
    gift_date: TRAILING_ISO,
  })),

  eadaFilings: INSTITUTION_IDS.map((id) => ({
    institution_id: id,
    year: 2024,
    overall_compliance_score: EADA_2024[id],
  })),

  programs: INSTITUTION_IDS.map((id) => ({
    institution_id: id,
    sport: 'Football',
    ...FOOTBALL_PROGRAMS[id],
  })),

  socialSignals: INSTITUTION_IDS.map((id) => ({
    institution_id: id,
    sentiment_score: AVG_SENTIMENTS[id],
  })),

  newsItems: INSTITUTION_IDS.map((id) => ({
    institution_id: id,
    sentiment_score: AVG_SENTIMENTS[id],
  })),

  surveyResults: INSTITUTION_IDS.map((id) => ({
    institution_id: id,
    wave_date: '2025-02-01',
    score: SURVEY_AVG_WAVE2[id],
  })),
}

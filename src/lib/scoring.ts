// Summit Sports Index — Composite Scoring Engine

export interface Weights {
  financial: number
  equity: number
  academic: number
  competitive: number
  reputation: number
  survey: number
}

export const DEFAULT_WEIGHTS: Weights = {
  financial: 0.25,
  equity: 0.20,
  academic: 0.15,
  competitive: 0.20,
  reputation: 0.10,
  survey: 0.10,
}

export interface DimensionScores {
  financial: number
  equity: number
  academic: number
  competitive: number
  reputation: number
  survey: number
  composite: number
}

// ─── Raw data shapes (matches DB schema) ─────────────────────────────────────

export interface DonorEventRow {
  institution_id: string
  amount_usd: number
  gift_date: string // ISO date
}

export interface EadaFilingRow {
  institution_id: string
  year: number
  overall_compliance_score: number
}

export interface ProgramRow {
  institution_id: string
  sport: string
  ncaa_apr_score: number
  win_pct_current: number
  conference_championships: number
  ncaa_appearances_5yr: number
}

export interface SentimentRow {
  institution_id: string
  sentiment_score: number // -100 to 100
}

export interface SurveyRow {
  institution_id: string
  wave_date: string
  score: number
}

export interface ScoringData {
  donorEvents: DonorEventRow[]
  eadaFilings: EadaFilingRow[]
  programs: ProgramRow[]
  socialSignals: SentimentRow[]
  newsItems: SentimentRow[]
  surveyResults: SurveyRow[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50
  return clamp(((value - min) / (max - min)) * 100)
}

// ─── Per-institution raw score calculators ───────────────────────────────────

function financialRaw(id: string, events: DonorEventRow[]): number {
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - 1)
  return events
    .filter((e) => e.institution_id === id && new Date(e.gift_date) >= cutoff)
    .reduce((sum, e) => sum + e.amount_usd, 0)
}

function equityRaw(id: string, filings: EadaFilingRow[]): number {
  const rows = filings.filter((f) => f.institution_id === id)
  if (!rows.length) return 0
  const latest = rows.reduce((best, f) => (f.year > best.year ? f : best))
  return latest.overall_compliance_score
}

function academicRaw(id: string, programs: ProgramRow[]): number {
  const fb = programs.find((p) => p.institution_id === id && p.sport === 'Football')
  if (!fb) return 0
  return clamp(((fb.ncaa_apr_score - 900) / 100) * 100)
}

function competitiveRaw(id: string, programs: ProgramRow[]): number {
  const fb = programs.find((p) => p.institution_id === id && p.sport === 'Football')
  if (!fb) return 0
  return clamp(
    fb.win_pct_current * 40 +
    (fb.conference_championships / 5) * 30 +
    (fb.ncaa_appearances_5yr / 5) * 30
  )
}

function reputationRaw(id: string, social: SentimentRow[], news: SentimentRow[]): number {
  const rows = [
    ...social.filter((s) => s.institution_id === id),
    ...news.filter((n) => n.institution_id === id),
  ]
  if (!rows.length) return 50
  const avg = rows.reduce((sum, r) => sum + r.sentiment_score, 0) / rows.length
  // Map [-100, 100] → [0, 100]
  return clamp(((avg + 100) / 200) * 100)
}

function surveyRaw(id: string, surveys: SurveyRow[]): number {
  const rows = surveys.filter((s) => s.institution_id === id)
  if (!rows.length) return 0
  // Most recent wave
  const latestWave = rows.reduce((best, s) => (s.wave_date > best ? s.wave_date : best), '')
  const waveRows = rows.filter((s) => s.wave_date === latestWave)
  return waveRows.reduce((sum, s) => sum + s.score, 0) / waveRows.length
}

// ─── Main exports ─────────────────────────────────────────────────────────────

/**
 * Calculate dimension scores for all institutions simultaneously.
 * Financial score requires cross-school normalization, so all institutions
 * must be computed together.
 */
export function calculateAllScores(
  institutionIds: string[],
  data: ScoringData,
  weights: Weights = DEFAULT_WEIGHTS
): Record<string, DimensionScores> {
  // Compute raw per-institution values
  const raws = institutionIds.map((id) => ({
    id,
    financialRaw: financialRaw(id, data.donorEvents),
    equity: equityRaw(id, data.eadaFilings),
    academic: academicRaw(id, data.programs),
    competitive: competitiveRaw(id, data.programs),
    reputation: reputationRaw(id, data.socialSignals, data.newsItems),
    survey: surveyRaw(id, data.surveyResults),
  }))

  // Normalize financial across institutions
  const finValues = raws.map((r) => r.financialRaw)
  const finMin = Math.min(...finValues)
  const finMax = Math.max(...finValues)

  const result: Record<string, DimensionScores> = {}
  for (const r of raws) {
    const financial = normalize(r.financialRaw, finMin, finMax)
    const composite = Math.round(
      (weights.financial * financial +
        weights.equity * r.equity +
        weights.academic * r.academic +
        weights.competitive * r.competitive +
        weights.reputation * r.reputation +
        weights.survey * r.survey) * 10
    ) / 10

    result[r.id] = {
      financial: Math.round(financial * 10) / 10,
      equity: Math.round(r.equity * 10) / 10,
      academic: Math.round(r.academic * 10) / 10,
      competitive: Math.round(r.competitive * 10) / 10,
      reputation: Math.round(r.reputation * 10) / 10,
      survey: Math.round(r.survey * 10) / 10,
      composite,
    }
  }
  return result
}

/**
 * Convenience wrapper for a single institution. Requires all other IDs
 * for proper financial normalization.
 */
export function calculateCompositeScore(
  institutionId: string,
  data: ScoringData,
  allIds: string[],
  weights: Weights = DEFAULT_WEIGHTS
): DimensionScores {
  const all = calculateAllScores(allIds, data, weights)
  return all[institutionId] ?? { financial: 0, equity: 0, academic: 0, competitive: 0, reputation: 0, survey: 0, composite: 0 }
}

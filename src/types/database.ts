// Summit Sports Index — Database Types (new schema)

export interface Institution {
  id: string
  name: string
  slug: string
  conference: string
  division: string
  logo_url: string | null
  primary_color: string
  espn_team_id: string | null
  athletics_url: string | null
  newspaper_rss: string | null
  created_at: string
}

export interface Program {
  id: string
  institution_id: string
  sport: string
  gender: 'M' | 'F' | 'Co-Ed'
  head_coach: string | null
  roster_size: number | null
  budget_usd: number | null
  ncaa_apr_score: number | null
  win_pct_current: number | null
  conference_championships: number
  ncaa_appearances_5yr: number
}

export type FilingStatus = 'submitted' | 'under_review' | 'compliant' | 'watch' | 'at_risk'

export interface EadaArea {
  score: number
  status: 'compliant' | 'watch' | 'at_risk'
  notes: string
  male_pct?: number
  female_pct?: number
  gap_pct?: number
}

export interface EadaFiling {
  id: string
  institution_id: string
  year: number
  filed_date: string | null
  status: FilingStatus
  overall_compliance_score: number | null
  participation: EadaArea | null
  scholarships: EadaArea | null
  equipment: EadaArea | null
  scheduling: EadaArea | null
  travel: EadaArea | null
  tutoring: EadaArea | null
  coaching: EadaArea | null
  facilities: EadaArea | null
  publicity: EadaArea | null
  recruiting: EadaArea | null
  support_services: EadaArea | null
}

export type ComplaintStatus = 'open' | 'under_investigation' | 'resolved' | 'dismissed'

export interface TitleIXComplaint {
  id: string
  institution_id: string
  complaint_date: string
  complaint_type: string
  involves_athletics: boolean
  status: ComplaintStatus
  resolution: string | null
  source_url: string | null
  scraped_at: string
}

export interface DonorEvent {
  id: string
  institution_id: string
  donor_name: string
  amount_usd: number
  gift_date: string
  designated_sport: string | null
  facility_name: string | null
  source_url: string | null
  scraped_at: string
}

export type Platform = 'twitter' | 'facebook' | 'instagram' | 'reddit' | 'bluesky'

export interface SocialSignal {
  id: string
  institution_id: string
  platform: Platform
  post_text: string
  post_url: string | null
  author: string | null
  sentiment_score: number | null
  keywords: string[] | null
  scraped_at: string
}

export interface NewsItem {
  id: string
  institution_id: string
  publication: string
  headline: string
  summary: string | null
  article_url: string | null
  sentiment_score: number | null
  keywords: string[] | null
  flags: string[] | null
  published_at: string | null
  scraped_at: string
}

export type CoachEventType = 'hire' | 'departure' | 'extension' | 'suspension' | 'investigation' | 'rumor'

export interface CoachEvent {
  id: string
  institution_id: string
  coach_name: string
  sport: string
  event_type: CoachEventType
  confidence_score: number
  source_urls: string[] | null
  confirmed: boolean
  detected_at: string
}

export interface Alert {
  id: string
  user_id: string
  institution_ids: string[] | null
  sports: string[] | null
  event_types: string[] | null
  email: string | null
  active: boolean
  created_at: string
}

export type RespondentType = 'administrator' | 'alumni' | 'student'
export type SurveyDimension =
  | 'facilities'
  | 'staff_culture'
  | 'athlete_experience'
  | 'donor_engagement'
  | 'academic_support'
  | 'competitive_support'

export interface SurveyResult {
  id: string
  institution_id: string
  wave_date: string
  respondent_type: RespondentType
  dimension: SurveyDimension
  score: number
  n_respondents: number
  margin_of_error: number
}

// Roles
export type Role = 'admin' | 'donor' | 'researcher'

// ─── Legacy types (kept for backward compat with existing UI components) ──────
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type ComplianceStatus = 'compliant' | 'under-review' | 'non-compliant'
export type DonorTier = 'platinum' | 'gold' | 'silver' | 'bronze'
export type ReputationEventType = 'chronicle-complaint' | 'media-mention' | 'social-sentiment' | 'ncaa-infraction' | 'coaching-change'
export type RankingTrend = 'up' | 'down' | 'steady'

export interface School {
  id: string
  slug: string
  name: string
  short_name: string
  conference: string
  mascot: string
  primary_color: string
  secondary_color: string
  logo_url: string
  state: string
  enrollment: number
  is_demo: boolean
  created_at: string
  updated_at: string
}

export interface Ranking {
  id: string
  school_id: string
  season: string
  sport: string
  source: string
  rank: number | null
  score: number | null
  wins: number | null
  losses: number | null
  conference_rank: number | null
  conference: string
  trend: RankingTrend
  trend_delta: number
  as_of_date: string
  is_demo: boolean
  created_at: string
  school?: School
}

export interface TitleIXData {
  id: string
  school_id: string
  reporting_year: number
  male_athletes: number
  female_athletes: number
  male_participation_pct: number
  female_participation_pct: number
  male_undergrad_pct: number
  female_undergrad_pct: number
  compliance_status: ComplianceStatus
  proportionality_gap: number
  sports_added: string[]
  sports_cut: string[]
  notes: string | null
  is_demo: boolean
  created_at: string
  school?: School
}

export interface EadaFinancial {
  id: string
  school_id: string
  reporting_year: number
  sport: string
  total_revenue: number
  total_expenses: number
  coaching_salaries_m: number
  coaching_salaries_f: number
  recruiting_expenses: number
  scholarships_m: number
  scholarships_f: number
  operating_expenses: number
  profit_loss: number
  is_demo: boolean
  created_at: string
  school?: School
}

export interface Donor {
  id: string
  school_id: string
  first_name: string
  last_name: string
  email: string | null
  donor_tier: DonorTier
  lifetime_total: number
  first_gift_date: string | null
  last_gift_date: string | null
  is_board_member: boolean
  affiliation: string
  notes: string | null
  is_demo: boolean
  created_at: string
  school?: School
}

export interface Donation {
  id: string
  donor_id: string
  school_id: string
  amount: number
  designation: string
  gift_date: string
  fiscal_year: number
  payment_type: string
  is_anonymous: boolean
  is_demo: boolean
  created_at: string
  donor?: Donor
  school?: School
}

export interface ReputationEvent {
  id: string
  school_id: string
  event_type: ReputationEventType
  headline: string
  source: string | null
  source_url: string | null
  sentiment_score: number
  severity: string
  event_date: string
  details: Record<string, unknown> | null
  ai_narrative: string | null
  is_demo: boolean
  created_at: string
  school?: School
}

export interface LegacyAlert {
  id: string
  school_id: string
  alert_type: string
  severity: AlertSeverity
  title: string
  message: string
  related_entity_type: string | null
  related_entity_id: string | null
  is_read: boolean
  is_emailed: boolean
  created_at: string
  school?: School
}

export interface LegacySurveyResult {
  id: string
  school_id: string
  survey_name: string
  survey_period: string
  category: string
  score: number
  response_count: number | null
  benchmark_avg: number | null
  trend_vs_prior: number | null
  is_demo: boolean
  created_at: string
  school?: School
}

export interface AlertThreshold {
  id: string
  metric: string
  threshold_value: number
  operator: string
  is_active: boolean
  notify_email: boolean
  created_at: string
  updated_at: string
}

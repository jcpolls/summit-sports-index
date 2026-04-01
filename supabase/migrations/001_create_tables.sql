-- ============================================================
-- Summit Sports — Supabase Migration: 001_create_tables.sql
-- Creates all core tables, indexes, and realtime support.
-- ============================================================

-- 1. schools
CREATE TABLE schools (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        UNIQUE NOT NULL,
  name            TEXT        NOT NULL,
  short_name      TEXT,
  conference      TEXT,
  mascot          TEXT,
  primary_color   TEXT,
  secondary_color TEXT,
  logo_url        TEXT,
  state           TEXT,
  enrollment      INTEGER,
  is_demo         BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. rankings
CREATE TABLE rankings (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  season          TEXT,
  sport           TEXT,
  source          TEXT,
  rank            INTEGER,
  score           DECIMAL(8,4),
  wins            INTEGER,
  losses          INTEGER,
  conference_rank INTEGER,
  trend           TEXT,
  trend_delta     INTEGER,
  as_of_date      DATE,
  is_demo         BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rankings_school_season_sport ON rankings (school_id, season, sport);

-- 3. title_ix_data
CREATE TABLE title_ix_data (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id                UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  reporting_year           INTEGER,
  male_athletes            INTEGER,
  female_athletes          INTEGER,
  male_participation_pct   DECIMAL(5,2),
  female_participation_pct DECIMAL(5,2),
  male_undergrad_pct       DECIMAL(5,2),
  female_undergrad_pct     DECIMAL(5,2),
  compliance_status        TEXT,
  proportionality_gap      DECIMAL(5,2),
  sports_added             TEXT[],
  sports_cut               TEXT[],
  notes                    TEXT,
  is_demo                  BOOLEAN     DEFAULT true,
  created_at               TIMESTAMPTZ DEFAULT now()
);

-- 4. eada_financials
CREATE TABLE eada_financials (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id           UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  reporting_year      INTEGER,
  sport               TEXT,
  total_revenue       BIGINT,
  total_expenses      BIGINT,
  coaching_salaries_m BIGINT,
  coaching_salaries_f BIGINT,
  recruiting_expenses BIGINT,
  scholarships_m      BIGINT,
  scholarships_f      BIGINT,
  operating_expenses  BIGINT,
  profit_loss         BIGINT,
  is_demo             BOOLEAN     DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eada_financials_school_year ON eada_financials (school_id, reporting_year);

-- 5. donors
CREATE TABLE donors (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  first_name      TEXT,
  last_name       TEXT,
  email           TEXT,
  donor_tier      TEXT,
  lifetime_total  BIGINT      DEFAULT 0,
  first_gift_date DATE,
  last_gift_date  DATE,
  is_board_member BOOLEAN     DEFAULT false,
  affiliation     TEXT,
  notes           TEXT,
  is_demo         BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 6. donations
CREATE TABLE donations (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id     UUID        NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  school_id    UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  amount       BIGINT,
  designation  TEXT,
  gift_date    DATE,
  fiscal_year  INTEGER,
  payment_type TEXT,
  is_anonymous BOOLEAN     DEFAULT false,
  is_demo      BOOLEAN     DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_donations_school_fy ON donations (school_id, fiscal_year);
CREATE INDEX idx_donations_donor     ON donations (donor_id);

-- 7. reputation_events
CREATE TABLE reputation_events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  event_type      TEXT,
  headline        TEXT,
  source          TEXT,
  source_url      TEXT,
  sentiment_score DECIMAL(4,2),
  severity        TEXT,
  event_date      DATE,
  details         JSONB,
  ai_narrative    TEXT,
  is_demo         BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reputation_events_school_date ON reputation_events (school_id, event_date DESC);

-- 8. alerts
CREATE TABLE alerts (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id           UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  alert_type          TEXT,
  severity            TEXT,
  title               TEXT,
  message             TEXT,
  related_entity_type TEXT,
  related_entity_id   UUID,
  is_read             BOOLEAN     DEFAULT false,
  is_emailed          BOOLEAN     DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_alerts_school_created ON alerts (school_id, created_at DESC);

-- 9. survey_results
CREATE TABLE survey_results (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  survey_name     TEXT,
  survey_period   TEXT,
  category        TEXT,
  score           DECIMAL(5,2),
  response_count  INTEGER,
  benchmark_avg   DECIMAL(5,2),
  trend_vs_prior  DECIMAL(5,2),
  is_demo         BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 10. alert_thresholds
CREATE TABLE alert_thresholds (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  metric          TEXT        UNIQUE NOT NULL,
  threshold_value DECIMAL(10,2),
  operator        TEXT,
  is_active       BOOLEAN     DEFAULT true,
  notify_email    BOOLEAN     DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Realtime support: REPLICA IDENTITY FULL
-- ============================================================
ALTER TABLE rankings         REPLICA IDENTITY FULL;
ALTER TABLE reputation_events REPLICA IDENTITY FULL;
ALTER TABLE alerts            REPLICA IDENTITY FULL;
ALTER TABLE donations         REPLICA IDENTITY FULL;

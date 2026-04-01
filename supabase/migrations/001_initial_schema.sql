-- Summit Sports Index — Initial Schema
-- Replaces legacy 001_create_tables.sql

-- ============================================================
-- INSTITUTIONS
-- ============================================================
create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  conference text not null,
  division text not null default 'FBS',
  logo_url text,
  primary_color text not null default '#000000',
  espn_team_id text,
  athletics_url text,
  newspaper_rss text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PROGRAMS
-- ============================================================
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  sport text not null,
  gender text not null check (gender in ('M','F','Co-Ed')),
  head_coach text,
  roster_size int,
  budget_usd bigint,
  ncaa_apr_score int,
  win_pct_current numeric(5,4),
  conference_championships int default 0,
  ncaa_appearances_5yr int default 0
);

create index if not exists programs_institution_id_idx on programs(institution_id);

-- ============================================================
-- EADA FILINGS
-- ============================================================
create table if not exists eada_filings (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  year int not null,
  filed_date date,
  status text not null default 'submitted' check (status in ('submitted','under_review','compliant','watch','at_risk')),
  overall_compliance_score numeric(5,2),
  participation jsonb,
  scholarships jsonb,
  equipment jsonb,
  scheduling jsonb,
  travel jsonb,
  tutoring jsonb,
  coaching jsonb,
  facilities jsonb,
  publicity jsonb,
  recruiting jsonb,
  support_services jsonb
);

create index if not exists eada_filings_institution_year_idx on eada_filings(institution_id, year);

-- ============================================================
-- TITLE IX COMPLAINTS
-- ============================================================
create table if not exists title_ix_complaints (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  complaint_date date not null,
  complaint_type text not null,
  involves_athletics boolean not null default false,
  status text not null default 'open' check (status in ('open','under_investigation','resolved','dismissed')),
  resolution text,
  source_url text,
  scraped_at timestamptz not null default now()
);

create index if not exists title_ix_complaints_institution_idx on title_ix_complaints(institution_id);

-- ============================================================
-- DONOR EVENTS
-- ============================================================
create table if not exists donor_events (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  donor_name text not null,
  amount_usd bigint not null,
  gift_date date not null,
  designated_sport text,
  facility_name text,
  source_url text,
  scraped_at timestamptz not null default now()
);

create index if not exists donor_events_institution_idx on donor_events(institution_id);
create index if not exists donor_events_gift_date_idx on donor_events(gift_date);

-- ============================================================
-- SOCIAL SIGNALS
-- ============================================================
create table if not exists social_signals (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  platform text not null check (platform in ('twitter','facebook','instagram','reddit','bluesky')),
  post_text text not null,
  post_url text,
  author text,
  sentiment_score numeric(5,2),
  keywords text[],
  scraped_at timestamptz not null default now()
);

create index if not exists social_signals_institution_idx on social_signals(institution_id);
create index if not exists social_signals_scraped_at_idx on social_signals(scraped_at);

-- ============================================================
-- NEWS ITEMS
-- ============================================================
create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  publication text not null,
  headline text not null,
  summary text,
  article_url text,
  sentiment_score numeric(5,2),
  keywords text[],
  flags text[],
  published_at timestamptz,
  scraped_at timestamptz not null default now()
);

create index if not exists news_items_institution_idx on news_items(institution_id);
create index if not exists news_items_published_at_idx on news_items(published_at);

-- ============================================================
-- COACH EVENTS
-- ============================================================
create table if not exists coach_events (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  coach_name text not null,
  sport text not null,
  event_type text not null check (event_type in ('hire','departure','extension','suspension','investigation','rumor')),
  confidence_score numeric(4,2) default 1.0,
  source_urls text[],
  confirmed boolean not null default false,
  detected_at timestamptz not null default now()
);

create index if not exists coach_events_institution_idx on coach_events(institution_id);

-- ============================================================
-- ALERTS
-- ============================================================
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'demo-user',
  institution_ids text[],
  sports text[],
  event_types text[],
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SURVEY RESULTS
-- ============================================================
create table if not exists survey_results (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  wave_date date not null,
  respondent_type text not null check (respondent_type in ('administrator','alumni','student')),
  dimension text not null check (dimension in ('facilities','staff_culture','athlete_experience','donor_engagement','academic_support','competitive_support')),
  score numeric(5,2) not null,
  n_respondents int not null,
  margin_of_error numeric(4,2) not null
);

create index if not exists survey_results_institution_idx on survey_results(institution_id);
create index if not exists survey_results_wave_idx on survey_results(wave_date);

-- ============================================================
-- REALTIME
-- ============================================================
alter table donor_events replica identity full;
alter table social_signals replica identity full;
alter table coach_events replica identity full;

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7kyDjrOVMdDeH6lmIXRkFpFUr7rSd-sntJk'
)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString().split('T')[0]
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ---------------------------------------------------------------------------
// Institutions
// ---------------------------------------------------------------------------

const INSTITUTIONS = [
  {
    name: 'University of Michigan',
    slug: 'michigan',
    conference: 'Big Ten',
    division: 'FBS',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Michigan_Wolverines_Logo.svg/200px-Michigan_Wolverines_Logo.svg.png',
    primary_color: '#00274C',
    espn_team_id: '130',
    athletics_url: 'https://mgoblue.com',
    newspaper_rss: 'https://michigandaily.com/feed',
  },
  {
    name: 'University of Alabama',
    slug: 'alabama',
    conference: 'SEC',
    division: 'FBS',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Alabama_Crimson_Tide_logo.svg/200px-Alabama_Crimson_Tide_logo.svg.png',
    primary_color: '#9E1B32',
    espn_team_id: '333',
    athletics_url: 'https://rolltide.com',
    newspaper_rss: 'https://cw.ua.edu/feed',
  },
  {
    name: 'University of Oregon',
    slug: 'oregon',
    conference: 'Big Ten',
    division: 'FBS',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Oregon_Ducks_logo.svg/200px-Oregon_Ducks_logo.svg.png',
    primary_color: '#154733',
    espn_team_id: '2483',
    athletics_url: 'https://goducks.com',
    newspaper_rss: 'https://dailyemerald.com/feed',
  },
  {
    name: 'Duke University',
    slug: 'duke',
    conference: 'ACC',
    division: 'FBS',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Duke_Athletics_logo.svg/200px-Duke_Athletics_logo.svg.png',
    primary_color: '#003087',
    espn_team_id: '150',
    athletics_url: 'https://goduke.com',
    newspaper_rss: 'https://dukechronicle.com/feed',
  },
  {
    name: 'University of Kansas',
    slug: 'kansas',
    conference: 'Big 12',
    division: 'FBS',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kansas_Jayhawks_logo.svg/200px-Kansas_Jayhawks_logo.svg.png',
    primary_color: '#0051A5',
    espn_team_id: '2305',
    athletics_url: 'https://kuathletics.com',
    newspaper_rss: 'https://kansan.com/feed',
  },
]

// ---------------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------------

function buildPrograms(instId: string, slug: string) {
  const map: Record<string, { sport: string; gender: string; head_coach: string; roster_size: number; budget_usd: bigint | number; ncaa_apr_score: number; win_pct_current: number; conference_championships: number; ncaa_appearances_5yr: number }[]> = {
    michigan: [
      { sport: 'Football', gender: 'M', head_coach: 'Sherrone Moore', roster_size: 115, budget_usd: 7000000000, ncaa_apr_score: 984, win_pct_current: 0.692, conference_championships: 3, ncaa_appearances_5yr: 0 },
      { sport: "Men's Basketball", gender: 'M', head_coach: 'Dusty May', roster_size: 15, budget_usd: 1800000000, ncaa_apr_score: 991, win_pct_current: 0.618, conference_championships: 1, ncaa_appearances_5yr: 4 },
    ],
    alabama: [
      { sport: 'Football', gender: 'M', head_coach: 'Kalen DeBoer', roster_size: 120, budget_usd: 9500000000, ncaa_apr_score: 980, win_pct_current: 0.778, conference_championships: 5, ncaa_appearances_5yr: 0 },
      { sport: "Men's Basketball", gender: 'M', head_coach: 'Nate Oats', roster_size: 15, budget_usd: 2200000000, ncaa_apr_score: 988, win_pct_current: 0.654, conference_championships: 0, ncaa_appearances_5yr: 3 },
    ],
    oregon: [
      { sport: 'Football', gender: 'M', head_coach: 'Dan Lanning', roster_size: 115, budget_usd: 6500000000, ncaa_apr_score: 975, win_pct_current: 0.731, conference_championships: 1, ncaa_appearances_5yr: 0 },
      { sport: "Men's Basketball", gender: 'M', head_coach: 'Dana Altman', roster_size: 15, budget_usd: 1500000000, ncaa_apr_score: 985, win_pct_current: 0.673, conference_championships: 2, ncaa_appearances_5yr: 5 },
    ],
    duke: [
      { sport: 'Football', gender: 'M', head_coach: 'Manny Diaz', roster_size: 100, budget_usd: 3200000000, ncaa_apr_score: 992, win_pct_current: 0.538, conference_championships: 0, ncaa_appearances_5yr: 0 },
      { sport: "Men's Basketball", gender: 'M', head_coach: 'Jon Scheyer', roster_size: 15, budget_usd: 2800000000, ncaa_apr_score: 995, win_pct_current: 0.769, conference_championships: 2, ncaa_appearances_5yr: 5 },
    ],
    kansas: [
      { sport: 'Football', gender: 'M', head_coach: 'Lance Leipold', roster_size: 105, budget_usd: 3800000000, ncaa_apr_score: 978, win_pct_current: 0.462, conference_championships: 0, ncaa_appearances_5yr: 0 },
      { sport: "Men's Basketball", gender: 'M', head_coach: 'Bill Self', roster_size: 15, budget_usd: 2500000000, ncaa_apr_score: 990, win_pct_current: 0.731, conference_championships: 8, ncaa_appearances_5yr: 5 },
    ],
  }
  return map[slug].map(p => ({ ...p, institution_id: instId }))
}

// ---------------------------------------------------------------------------
// EADA Filings
// ---------------------------------------------------------------------------

type AreaScore = {
  score: number
  status: 'compliant' | 'watch' | 'at_risk'
  notes: string
  male_pct?: number
  female_pct?: number
  gap_pct?: number
}

function statusFromScore(score: number): 'compliant' | 'watch' | 'at_risk' {
  if (score >= 80) return 'compliant'
  if (score >= 70) return 'watch'
  return 'at_risk'
}

function filingStatus(overall: number): string {
  if (overall >= 80) return 'compliant'
  if (overall >= 70) return 'watch'
  return 'at_risk'
}

function area(score: number, notes: string, male_pct?: number, female_pct?: number): AreaScore {
  const gap_pct = male_pct !== undefined && female_pct !== undefined ? female_pct - male_pct : undefined
  return { score, status: statusFromScore(score), notes, male_pct, female_pct, gap_pct }
}

function buildEadaFilings(instId: string, slug: string) {
  const filings = []

  const configs: Record<string, { years: { year: number; overall: number; areas: Record<string, AreaScore> }[] }> = {
    michigan: {
      years: [
        {
          year: 2022, overall: 76,
          areas: {
            participation: area(78, 'Participation ratio close to enrollment parity', 52, 48),
            scholarships: area(80, 'Scholarship distribution near proportional', 53, 47),
            equipment: area(74, 'Equipment quality gaps in minor sports', 55, 45, ),
            scheduling: area(77, 'Practice times favor football in fall', 54, 46),
            travel: area(75, 'Travel budgets adequate across programs', 53, 47),
            tutoring: area(82, 'Tutoring services equitably distributed', 51, 49),
            coaching: area(73, 'Coaching salary gap present in non-revenue sports', 58, 42),
            facilities: area(79, 'Facility upgrades underway for Olympic sports', 54, 46),
            publicity: area(72, 'Media coverage skewed toward football and basketball', 61, 39),
            recruiting: area(76, 'Recruiting budgets proportional to roster size', 53, 47),
            support_services: area(80, 'Athletic training and academic support equitable', 52, 48),
          },
        },
        {
          year: 2023, overall: 80,
          areas: {
            participation: area(82, 'Participation ratio improved with new womens programs', 51, 49),
            scholarships: area(83, 'Scholarship equity strong', 52, 48),
            equipment: area(79, 'New equipment procurement policy implemented', 53, 47),
            scheduling: area(81, 'Scheduling committee formed to address inequities', 52, 48),
            travel: area(80, 'Travel policies updated for equitable access', 52, 48),
            tutoring: area(85, 'Expanded tutoring hours for all athletes', 50, 50),
            coaching: area(77, 'Coaching salaries under ongoing review', 56, 44),
            facilities: area(82, 'Renovations to womens locker rooms completed', 52, 48),
            publicity: area(76, 'Added dedicated coverage for womens sports', 58, 42),
            recruiting: area(80, 'Recruiting spend proportional to roster', 52, 48),
            support_services: area(83, 'Expanded sports medicine for all teams', 51, 49),
          },
        },
        {
          year: 2024, overall: 83,
          areas: {
            participation: area(85, 'Enrollment parity achieved in participation', 50, 50),
            scholarships: area(86, 'Scholarship ratios match participation ratios', 51, 49),
            equipment: area(83, 'Equipment standards now uniform across programs', 52, 48),
            scheduling: area(84, 'Equitable practice time achieved', 51, 49),
            travel: area(83, 'Travel budgets fully equitable', 51, 49),
            tutoring: area(88, 'Best-in-class tutoring for all programs', 50, 50),
            coaching: area(80, 'Coaching pay gap narrowed to under 10%', 54, 46),
            facilities: area(85, 'All facilities upgraded to equivalent standard', 51, 49),
            publicity: area(79, 'Womens sports coverage at 45% of total', 56, 44),
            recruiting: area(83, 'Recruiting fully proportional', 51, 49),
            support_services: area(86, 'Mental health and academic support expanded', 51, 49),
          },
        },
      ],
    },
    alabama: {
      years: [
        {
          year: 2022, overall: 79,
          areas: {
            participation: area(80, 'Participation closely mirrors enrollment', 51, 49),
            scholarships: area(81, 'Scholarship distribution proportional', 52, 48),
            equipment: area(78, 'Minor gaps in non-revenue sports equipment', 53, 47),
            scheduling: area(77, 'Football scheduling dominates fall calendar', 55, 45),
            travel: area(79, 'Travel equitable for most sports', 52, 48),
            tutoring: area(82, 'Strong tutoring program for all athletes', 51, 49),
            coaching: area(75, 'Coaching salary gap in womens sports', 57, 43),
            facilities: area(90, 'World-class facilities across all programs', 50, 50),
            publicity: area(74, 'Media coverage weighted toward revenue sports', 60, 40),
            recruiting: area(80, 'Recruiting budgets reasonable', 52, 48),
            support_services: area(83, 'Strong support services', 51, 49),
          },
        },
        {
          year: 2023, overall: 82,
          areas: {
            participation: area(83, 'New womens swimming program added', 50, 50),
            scholarships: area(84, 'Scholarship equity maintained', 51, 49),
            equipment: area(82, 'Equipment upgrades completed', 52, 48),
            scheduling: area(80, 'Scheduling improvements noted', 53, 47),
            travel: area(81, 'Travel policy revised for equity', 52, 48),
            tutoring: area(85, 'Tutoring hours expanded', 50, 50),
            coaching: area(78, 'Coaching salary review underway', 55, 45),
            facilities: area(92, 'New womens athletic complex opened', 49, 51),
            publicity: area(77, 'Womens sports media coordinator hired', 58, 42),
            recruiting: area(82, 'Recruiting spend proportional', 52, 48),
            support_services: area(85, 'Excellent support services maintained', 50, 50),
          },
        },
        {
          year: 2024, overall: 85,
          areas: {
            participation: area(86, 'Participation ratio at parity', 50, 50),
            scholarships: area(87, 'Full scholarship equity achieved', 50, 50),
            equipment: area(85, 'All programs at equivalent equipment standard', 51, 49),
            scheduling: area(83, 'Practice schedules equitable', 52, 48),
            travel: area(84, 'Travel fully equitable', 51, 49),
            tutoring: area(88, 'Top-ranked academic support', 50, 50),
            coaching: area(81, 'Coaching salary gap under 8%', 54, 46),
            facilities: area(93, 'Facilities are best in SEC', 49, 51),
            publicity: area(80, 'Balanced media coverage achieved', 55, 45),
            recruiting: area(84, 'Recruiting proportional', 51, 49),
            support_services: area(87, 'Comprehensive support for all athletes', 50, 50),
          },
        },
      ],
    },
    oregon: {
      years: [
        {
          year: 2022, overall: 68,
          areas: {
            participation: area(70, 'Participation gap remains from historical imbalance', 55, 45),
            scholarships: area(69, 'Scholarship distribution improving but gap persists', 56, 44),
            equipment: area(67, 'Equipment quality inconsistent across sports', 57, 43),
            scheduling: area(65, 'Practice facility access inequitable', 58, 42),
            travel: area(70, 'Travel funding gaps for non-revenue womens sports', 55, 45),
            tutoring: area(72, 'Tutoring available but hours limited', 53, 47),
            coaching: area(64, 'Coaching salary disparity significant', 60, 40),
            facilities: area(71, 'Facilities adequate but not equitable', 54, 46),
            publicity: area(66, 'Womens sports coverage minimal', 62, 38),
            recruiting: area(68, 'Recruiting budget improvements planned', 56, 44),
            support_services: area(73, 'Support services uneven across programs', 53, 47),
          },
        },
        {
          year: 2023, overall: 73,
          areas: {
            participation: area(75, 'New womens lacrosse added, improving ratio', 53, 47),
            scholarships: area(74, 'Scholarship equity action plan implemented', 54, 46),
            equipment: area(72, 'Equipment upgrades funded by donor gift', 55, 45),
            scheduling: area(71, 'New scheduling committee formed', 55, 45),
            travel: area(74, 'Travel policies updated', 53, 47),
            tutoring: area(76, 'Extended tutoring hours implemented', 52, 48),
            coaching: area(69, 'Coaching salary gap partially addressed', 58, 42),
            facilities: area(75, 'Womens facility renovation began', 52, 48),
            publicity: area(70, 'Dedicated womens sports reporter hired', 58, 42),
            recruiting: area(73, 'Recruiting spend increased for womens sports', 54, 46),
            support_services: area(77, 'Expanded academic support for all teams', 52, 48),
          },
        },
        {
          year: 2024, overall: 78,
          areas: {
            participation: area(80, 'Participation ratio near parity', 51, 49),
            scholarships: area(79, 'Scholarship equity substantially improved', 52, 48),
            equipment: area(77, 'Equipment equity much improved', 54, 46),
            scheduling: area(76, 'Scheduling improvements sustained', 54, 46),
            travel: area(79, 'Travel equitable for most programs', 52, 48),
            tutoring: area(81, 'Tutoring fully equitable', 51, 49),
            coaching: area(74, 'Coaching salary gap reduced to 15%', 57, 43),
            facilities: area(80, 'Womens facility renovation complete', 51, 49),
            publicity: area(75, 'Media coverage improved significantly', 57, 43),
            recruiting: area(78, 'Recruiting equity strong', 53, 47),
            support_services: area(81, 'Support services near full equity', 51, 49),
          },
        },
      ],
    },
    duke: {
      years: [
        {
          year: 2022, overall: 65,
          areas: {
            participation: area(63, 'Participation gap of 8% versus enrollment parity', 54, 46),
            scholarships: area(67, 'Scholarship distribution better than participation', 53, 47),
            equipment: area(68, 'Equipment adequate but gaps in womens lacrosse', 54, 46),
            scheduling: area(66, 'Practice times heavily favor mens sports', 57, 43),
            travel: area(70, 'Travel budgets reasonable', 53, 47),
            tutoring: area(74, 'Duke academic support strong for all', 51, 49),
            coaching: area(61, 'Coaching salary gap -22%, serious concern', 61, 39),
            facilities: area(71, 'Cameron Indoor favorable but other facilities lag', 53, 47),
            publicity: area(68, 'Basketball coverage dominates media', 58, 42),
            recruiting: area(66, 'Recruiting budget gap in womens sports', 56, 44),
            support_services: area(72, 'Academic support excellent', 51, 49),
          },
        },
        {
          year: 2023, overall: 69,
          areas: {
            participation: area(67, 'Participation still below enrollment parity', 53, 47),
            scholarships: area(71, 'Scholarship improvements noted', 52, 48),
            equipment: area(70, 'Equipment gaps partially addressed', 54, 46),
            scheduling: area(69, 'Scheduling task force formed', 56, 44),
            travel: area(72, 'Travel policies updated', 53, 47),
            tutoring: area(76, 'Academic support maintained at high level', 51, 49),
            coaching: area(65, 'Coaching salary review in progress, gap remains large', 60, 40),
            facilities: area(73, 'Womens facility investment announced', 52, 48),
            publicity: area(71, 'Womens lacrosse coverage expanded', 56, 44),
            recruiting: area(69, 'Recruiting equity plan in development', 55, 45),
            support_services: area(74, 'Support services adequate', 51, 49),
          },
        },
        {
          year: 2024, overall: 73,
          areas: {
            participation: area(71, 'Participation gap reduced to 5%, still watch status', 52, 48),
            scholarships: area(75, 'Scholarship distribution improved', 52, 48),
            equipment: area(74, 'Equipment equity reached for most sports', 53, 47),
            scheduling: area(73, 'Scheduling improvements implemented', 55, 45),
            travel: area(75, 'Travel equitable', 52, 48),
            tutoring: area(79, 'Academic support excellent', 50, 50),
            coaching: area(68, 'Coaching salary gap still -15%, ongoing concern', 58, 42),
            facilities: area(76, 'New womens facility groundbreaking occurred', 52, 48),
            publicity: area(72, 'Media coverage more balanced', 56, 44),
            recruiting: area(73, 'Recruiting equity improving', 54, 46),
            support_services: area(76, 'Support services expanded', 51, 49),
          },
        },
      ],
    },
    kansas: {
      years: [
        {
          year: 2022, overall: 58,
          areas: {
            participation: area(60, 'Significant participation gap, female athletes underrepresented', 58, 42),
            scholarships: area(62, 'Scholarship distribution does not match enrollment', 57, 43),
            equipment: area(59, 'Equipment quality significantly worse for womens programs', 60, 40),
            scheduling: area(57, 'Practice times heavily disadvantage womens sports', 61, 39),
            travel: area(61, 'Travel funding inadequate for womens non-revenue sports', 58, 42),
            tutoring: area(65, 'Tutoring available but womens access limited', 56, 44),
            coaching: area(55, 'Coaching salary gap -40%, at risk', 65, 35),
            facilities: area(60, 'Womens facilities significantly inferior', 60, 40),
            publicity: area(48, 'Publicity gap -59%, at risk, women barely covered', 70, 30),
            recruiting: area(58, 'Recruiting budget heavily skewed to mens sports', 61, 39),
            support_services: area(62, 'Support services unequal', 58, 42),
          },
        },
        {
          year: 2023, overall: 62,
          areas: {
            participation: area(63, 'Participation still significantly below parity', 57, 43),
            scholarships: area(65, 'Scholarship improvements underway', 56, 44),
            equipment: area(62, 'Equipment upgrade plan funded', 59, 41),
            scheduling: area(60, 'Scheduling review initiated', 60, 40),
            travel: area(63, 'Travel policy revision in progress', 58, 42),
            tutoring: area(67, 'Additional tutoring sections added', 55, 45),
            coaching: area(58, 'Coaching salary gap -35%, still at risk', 63, 37),
            facilities: area(63, 'Womens facility renovation planned', 59, 41),
            publicity: area(52, 'Publicity gap -53%, improvement plan drafted', 68, 32),
            recruiting: area(62, 'Recruiting equity plan approved', 59, 41),
            support_services: area(65, 'Support services partially equalized', 57, 43),
          },
        },
        {
          year: 2024, overall: 66,
          areas: {
            participation: area(67, 'Participation gap remains large at 12%', 56, 44),
            scholarships: area(68, 'Scholarship improvements sustained', 55, 45),
            equipment: area(65, 'Equipment upgrades completed for some sports', 58, 42),
            scheduling: area(64, 'Scheduling improvements marginal', 59, 41),
            travel: area(67, 'Travel improvements noted', 57, 43),
            tutoring: area(70, 'Tutoring now equitable by hours', 53, 47),
            coaching: area(61, 'Coaching salary gap -28%, still watch/at_risk boundary', 61, 39),
            facilities: area(66, 'Womens facility renovation started', 58, 42),
            publicity: area(56, 'Publicity gap -45%, still at risk', 66, 34),
            recruiting: area(65, 'Recruiting equity improved modestly', 58, 42),
            support_services: area(68, 'Support services improving', 56, 44),
          },
        },
      ],
    },
  }

  for (const { year, overall, areas } of configs[slug].years) {
    filings.push({
      institution_id: instId,
      year,
      filed_date: `${year}-10-01`,
      status: filingStatus(overall),
      overall_compliance_score: overall,
      participation: areas.participation,
      scholarships: areas.scholarships,
      equipment: areas.equipment,
      scheduling: areas.scheduling,
      travel: areas.travel,
      tutoring: areas.tutoring,
      coaching: areas.coaching,
      facilities: areas.facilities,
      publicity: areas.publicity,
      recruiting: areas.recruiting,
      support_services: areas.support_services,
    })
  }

  return filings
}

// ---------------------------------------------------------------------------
// Title IX Complaints
// ---------------------------------------------------------------------------

function buildTitleIXComplaints(idMap: Record<string, string>) {
  return [
    {
      institution_id: idMap['alabama'],
      complaint_date: '2023-03-15',
      complaint_type: 'hostile_environment',
      involves_athletics: true,
      status: 'resolved',
      resolution: 'Training implemented',
      source_url: 'https://rolltide.com/titleix/2023-001',
      scraped_at: new Date().toISOString(),
    },
    {
      institution_id: idMap['duke'],
      complaint_date: '2024-01-22',
      complaint_type: 'unequal_treatment',
      involves_athletics: true,
      status: 'under_investigation',
      resolution: null,
      source_url: 'https://goduke.com/titleix/2024-001',
      scraped_at: new Date().toISOString(),
    },
    {
      institution_id: idMap['kansas'],
      complaint_date: '2023-09-10',
      complaint_type: 'harassment',
      involves_athletics: false,
      status: 'resolved',
      resolution: 'Respondent sanctioned',
      source_url: 'https://kuathletics.com/titleix/2023-001',
      scraped_at: new Date().toISOString(),
    },
    {
      institution_id: idMap['michigan'],
      complaint_date: '2024-03-01',
      complaint_type: 'disparate_impact',
      involves_athletics: true,
      status: 'open',
      resolution: null,
      source_url: 'https://mgoblue.com/titleix/2024-001',
      scraped_at: new Date().toISOString(),
    },
    {
      institution_id: idMap['oregon'],
      complaint_date: '2022-11-05',
      complaint_type: 'retaliation',
      involves_athletics: false,
      status: 'dismissed',
      resolution: 'Insufficient evidence',
      source_url: 'https://goducks.com/titleix/2022-001',
      scraped_at: new Date().toISOString(),
    },
    {
      institution_id: idMap['kansas'],
      complaint_date: '2024-02-14',
      complaint_type: 'unequal_treatment',
      involves_athletics: true,
      status: 'under_investigation',
      resolution: null,
      source_url: 'https://kuathletics.com/titleix/2024-001',
      scraped_at: new Date().toISOString(),
    },
  ]
}

// ---------------------------------------------------------------------------
// Donor Events — 25 per school = 125 total
// ---------------------------------------------------------------------------

const SPORTS = ['Football', "Men's Basketball", "Women's Basketball", 'Athletic Fund', 'Baseball', 'Swimming & Diving', 'Track & Field', 'Tennis', 'Soccer', 'Volleyball']

const START_DATE = new Date('2023-09-01')
const END_DATE = new Date('2025-02-28')

function donorAmount(tier: 'small' | 'medium' | 'large'): number {
  if (tier === 'small') return randomBetween(500000, 5000000)     // $5K-$50K in cents
  if (tier === 'medium') return randomBetween(7500000, 25000000)  // $75K-$250K in cents
  return randomBetween(50000000, 500000000)                        // $500K-$5M in cents
}

function buildDonorEvents(instId: string, slug: string) {
  const events = []

  const namedDonors: Record<string, string[]> = {
    michigan: ['William Harbaugh', 'Robert Ufer', 'Sarah Canham'],
    alabama: ['Paul Bryant Jr.', 'Mal Moore Foundation', 'Nick Saban Charitable'],
    oregon: ['Phil Knight', 'Mark Johnson', 'Lisa Hatfield'],
    duke: ['David Rubenstein', 'John Gerngross', 'Anne Ford'],
    kansas: ['David Booth', 'Dolph Simons Jr.', 'Bill Self Foundation'],
  }

  const genericDonors: Record<string, string[]> = {
    michigan: [
      'James Wolverton', 'Patricia Heisman', 'Richard Fielding', 'Carol Maize', 'Thomas Bluestone',
      'Margaret Arbordale', 'Steven Canham II', 'Linda Schembechler', 'Harold Ufer', 'Barbara Harbaugh',
      'Douglas Crisler', 'Nancy Yost', 'Michael Fielding', 'Susan Wolverine', 'Christopher Maize',
      'Elizabeth Arbordale', 'Robert Schembechler', 'Jennifer Crisler', 'William Maize Jr.', 'Katherine Heisman',
      'Andrew Wolverton', 'Michelle Bluestone',
    ],
    alabama: [
      'James Tide', 'Patricia Crimson', 'Richard Bryant', 'Carol Saban', 'Thomas Tuscaloosa',
      'Margaret Denny', 'Steven Coleman', 'Linda Bama', 'Harold Stallings', 'Barbara Sewell',
      'Douglas Moore', 'Nancy Farrah', 'Michael Crimson', 'Susan Tide', 'Christopher Bryant',
      'Elizabeth Saban', 'Robert Denny', 'Jennifer Coleman', 'William Farrah', 'Katherine Sewell',
      'Andrew Moore', 'Michelle Tuscaloosa',
    ],
    oregon: [
      'James Duckett', 'Patricia Green', 'Richard Hatfield', 'Carol Autzen', 'Thomas Ducks',
      'Margaret Lanning', 'Steven Altman', 'Linda Emerald', 'Harold Knight II', 'Barbara Duckett',
      'Douglas Autzen', 'Nancy Oregon', 'Michael Green', 'Susan Duckett', 'Christopher Lanning',
      'Elizabeth Hatfield', 'Robert Altman', 'Jennifer Emerald', 'William Knight III', 'Katherine Oregon',
      'Andrew Duckett', 'Michelle Green',
    ],
    duke: [
      'James Cameron', 'Patricia Blue', 'Richard Fuqua', 'Carol Cameron', 'Thomas Sanford',
      'Margaret Brodhead', 'Steven Krzyzewski', 'Linda Duke', 'Harold Rubenstein II', 'Barbara Cameron',
      'Douglas Fuqua', 'Nancy Blue', 'Michael Sanford', 'Susan Cameron', 'Christopher Brodhead',
      'Elizabeth Krzyzewski', 'Robert Gerngross II', 'Jennifer Sanford', 'William Fuqua', 'Katherine Blue',
      'Andrew Cameron', 'Michelle Duke',
    ],
    kansas: [
      'James Jayhawk', 'Patricia Crimson', 'Richard Booth II', 'Carol Allen', 'Thomas Lawrence',
      'Margaret Phog', 'Steven Self', 'Linda Booth', 'Harold Simons III', 'Barbara Jayhawk',
      'Douglas Allen', 'Nancy Lawrence', 'Michael Phog', 'Susan Jayhawk', 'Christopher Self',
      'Elizabeth Booth', 'Robert Simons', 'Jennifer Allen', 'William Lawrence', 'Katherine Phog',
      'Andrew Jayhawk', 'Michelle Self',
    ],
  }

  const named = namedDonors[slug]
  const generic = genericDonors[slug]

  // 15 small gifts
  for (let i = 0; i < 15; i++) {
    events.push({
      institution_id: instId,
      donor_name: i < 3 ? named[i % named.length] : generic[i % generic.length],
      amount_usd: donorAmount('small'),
      gift_date: randomDate(START_DATE, END_DATE),
      designated_sport: pick(SPORTS),
      facility_name: null,
      source_url: null,
      scraped_at: new Date().toISOString(),
    })
  }

  // 8 medium gifts
  for (let i = 0; i < 8; i++) {
    events.push({
      institution_id: instId,
      donor_name: generic[(i + 15) % generic.length],
      amount_usd: donorAmount('medium'),
      gift_date: randomDate(START_DATE, END_DATE),
      designated_sport: pick(SPORTS),
      facility_name: null,
      source_url: null,
      scraped_at: new Date().toISOString(),
    })
  }

  // 2 large gifts
  const facilityNames: Record<string, string[]> = {
    michigan: ['Harbaugh Athletic Center', 'Schembechler Hall Expansion'],
    alabama: ['Bryant-Denny Expansion Wing', 'Coleman Coliseum Renovation'],
    oregon: ['Knight Sports Performance Center', 'Autzen Stadium Expansion'],
    duke: ['Cameron Indoor Renovation', 'Fuqua Athletic Village'],
    kansas: ['Allen Fieldhouse Renovation', 'Booth Family Hall Expansion'],
  }

  for (let i = 0; i < 2; i++) {
    events.push({
      institution_id: instId,
      donor_name: named[i % named.length],
      amount_usd: donorAmount('large'),
      gift_date: randomDate(START_DATE, END_DATE),
      designated_sport: i === 0 ? 'Athletic Fund' : pick(SPORTS),
      facility_name: facilityNames[slug][i],
      source_url: null,
      scraped_at: new Date().toISOString(),
    })
  }

  return events
}

// ---------------------------------------------------------------------------
// Social Signals — 20 per school = 100 total
// ---------------------------------------------------------------------------

function buildSocialSignals(instId: string, slug: string) {
  const signals = []

  const data: Record<string, { platform: string; author: string; post_text: string; sentiment_score: number; keywords: string[] }[]> = {
    michigan: [
      { platform: 'twitter', author: '@wolverine_fan99', post_text: 'Incredible atmosphere at the Big House today! Michigan football is BACK! #GoBlue #Michigan #CFB', sentiment_score: 85, keywords: ['football', 'Big House', 'GoBlue', 'atmosphere'] },
      { platform: 'twitter', author: '@annarbor_sports', post_text: 'Dusty May has this Michigan basketball team playing with so much energy. Final Four vibes. #Michigan #MarchMadness', sentiment_score: 78, keywords: ['basketball', 'Dusty May', 'Final Four', 'Michigan'] },
      { platform: 'reddit', author: 'u/MGoBlogFan', post_text: 'Sherrone Moore\'s offensive scheme is finally clicking. The run game looks unstoppable. Thoughts?', sentiment_score: 65, keywords: ['football', 'Sherrone Moore', 'offense', 'run game'] },
      { platform: 'twitter', author: '@umich_alum_2005', post_text: 'Disappointed in Michigan\'s handling of the recruiting investigation. We need full transparency. #Michigan', sentiment_score: -45, keywords: ['investigation', 'recruiting', 'transparency', 'Michigan'] },
      { platform: 'bluesky', author: 'wolverinewatch.bsky.social', post_text: 'Michigan\'s transfer portal strategy this off-season has been impressive. Adding depth at every position.', sentiment_score: 70, keywords: ['transfer portal', 'Michigan', 'recruiting', 'depth'] },
      { platform: 'twitter', author: '@bigten_tracker', post_text: 'Michigan vs Ohio State ticket prices at all-time high. Demand incredible this year.', sentiment_score: 40, keywords: ['Michigan', 'Ohio State', 'tickets', 'Big Ten'] },
      { platform: 'reddit', author: 'u/AnnArborLocal', post_text: 'The new athlete dorms are fantastic. Michigan is investing seriously in student athlete experience.', sentiment_score: 72, keywords: ['facilities', 'Michigan', 'student athletes', 'dorms'] },
      { platform: 'twitter', author: '@mlive_sports', post_text: 'Michigan football wins recruiting battle for top-rated QB prospect. Another elite class building.', sentiment_score: 80, keywords: ['recruiting', 'football', 'quarterback', 'Michigan'] },
      { platform: 'bluesky', author: 'cfbanalysis.bsky.social', post_text: 'Michigan\'s APR scores among the best in the country. Winning on and off the field.', sentiment_score: 75, keywords: ['APR', 'academics', 'Michigan', 'compliance'] },
      { platform: 'twitter', author: '@disappointed_um', post_text: 'Sign stealing scandal fallout still affecting team culture. Players transferring out is concerning. #Michigan', sentiment_score: -60, keywords: ['scandal', 'sign stealing', 'transfer', 'culture'] },
      { platform: 'reddit', author: 'u/HailToMichigan', post_text: 'Watching Michigan basketball practice. Team looks sharp. May has them running a beautiful motion offense.', sentiment_score: 68, keywords: ['basketball', 'practice', 'Michigan', 'Dusty May'] },
      { platform: 'twitter', author: '@athletic_dept_news', post_text: 'Michigan Athletic Department reports record $220M revenue. Strong financial position heading into expansion era.', sentiment_score: 82, keywords: ['revenue', 'finances', 'Michigan', 'athletics'] },
      { platform: 'bluesky', author: 'titleixwatch.bsky.social', post_text: 'New disparate impact complaint filed at Michigan athletics. Follow the process carefully.', sentiment_score: -30, keywords: ['Title IX', 'complaint', 'Michigan', 'compliance'] },
      { platform: 'twitter', author: '@goBlue_forever', post_text: 'Michigan women\'s hockey wins Big Ten championship. Incredible season! #GoBlue #WomensHockey', sentiment_score: 88, keywords: ['womens hockey', 'Big Ten', 'championship', 'Michigan'] },
      { platform: 'reddit', author: 'u/BigTenFanatic', post_text: 'Michigan vs Penn State was an all-time game. The student section was absolutely electric.', sentiment_score: 76, keywords: ['football', 'Penn State', 'Michigan', 'student section'] },
      { platform: 'twitter', author: '@mgoblue_insider', post_text: 'Sherrone Moore addresses the media on the team\'s upcoming schedule. Confident and composed.', sentiment_score: 55, keywords: ['Sherrone Moore', 'Michigan', 'football', 'media'] },
      { platform: 'bluesky', author: 'collegeathletics.bsky.social', post_text: 'Michigan donor gift of $45M for new training facility announced. Big Ten arms race continues.', sentiment_score: 60, keywords: ['donor', 'facility', 'Michigan', 'investment'] },
      { platform: 'twitter', author: '@frustrated_um_fan', post_text: 'Three straight losses. The offensive line is a problem that hasn\'t been fixed. Fire the OL coach.', sentiment_score: -70, keywords: ['football', 'losses', 'offensive line', 'Michigan'] },
      { platform: 'reddit', author: 'u/WolverineDaily', post_text: 'Michigan basketball\'s transfer portal additions look like great fits. Excited for the season.', sentiment_score: 72, keywords: ['basketball', 'transfer', 'Michigan', 'roster'] },
      { platform: 'twitter', author: '@sports_michigan', post_text: 'Michigan Athletics launching new NIL collective for athletes. Top 5 program for name-image-likeness deals.', sentiment_score: 65, keywords: ['NIL', 'Michigan', 'athletics', 'collective'] },
    ],
    alabama: [
      { platform: 'twitter', author: '@rolltide_nation', post_text: 'Bryant-Denny Stadium rocking tonight! Alabama football is what college sports is all about. #RollTide', sentiment_score: 90, keywords: ['football', 'Bryant-Denny', 'RollTide', 'atmosphere'] },
      { platform: 'twitter', author: '@bama_hoops_fan', post_text: 'Nate Oats has transformed Alabama basketball. Sweet 16 here we come! #Alabama #RollTide', sentiment_score: 82, keywords: ['basketball', 'Nate Oats', 'Sweet 16', 'Alabama'] },
      { platform: 'reddit', author: 'u/CrimsonTideReport', post_text: 'Kalen DeBoer\'s first season has been solid but not Saban-level. Adjustment period expected.', sentiment_score: 35, keywords: ['football', 'Kalen DeBoer', 'Alabama', 'coaching'] },
      { platform: 'twitter', author: '@sec_insider', post_text: 'Alabama facilities are the gold standard. New athletic complex is absolutely stunning.', sentiment_score: 88, keywords: ['facilities', 'Alabama', 'SEC', 'complex'] },
      { platform: 'bluesky', author: 'bamawatch.bsky.social', post_text: 'Alabama\'s Title IX training sessions following the 2023 complaint getting positive reviews from athletes.', sentiment_score: 50, keywords: ['Title IX', 'training', 'Alabama', 'compliance'] },
      { platform: 'twitter', author: '@disappointed_bama', post_text: 'Alabama lost to Georgia again. Kalen DeBoer needs to fix the secondary or this season is a disaster.', sentiment_score: -55, keywords: ['football', 'Alabama', 'Georgia', 'secondary'] },
      { platform: 'reddit', author: 'u/TuscaloosaFan', post_text: 'The new NIL structure at Alabama is recruiting top players from everywhere. Smart adaptation.', sentiment_score: 70, keywords: ['NIL', 'recruiting', 'Alabama', 'football'] },
      { platform: 'twitter', author: '@crimson_white_sports', post_text: 'Alabama women\'s gymnastics wins SEC championship for third straight year. Dominant program.', sentiment_score: 85, keywords: ['gymnastics', 'SEC', 'championship', 'Alabama'] },
      { platform: 'bluesky', author: 'secfootball.bsky.social', post_text: 'Alabama\'s Paul Bryant Jr. commits $10M to new womens sports facility. Strong commitment to equity.', sentiment_score: 75, keywords: ['donor', 'womens sports', 'Alabama', 'facilities'] },
      { platform: 'twitter', author: '@al_com_sports', post_text: 'Alabama football\'s recruiting class ranked #1 in SEC for third consecutive year.', sentiment_score: 88, keywords: ['recruiting', 'football', 'Alabama', 'SEC'] },
      { platform: 'reddit', author: 'u/BamaAlum2010', post_text: 'Transfer portal has Alabama getting better players than before. DeBoer knows how to build a roster.', sentiment_score: 68, keywords: ['transfer portal', 'Alabama', 'DeBoer', 'roster'] },
      { platform: 'twitter', author: '@rolltide_critic', post_text: 'Alabama football\'s academic APR numbers are improving but still below other top programs. Concerning.', sentiment_score: -25, keywords: ['APR', 'academics', 'Alabama', 'compliance'] },
      { platform: 'bluesky', author: 'collegefootball.bsky.social', post_text: 'Alabama hosting the SEC Championship in 2025 is huge for the program and Tuscaloosa economy.', sentiment_score: 72, keywords: ['SEC Championship', 'Alabama', 'football', 'hosting'] },
      { platform: 'twitter', author: '@bamabasketball', post_text: 'Alabama hoops pulls off the upset! Oats\' team is for real this year. #Alabama #MarchMadness', sentiment_score: 86, keywords: ['basketball', 'upset', 'Alabama', 'March Madness'] },
      { platform: 'reddit', author: 'u/SECFanatic', post_text: 'Alabama vs Georgia is THE rivalry in college football right now. Who else thinks this defines the SEC?', sentiment_score: 60, keywords: ['Alabama', 'Georgia', 'rivalry', 'SEC'] },
      { platform: 'twitter', author: '@bama_compliance', post_text: 'Alabama athletics compliance office recognized for excellence. Strong internal controls noted.', sentiment_score: 65, keywords: ['compliance', 'Alabama', 'athletics', 'recognition'] },
      { platform: 'bluesky', author: 'higheredsports.bsky.social', post_text: 'Alabama\'s $95M football budget is remarkable but raises questions about resource equity across programs.', sentiment_score: -15, keywords: ['budget', 'football', 'Alabama', 'equity'] },
      { platform: 'twitter', author: '@mad_bama_fan', post_text: 'Inexcusable penalty in fourth quarter cost Alabama the game. Discipline is lacking this year.', sentiment_score: -65, keywords: ['football', 'Alabama', 'penalties', 'discipline'] },
      { platform: 'reddit', author: 'u/CrimsonDieHard', post_text: 'Alabama\'s women\'s soccer team making a run in the NCAA tournament. So proud of these athletes!', sentiment_score: 80, keywords: ['soccer', 'NCAA tournament', 'Alabama', 'womens sports'] },
      { platform: 'twitter', author: '@tuscaloosa_news', post_text: 'Alabama Athletics reports $280M in revenue, leading SEC for fifth consecutive year.', sentiment_score: 77, keywords: ['revenue', 'Alabama', 'SEC', 'finances'] },
    ],
    oregon: [
      { platform: 'twitter', author: '@goducks_fan', post_text: 'Autzen Stadium electric tonight! Dan Lanning has Oregon playing championship football. #GoDucks', sentiment_score: 86, keywords: ['football', 'Autzen', 'GoDucks', 'Dan Lanning'] },
      { platform: 'twitter', author: '@oregon_hoops', post_text: 'Dana Altman is a genius. Oregon basketball doing it again with a completely retooled roster. #Ducks', sentiment_score: 80, keywords: ['basketball', 'Dana Altman', 'Oregon', 'roster'] },
      { platform: 'reddit', author: 'u/DuckNation', post_text: 'Phil Knight\'s latest gift is going to transform the Oregon athletic facilities. Can\'t wait to see it.', sentiment_score: 78, keywords: ['Phil Knight', 'donor', 'facilities', 'Oregon'] },
      { platform: 'twitter', author: '@daily_emerald', post_text: 'Oregon\'s Title IX equity score improving each year. Strong trend in right direction for Ducks athletics.', sentiment_score: 55, keywords: ['Title IX', 'equity', 'Oregon', 'compliance'] },
      { platform: 'bluesky', author: 'bigten_watch.bsky.social', post_text: 'Oregon adapting well to Big Ten. Conference realignment has been seamless for the Ducks program.', sentiment_score: 68, keywords: ['Big Ten', 'Oregon', 'realignment', 'adaptation'] },
      { platform: 'twitter', author: '@frustrated_duck', post_text: 'Oregon\'s coaching salary gap for womens sports is embarrassing. Title IX compliance needs real work.', sentiment_score: -50, keywords: ['coaching salaries', 'womens sports', 'Oregon', 'Title IX'] },
      { platform: 'reddit', author: 'u/PacNorthwestFan', post_text: 'Oregon vs Michigan in the Big Ten was everything I hoped for. Incredible atmosphere in both stadiums.', sentiment_score: 82, keywords: ['Oregon', 'Michigan', 'Big Ten', 'atmosphere'] },
      { platform: 'twitter', author: '@oregonian_sports', post_text: 'Oregon women\'s track and field wins Pac-12 championship. World-class program under the Ducks brand.', sentiment_score: 84, keywords: ['track and field', 'championship', 'Oregon', 'womens sports'] },
      { platform: 'bluesky', author: 'collegeathletics.bsky.social', post_text: 'Dan Lanning\'s recruiting prowess is elite. Oregon landing top Big Ten recruits in first year in conference.', sentiment_score: 78, keywords: ['recruiting', 'Dan Lanning', 'Oregon', 'Big Ten'] },
      { platform: 'twitter', author: '@goducks_forever', post_text: 'The new Knight Sports Performance Center is incredible. Oregon is investing in athlete success.', sentiment_score: 85, keywords: ['Knight', 'facilities', 'Oregon', 'investment'] },
      { platform: 'reddit', author: 'u/EugeneAlum', post_text: 'Oregon basketball transfer portal strategy is working. Altman finds gems every year.', sentiment_score: 70, keywords: ['basketball', 'transfer portal', 'Oregon', 'Dana Altman'] },
      { platform: 'twitter', author: '@duck_critic', post_text: 'Oregon football still can\'t beat Ohio State or Michigan consistently. Big Ten adjustment is real.', sentiment_score: -40, keywords: ['football', 'Oregon', 'Big Ten', 'Ohio State'] },
      { platform: 'bluesky', author: 'nwsports.bsky.social', post_text: 'Oregon\'s NIL program growing rapidly. Knight family foundation involvement makes them elite.', sentiment_score: 72, keywords: ['NIL', 'Knight', 'Oregon', 'recruiting'] },
      { platform: 'twitter', author: '@oregon_athletics', post_text: 'Oregon softball makes NCAA super regional for second straight year. Dominant program!', sentiment_score: 83, keywords: ['softball', 'NCAA', 'Oregon', 'womens sports'] },
      { platform: 'reddit', author: 'u/DucksInsider', post_text: 'Watching Oregon basketball practice sessions. Team chemistry looks fantastic under Altman.', sentiment_score: 67, keywords: ['basketball', 'practice', 'Oregon', 'team chemistry'] },
      { platform: 'twitter', author: '@conference_realign', post_text: 'Oregon\'s move to Big Ten has been net positive for revenue but travel burden on athletes is real concern.', sentiment_score: 25, keywords: ['Big Ten', 'Oregon', 'revenue', 'travel'] },
      { platform: 'bluesky', author: 'ducks.bsky.social', post_text: 'Oregon hosting the College Football Playoff game. Eugene is going to be insane. #GoDucks', sentiment_score: 88, keywords: ['College Football Playoff', 'Oregon', 'hosting', 'football'] },
      { platform: 'twitter', author: '@mad_ducks_fan', post_text: 'Three turnovers in the red zone. Oregon\'s QB play has been inconsistent all season. Fix this now.', sentiment_score: -62, keywords: ['football', 'turnovers', 'Oregon', 'quarterback'] },
      { platform: 'reddit', author: 'u/GreenAndYellow', post_text: 'Oregon\'s APR scores improving across all sports. Dan Lanning culture is translating off field too.', sentiment_score: 71, keywords: ['APR', 'academics', 'Oregon', 'culture'] },
      { platform: 'twitter', author: '@eugene_news_sports', post_text: 'University of Oregon athletics revenue up 18% year over year after Big Ten move. Financial win.', sentiment_score: 75, keywords: ['revenue', 'Oregon', 'Big Ten', 'finances'] },
    ],
    duke: [
      { platform: 'twitter', author: '@cameron_crazies', post_text: 'Cameron Indoor is the best atmosphere in college basketball. Duke basketball is life. #GoDuke #Duke', sentiment_score: 92, keywords: ['basketball', 'Cameron Indoor', 'GoDuke', 'atmosphere'] },
      { platform: 'twitter', author: '@duke_hoops_fan', post_text: 'Jon Scheyer is building something special. This Duke team is elite on defense. Final Four bound. #Duke', sentiment_score: 84, keywords: ['basketball', 'Jon Scheyer', 'defense', 'Duke'] },
      { platform: 'reddit', author: 'u/DukeFanatics', post_text: 'Duke women\'s soccer capturing the ACC title was incredible. Such a dominant program.', sentiment_score: 86, keywords: ['soccer', 'ACC', 'championship', 'Duke womens'] },
      { platform: 'twitter', author: '@chronicle_sports', post_text: 'Student-athletes at Duke protest practice schedule changes. Administration should listen to their concerns.', sentiment_score: -35, keywords: ['protest', 'student athletes', 'Duke', 'practice schedule'] },
      { platform: 'bluesky', author: 'accwatch.bsky.social', post_text: 'Duke\'s coaching salary gap data is alarming. -22% for womens programs is not acceptable for a top-10 university.', sentiment_score: -55, keywords: ['coaching salaries', 'gender equity', 'Duke', 'Title IX'] },
      { platform: 'twitter', author: '@dukeathletics_fan', post_text: 'Duke football finally competitive under Manny Diaz. The ACC is wide open. Go Duke! #DukeFB', sentiment_score: 65, keywords: ['football', 'Manny Diaz', 'ACC', 'Duke'] },
      { platform: 'reddit', author: 'u/BlueDevilNation', post_text: 'David Rubenstein\'s donation is going to transform Duke athletic facilities. Exciting time to be a fan.', sentiment_score: 80, keywords: ['donor', 'Rubenstein', 'facilities', 'Duke'] },
      { platform: 'twitter', author: '@frustrated_duke', post_text: 'The unequal treatment Title IX investigation has been dragging on. Duke needs to resolve this quickly.', sentiment_score: -48, keywords: ['Title IX', 'investigation', 'Duke', 'unequal treatment'] },
      { platform: 'bluesky', author: 'collegesports.bsky.social', post_text: 'Duke\'s APR scores are best in the country. Academic excellence translating to athletic success model.', sentiment_score: 87, keywords: ['APR', 'academics', 'Duke', 'excellence'] },
      { platform: 'twitter', author: '@acc_basketball', post_text: 'Duke vs Carolina is still the greatest rivalry in college basketball. Cameron indoor tonight is unreal.', sentiment_score: 89, keywords: ['basketball', 'rivalry', 'Duke', 'Carolina'] },
      { platform: 'reddit', author: 'u/DukeAlum1998', post_text: 'Watching Duke basketball practice. Scheyer runs the most organized practice I\'ve ever seen. Precise.', sentiment_score: 75, keywords: ['basketball', 'practice', 'Duke', 'Jon Scheyer'] },
      { platform: 'twitter', author: '@duke_critic', post_text: 'Duke football can\'t compete with Clemson or FSU at this level. Manny Diaz needs more time and resources.', sentiment_score: -30, keywords: ['football', 'Duke', 'Clemson', 'ACC'] },
      { platform: 'bluesky', author: 'durhamtimes.bsky.social', post_text: 'Duke athletics announces new athlete experience initiative. Focus on mental health and career development.', sentiment_score: 70, keywords: ['athlete experience', 'Duke', 'mental health', 'development'] },
      { platform: 'twitter', author: '@cameron_crazy2', post_text: 'Duke basketball\'s recruiting class is incredible. Scheyer getting the blue chippers back to Durham. #Duke', sentiment_score: 85, keywords: ['recruiting', 'basketball', 'Duke', 'Jon Scheyer'] },
      { platform: 'reddit', author: 'u/BlueDevils4Ever', post_text: 'Duke\'s Participation gap is a legitimate concern. With a 5% gap below enrollment parity, NCAA could notice.', sentiment_score: -20, keywords: ['participation', 'Title IX', 'Duke', 'compliance'] },
      { platform: 'twitter', author: '@dukebasketball_hq', post_text: 'Coach Scheyer gets ejected. Team responds with a 20-0 run. Character of this team is incredible.', sentiment_score: 80, keywords: ['basketball', 'Scheyer', 'Duke', 'character'] },
      { platform: 'bluesky', author: 'accathletics.bsky.social', post_text: 'Duke\'s new womens facility groundbreaking is a step in the right direction for gender equity.', sentiment_score: 58, keywords: ['facilities', 'womens sports', 'Duke', 'equity'] },
      { platform: 'twitter', author: '@angry_duke_fan', post_text: 'Duke football loses another close game. Special teams cost us again. Unacceptable execution.', sentiment_score: -68, keywords: ['football', 'Duke', 'special teams', 'loss'] },
      { platform: 'reddit', author: 'u/GoBlueDevils', post_text: 'Duke lacrosse program is back to being elite. National championship contenders every year.', sentiment_score: 82, keywords: ['lacrosse', 'Duke', 'national championship', 'elite'] },
      { platform: 'twitter', author: '@duke_sports_news', post_text: 'Duke Athletics reports $145M revenue. Basketball drives significant portion but football growing.', sentiment_score: 65, keywords: ['revenue', 'Duke', 'basketball', 'finances'] },
    ],
    kansas: [
      { platform: 'twitter', author: '@rock_chalk_fan', post_text: 'Allen Fieldhouse is the greatest venue in college basketball. Bill Self is a legend. #RockChalkJayhawk', sentiment_score: 90, keywords: ['basketball', 'Allen Fieldhouse', 'Bill Self', 'RockChalk'] },
      { platform: 'twitter', author: '@ku_hoops', post_text: 'Bill Self back on the bench! Kansas basketball is healthy and looking like a title contender again. #KU', sentiment_score: 88, keywords: ['basketball', 'Bill Self', 'Kansas', 'title'] },
      { platform: 'reddit', author: 'u/JayhawkNation', post_text: 'Athletic director\'s response to football staff misconduct was weak. Needs real accountability. #KansasFB', sentiment_score: -55, keywords: ['misconduct', 'investigation', 'Kansas', 'football staff'] },
      { platform: 'twitter', author: '@ku_athletics_fan', post_text: 'Lance Leipold has Kansas football bowl eligible again. Incredible turnaround from the program\'s low point.', sentiment_score: 78, keywords: ['football', 'Lance Leipold', 'Kansas', 'bowl game'] },
      { platform: 'bluesky', author: 'big12watch.bsky.social', post_text: 'Kansas Title IX compliance scores are among the worst in the Big 12. The publicity gap of -59% is shocking.', sentiment_score: -65, keywords: ['Title IX', 'compliance', 'Kansas', 'publicity gap'] },
      { platform: 'twitter', author: '@frustrated_ku', post_text: 'Kansas football loses on the road again. Defense is a major issue. Coaching needs to address this urgently.', sentiment_score: -60, keywords: ['football', 'Kansas', 'defense', 'loss'] },
      { platform: 'reddit', author: 'u/LawrenceLocal', post_text: 'David Booth\'s $50M gift to Kansas athletics is going to fund badly needed upgrades. Great day for Jayhawks.', sentiment_score: 82, keywords: ['donor', 'Booth', 'Kansas', 'facilities'] },
      { platform: 'twitter', author: '@kansan_sports', post_text: 'Kansas basketball\'s APR score of 990 is elite. Bill Self prioritizes academics with his players.', sentiment_score: 75, keywords: ['APR', 'academics', 'Kansas', 'Bill Self'] },
      { platform: 'bluesky', author: 'kansaswatch.bsky.social', post_text: 'Second Title IX complaint at Kansas in six months involving athletics. Pattern is concerning for the institution.', sentiment_score: -58, keywords: ['Title IX', 'complaint', 'Kansas', 'athletics'] },
      { platform: 'twitter', author: '@rock_chalk_proud', post_text: 'Kansas women\'s volleyball makes the Sweet 16. Incredible achievement for coach Ray Bechard\'s squad!', sentiment_score: 84, keywords: ['volleyball', 'Sweet 16', 'Kansas', 'womens sports'] },
      { platform: 'reddit', author: 'u/JayhawkForever', post_text: 'Watching Kansas basketball preseason. Self has them running the same efficient half-court offense. Elite.', sentiment_score: 70, keywords: ['basketball', 'Kansas', 'Bill Self', 'offense'] },
      { platform: 'twitter', author: '@ku_critic', post_text: 'Kansas coaching salary gap of -40% for womens programs is indefensible. Board of regents needs to act.', sentiment_score: -70, keywords: ['coaching salaries', 'womens sports', 'Kansas', 'gender equity'] },
      { platform: 'bluesky', author: 'collegefootball.bsky.social', post_text: 'Kansas football is legitimately fun to watch under Leipold. Great story of program building from the ground up.', sentiment_score: 72, keywords: ['football', 'Kansas', 'Lance Leipold', 'program building'] },
      { platform: 'twitter', author: '@ku_basketball', post_text: 'Bill Self\'s 900th career win at Allen Fieldhouse. Standing ovation. The man is basketball royalty.', sentiment_score: 92, keywords: ['basketball', 'Bill Self', 'wins', 'Kansas'] },
      { platform: 'reddit', author: 'u/LawrenceFan2001', post_text: 'Kansas publicity gap data is genuinely alarming. Womens sports getting 30% of coverage is unacceptable in 2024.', sentiment_score: -62, keywords: ['publicity', 'womens sports', 'Kansas', 'coverage'] },
      { platform: 'twitter', author: '@big12_hoops', post_text: 'Kansas dominates the Big 12 again. Nobody in this conference can match Bill Self\'s system.', sentiment_score: 85, keywords: ['basketball', 'Big 12', 'Kansas', 'Bill Self'] },
      { platform: 'bluesky', author: 'kuathletics.bsky.social', post_text: 'Kansas facility upgrades underway. Womens locker room renovation was long overdue.', sentiment_score: 45, keywords: ['facilities', 'Kansas', 'renovation', 'womens sports'] },
      { platform: 'twitter', author: '@angry_jayhawk', post_text: 'Kansas football can\'t score in the red zone. Three drives, zero points. Offense is a disaster.', sentiment_score: -72, keywords: ['football', 'Kansas', 'offense', 'red zone'] },
      { platform: 'reddit', author: 'u/RockChalkDaily', post_text: 'Kansas basketball is the standard for mid-major to power program ascent. Eight conference titles says it all.', sentiment_score: 80, keywords: ['basketball', 'Kansas', 'conference titles', 'history'] },
      { platform: 'twitter', author: '@ku_sports_report', post_text: 'Kansas Athletics revenue at $115M, up 8% year-over-year. Basketball drives majority of income.', sentiment_score: 60, keywords: ['revenue', 'Kansas', 'basketball', 'finances'] },
    ],
  }

  for (const post of data[slug]) {
    signals.push({
      institution_id: instId,
      platform: post.platform,
      post_text: post.post_text,
      post_url: `https://${post.platform}.com/${post.author.replace('@', '')}/status/${Date.now()}`,
      author: post.author,
      sentiment_score: post.sentiment_score,
      keywords: post.keywords,
      scraped_at: new Date(Date.now() - randomBetween(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return signals
}

// ---------------------------------------------------------------------------
// News Items — 15 per school = 75 total
// ---------------------------------------------------------------------------

function buildNewsItems(instId: string, slug: string) {
  const data: Record<string, { publication: string; headline: string; summary: string; article_url: string; sentiment_score: number; keywords: string[]; flags: string[]; published_at: string }[]> = {
    michigan: [
      { publication: 'Michigan Daily', headline: 'Michigan football secures top-5 recruiting class for 2025', summary: 'The Wolverines landed commitments from five-star prospects at quarterback and wide receiver, solidifying their position as a national recruiting power under coach Sherrone Moore.', article_url: 'https://michigandaily.com/sports/2024/recruiting-class-2025', sentiment_score: 85, keywords: ['recruiting', 'football', 'Michigan', '2025 class'], flags: [], published_at: '2024-02-01T10:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Report: Assistant coach under investigation for recruiting violations', summary: 'Michigan Athletics confirmed an internal review is underway following allegations that an assistant coach made improper contact with a prospect during an evaluation period.', article_url: 'https://michigandaily.com/sports/2024/recruiting-investigation', sentiment_score: -45, keywords: ['investigation', 'recruiting', 'Michigan', 'violations'], flags: ['investigation'], published_at: '2024-03-10T14:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Dusty May era begins with dominant non-conference wins', summary: 'New head coach Dusty May impressed fans and analysts with a 5-0 start to the season, showcasing a faster pace of play and improved three-point shooting.', article_url: 'https://michigandaily.com/sports/2024/dusty-may-debut', sentiment_score: 80, keywords: ['basketball', 'Dusty May', 'Michigan', 'wins'], flags: [], published_at: '2024-11-25T18:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Michigan athletics reports record $220M in annual revenue', summary: 'The athletic department\'s financial report shows a 12% revenue increase driven by Big Ten media rights expansion and increased football attendance.', article_url: 'https://michigandaily.com/sports/2024/revenue-record', sentiment_score: 75, keywords: ['revenue', 'Michigan', 'Big Ten', 'finances'], flags: [], published_at: '2024-06-15T09:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Title IX complaint raises questions about athletic department practices', summary: 'A formal disparate impact complaint has been filed with the university, alleging that certain athletic department policies disproportionately disadvantage female student-athletes.', article_url: 'https://michigandaily.com/sports/2024/title-ix-complaint', sentiment_score: -40, keywords: ['Title IX', 'complaint', 'Michigan', 'disparate impact'], flags: ['investigation'], published_at: '2024-03-05T12:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Michigan women\'s hockey claims sixth Big Ten title', summary: 'The Wolverines captured their sixth conference championship with a dominant 4-1 victory over Minnesota in Ann Arbor.', article_url: 'https://michigandaily.com/sports/2024/womens-hockey-big-ten', sentiment_score: 88, keywords: ['hockey', 'Big Ten', 'championship', 'Michigan womens'], flags: [], published_at: '2025-01-20T22:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Big House renovation plans approved by Board of Regents', summary: 'A $250M expansion of Michigan Stadium will add premium seating and update infrastructure, funded through a combination of donor gifts and bond financing.', article_url: 'https://michigandaily.com/sports/2024/big-house-renovation', sentiment_score: 70, keywords: ['facilities', 'stadium', 'Michigan', 'renovation'], flags: [], published_at: '2024-09-12T11:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Star linebacker suspended after campus conduct violation', summary: 'A key defensive player has been suspended indefinitely pending resolution of an off-field conduct matter, creating uncertainty for Michigan\'s defensive depth.', article_url: 'https://michigandaily.com/sports/2025/linebacker-suspended', sentiment_score: -55, keywords: ['suspension', 'Michigan', 'football', 'conduct'], flags: ['suspension', 'misconduct'], published_at: '2025-01-08T16:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Sherrone Moore signs contract extension through 2029', summary: 'The university announced a five-year extension for head coach Sherrone Moore, signaling confidence in his leadership despite the program\'s ongoing transition from the Harbaugh era.', article_url: 'https://michigandaily.com/sports/2024/moore-extension', sentiment_score: 65, keywords: ['contract', 'Sherrone Moore', 'Michigan', 'football'], flags: [], published_at: '2024-05-20T14:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Michigan track and field sweeps Big Ten indoor championships', summary: 'Both the men\'s and women\'s track programs earned Big Ten titles at the indoor championships, demonstrating the depth of Michigan\'s Olympic sports programs.', article_url: 'https://michigandaily.com/sports/2025/track-big-ten-sweep', sentiment_score: 82, keywords: ['track and field', 'Big Ten', 'championship', 'Michigan'], flags: [], published_at: '2025-02-28T20:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Michigan NIL collective raises $35M for student athlete compensation', summary: 'The Champions Circle NIL collective announced record fundraising, positioning Michigan among the nation\'s elite programs for athlete compensation and recruitment.', article_url: 'https://michigandaily.com/sports/2024/nil-collective-fundraising', sentiment_score: 72, keywords: ['NIL', 'Michigan', 'collective', 'compensation'], flags: [], published_at: '2024-07-30T10:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Student-athletes speak out on transfer portal mental health concerns', summary: 'Several current and former Michigan athletes shared concerns about the emotional toll of the transfer portal era, calling for additional counseling resources.', article_url: 'https://michigandaily.com/sports/2024/transfer-mental-health', sentiment_score: -20, keywords: ['transfer portal', 'mental health', 'Michigan', 'student athletes'], flags: ['transfer'], published_at: '2024-04-18T09:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Michigan basketball reaches Sweet 16 for fourth time in five years', summary: 'The Wolverines\' NCAA tournament run continues as Dusty May\'s squad defeated a seeded opponent in the second round, validating Michigan\'s rise as a consistent March program.', article_url: 'https://michigandaily.com/sports/2025/sweet-16-run', sentiment_score: 90, keywords: ['basketball', 'NCAA tournament', 'Sweet 16', 'Michigan'], flags: [], published_at: '2025-03-20T23:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Michigan baseball program receives major facility upgrade funding', summary: 'A $12M renovation of Ray Fisher Stadium was announced, funded by a lead gift from a Michigan alumnus, with plans to modernize the historic facility.', article_url: 'https://michigandaily.com/sports/2024/baseball-facility', sentiment_score: 68, keywords: ['baseball', 'facilities', 'Michigan', 'renovation'], flags: [], published_at: '2024-08-14T11:00:00Z' },
      { publication: 'Michigan Daily', headline: 'Football players organize protest over NIL equity concerns', summary: 'A group of Michigan football players publicly called for greater transparency in NIL distribution, arguing that lower-profile position players receive inequitable compensation relative to stars.', article_url: 'https://michigandaily.com/sports/2024/nil-equity-protest', sentiment_score: -35, keywords: ['protest', 'NIL', 'equity', 'Michigan football'], flags: ['protest'], published_at: '2024-10-02T15:00:00Z' },
    ],
    alabama: [
      { publication: 'Crimson White', headline: 'SEC announces Alabama will host 2025 championship game', summary: 'The Southeastern Conference selected Tuscaloosa as the host site for the 2025 SEC Championship Game, bringing national exposure and significant economic impact to the region.', article_url: 'https://cw.ua.edu/sports/2024/sec-championship-host', sentiment_score: 85, keywords: ['SEC Championship', 'Alabama', 'hosting', 'football'], flags: [], published_at: '2024-04-10T10:00:00Z' },
      { publication: 'Crimson White', headline: 'Transfer portal: Alabama adds 3-star running back from Georgia', summary: 'Kalen DeBoer bolsters the backfield depth with a transfer from a rival SEC program, highlighting Alabama\'s continued success in leveraging the transfer portal to fill roster needs.', article_url: 'https://cw.ua.edu/sports/2024/transfer-rb-georgia', sentiment_score: 70, keywords: ['transfer portal', 'Alabama', 'football', 'running back'], flags: ['transfer'], published_at: '2024-01-15T14:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama basketball advances to Elite Eight under Nate Oats', summary: 'The Crimson Tide continue their best NCAA tournament run in decades, beating a number-two seed to reach the Elite Eight for the first time since the 1990s.', article_url: 'https://cw.ua.edu/sports/2025/elite-eight', sentiment_score: 92, keywords: ['basketball', 'NCAA tournament', 'Elite Eight', 'Alabama'], flags: [], published_at: '2025-03-25T22:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama facilities rated best in nation by athlete survey', summary: 'An independent survey of Division I athletes rated Alabama\'s athletic facilities number one nationally for the third consecutive year, citing investment and modernity.', article_url: 'https://cw.ua.edu/sports/2024/facilities-ranking', sentiment_score: 90, keywords: ['facilities', 'ranking', 'Alabama', 'athlete survey'], flags: [], published_at: '2024-09-20T11:00:00Z' },
      { publication: 'Crimson White', headline: 'Title IX training program draws praise from advocacy groups', summary: 'Alabama\'s comprehensive Title IX training program, implemented following a 2023 complaint, has been recognized by national advocacy organizations as a model for peer institutions.', article_url: 'https://cw.ua.edu/sports/2024/title-ix-training', sentiment_score: 60, keywords: ['Title IX', 'training', 'Alabama', 'compliance'], flags: [], published_at: '2024-02-28T09:00:00Z' },
      { publication: 'Crimson White', headline: 'Kalen DeBoer completes first full recruiting cycle at Alabama', summary: 'DeBoer\'s inaugural full recruiting class at Alabama earned a top-three national ranking, signaling that elite talent continues to choose Tuscaloosa despite the coaching transition.', article_url: 'https://cw.ua.edu/sports/2024/deboer-recruiting', sentiment_score: 82, keywords: ['recruiting', 'Kalen DeBoer', 'Alabama', 'football'], flags: [], published_at: '2025-02-05T14:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama women\'s gymnastics captures eighth national title', summary: 'The Crimson Tide gymnastics program added another national championship banner to Coleman Coliseum, cementing their dynasty status in collegiate gymnastics.', article_url: 'https://cw.ua.edu/sports/2024/gymnastics-national-title', sentiment_score: 95, keywords: ['gymnastics', 'national championship', 'Alabama', 'dynasty'], flags: [], published_at: '2024-04-20T21:00:00Z' },
      { publication: 'Crimson White', headline: 'Football assistant placed on administrative leave amid misconduct probe', summary: 'Alabama Athletics confirmed that a position coach has been placed on paid administrative leave while the university investigates allegations of inappropriate conduct toward staff members.', article_url: 'https://cw.ua.edu/sports/2024/assistant-leave', sentiment_score: -55, keywords: ['misconduct', 'investigation', 'Alabama', 'football assistant'], flags: ['investigation', 'misconduct'], published_at: '2024-11-08T16:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama football\'s $95M budget leads all SEC programs', summary: 'A financial analysis reveals Alabama\'s football operational budget surpasses all conference competitors, reflecting the program\'s sustained investment in remaining at the sport\'s apex.', article_url: 'https://cw.ua.edu/sports/2024/football-budget-leader', sentiment_score: 55, keywords: ['budget', 'football', 'Alabama', 'SEC finances'], flags: [], published_at: '2024-07-12T10:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama softball reaches Women\'s College World Series', summary: 'The Crimson Tide softball program qualifies for the WCWS for the fifth time in eight years, continuing a tradition of success that head coach Patrick Murphy has built.', article_url: 'https://cw.ua.edu/sports/2024/softball-wcws', sentiment_score: 88, keywords: ['softball', 'WCWS', 'Alabama', 'championship'], flags: [], published_at: '2024-05-28T18:00:00Z' },
      { publication: 'Crimson White', headline: 'New $180M Bryant-Denny expansion wing approved', summary: 'University trustees approved a major stadium expansion project that will add 8,000 premium seats and modernize infrastructure, funded through private donations and naming rights.', article_url: 'https://cw.ua.edu/sports/2024/stadium-expansion', sentiment_score: 72, keywords: ['stadium', 'expansion', 'Alabama', 'facilities'], flags: [], published_at: '2024-08-22T11:00:00Z' },
      { publication: 'Crimson White', headline: 'Walk-on player suspended after social media post controversy', summary: 'A walk-on athlete was suspended from team activities after a social media post containing offensive language drew public criticism and prompted an internal review.', article_url: 'https://cw.ua.edu/sports/2025/walkon-suspension', sentiment_score: -38, keywords: ['suspension', 'social media', 'Alabama', 'conduct'], flags: ['suspension'], published_at: '2025-01-22T13:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama men\'s basketball sets program attendance record', summary: 'Coleman Coliseum sold out for the fourteenth straight game as Nate Oats\' program continues to draw unprecedented fan interest in what has historically been a football-first market.', article_url: 'https://cw.ua.edu/sports/2024/basketball-attendance-record', sentiment_score: 85, keywords: ['basketball', 'attendance', 'Alabama', 'Nate Oats'], flags: [], published_at: '2025-02-14T20:00:00Z' },
      { publication: 'Crimson White', headline: 'Alabama athletic director outlines five-year strategic plan', summary: 'The strategic plan emphasizes Title IX compliance improvements, NIL infrastructure expansion, and capital investment in non-revenue sport facilities to diversify the program\'s success.', article_url: 'https://cw.ua.edu/sports/2024/strategic-plan', sentiment_score: 62, keywords: ['strategic plan', 'Alabama', 'athletics', 'Title IX'], flags: [], published_at: '2024-10-15T09:00:00Z' },
      { publication: 'Crimson White', headline: 'Protest held over football staff diversity hiring practices', summary: 'Students and athletes organized a peaceful demonstration outside the athletics complex, calling for greater diversity in football coaching staff hiring decisions.', article_url: 'https://cw.ua.edu/sports/2025/diversity-protest', sentiment_score: -30, keywords: ['protest', 'diversity', 'Alabama', 'hiring'], flags: ['protest'], published_at: '2025-02-10T15:00:00Z' },
    ],
    oregon: [
      { publication: 'Daily Emerald', headline: 'Oregon football\'s Big Ten debut earns national attention', summary: 'The Ducks\' first season in the Big Ten generated historic television ratings for the conference\'s western footprint, with Oregon emerging as one of the marquee programs in the expanded league.', article_url: 'https://dailyemerald.com/sports/2024/big-ten-debut', sentiment_score: 82, keywords: ['football', 'Big Ten', 'Oregon', 'debut'], flags: [], published_at: '2024-09-05T10:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Phil Knight announces $75M gift for Knight Sports Performance Center Phase II', summary: 'The Nike co-founder expanded his decades-long investment in Oregon athletics with a landmark gift to fund the next phase of the university\'s sports science and performance infrastructure.', article_url: 'https://dailyemerald.com/sports/2024/knight-gift-phase-two', sentiment_score: 90, keywords: ['Phil Knight', 'donation', 'Oregon', 'facilities'], flags: [], published_at: '2024-06-10T11:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon women\'s track claims sixth consecutive NCAA national title', summary: 'Hayward Field hosted yet another dominant championship performance by Oregon\'s women\'s track and field program, reinforcing the university\'s status as the premier track institution in America.', article_url: 'https://dailyemerald.com/sports/2024/track-national-title', sentiment_score: 92, keywords: ['track and field', 'national championship', 'Oregon', 'womens'], flags: [], published_at: '2024-06-08T22:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon coaches\' salary gap prompts Title IX review', summary: 'A review of EADA data revealed a persistent coaching salary gap between men\'s and women\'s programs at Oregon, prompting the athletic department to commission an independent equity audit.', article_url: 'https://dailyemerald.com/sports/2023/coaching-salary-gap', sentiment_score: -40, keywords: ['coaching salaries', 'Title IX', 'Oregon', 'equity audit'], flags: ['investigation'], published_at: '2023-11-20T14:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Dana Altman extends contract through 2027', summary: 'Oregon rewarded one of college basketball\'s most consistent coaches with a contract extension, recognizing his ability to annually rebuild competitive rosters through transfers and recruiting.', article_url: 'https://dailyemerald.com/sports/2024/altman-extension', sentiment_score: 78, keywords: ['basketball', 'Dana Altman', 'Oregon', 'contract'], flags: [], published_at: '2024-04-05T10:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon athletics revenue surges 18% after Big Ten transition', summary: 'Financial records show Oregon\'s athletic revenue reached $198M in the first year of Big Ten membership, driven by conference revenue sharing and increased media rights distributions.', article_url: 'https://dailyemerald.com/sports/2024/revenue-surge', sentiment_score: 75, keywords: ['revenue', 'Big Ten', 'Oregon', 'finances'], flags: [], published_at: '2024-07-18T09:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Transfer portal petition: Oregon athletes call for improved mental health resources', summary: 'A coalition of Oregon student-athletes submitted a formal petition requesting expanded mental health counseling services, citing the psychological toll of the transfer portal era.', article_url: 'https://dailyemerald.com/sports/2024/mental-health-petition', sentiment_score: -18, keywords: ['transfer portal', 'mental health', 'Oregon', 'petition'], flags: ['transfer'], published_at: '2024-03-22T12:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Dan Lanning\'s Oregon wins Rose Bowl in first Big Ten season', summary: 'The Ducks capped a remarkable debut Big Ten season with a Rose Bowl victory, validating the program\'s investment in coaching and facilities under Dan Lanning\'s leadership.', article_url: 'https://dailyemerald.com/sports/2025/rose-bowl-win', sentiment_score: 95, keywords: ['football', 'Rose Bowl', 'Oregon', 'Dan Lanning'], flags: [], published_at: '2025-01-01T22:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon women\'s soccer reaches NCAA Final Four', summary: 'The Ducks\' soccer program advanced to the national semifinals for the first time in program history, drawing national attention to Oregon\'s growing women\'s athletic program.', article_url: 'https://dailyemerald.com/sports/2024/womens-soccer-final-four', sentiment_score: 88, keywords: ['soccer', 'Final Four', 'Oregon', 'womens'], flags: [], published_at: '2024-12-05T20:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon tight end suspended for two games after conduct review', summary: 'A starting tight end will miss two conference games following a university conduct review, with the athletic department declining to release specific details of the disciplinary matter.', article_url: 'https://dailyemerald.com/sports/2024/te-suspension', sentiment_score: -42, keywords: ['suspension', 'Oregon', 'football', 'conduct'], flags: ['suspension'], published_at: '2024-10-14T16:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Hayward Field renovation earns LEED Platinum certification', summary: 'Oregon\'s world-class track facility received the highest environmental certification, highlighting the university\'s commitment to sustainable athletic infrastructure.', article_url: 'https://dailyemerald.com/sports/2024/hayward-leed', sentiment_score: 70, keywords: ['Hayward Field', 'sustainability', 'Oregon', 'facilities'], flags: [], published_at: '2024-05-15T11:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon basketball reaches Sweet 16 for fifth time in six years', summary: 'Dana Altman\'s relentless roster construction through the transfer portal produced another March Madness run, with the Ducks defeating two seeded opponents before bowing out.', article_url: 'https://dailyemerald.com/sports/2025/sweet-16', sentiment_score: 84, keywords: ['basketball', 'Sweet 16', 'Oregon', 'NCAA tournament'], flags: [], published_at: '2025-03-22T21:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Athletes protest over Big Ten travel schedule burden', summary: 'Oregon student-athletes submitted a formal complaint about the increased travel demands of Big Ten membership, arguing that east coast road trips are harming academic performance and wellbeing.', article_url: 'https://dailyemerald.com/sports/2024/travel-protest', sentiment_score: -32, keywords: ['protest', 'travel', 'Oregon', 'Big Ten'], flags: ['protest'], published_at: '2024-11-18T13:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon announces new womens lacrosse program starting 2025', summary: 'Adding to its suite of womens sports, Oregon will launch a varsity lacrosse program in 2025, a strategic move to improve Title IX participation ratios and broaden the program\'s reach.', article_url: 'https://dailyemerald.com/sports/2024/womens-lacrosse-new', sentiment_score: 72, keywords: ['womens lacrosse', 'Oregon', 'Title IX', 'new program'], flags: [], published_at: '2024-08-08T10:00:00Z' },
      { publication: 'Daily Emerald', headline: 'Oregon football helmet camera footage leads to NCAA inquiry', summary: 'The NCAA has requested information from Oregon athletics following a report that practice footage may have been improperly shared with recruiting prospects during an evaluation period.', article_url: 'https://dailyemerald.com/sports/2025/ncaa-inquiry', sentiment_score: -48, keywords: ['NCAA', 'investigation', 'Oregon', 'football recruiting'], flags: ['investigation'], published_at: '2025-02-25T14:00:00Z' },
    ],
    duke: [
      { publication: 'Duke Chronicle', headline: 'Duke women\'s soccer captures ACC title in dramatic fashion', summary: 'The Blue Devils edged rival North Carolina in a penalty shootout to claim the ACC championship, extending Duke\'s reign as the premier womens soccer program in the conference.', article_url: 'https://dukechronicle.com/sports/2024/womens-soccer-acc', sentiment_score: 90, keywords: ['soccer', 'ACC', 'championship', 'Duke womens'], flags: [], published_at: '2024-11-10T21:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Student-athletes protest practice schedule changes', summary: 'More than forty Duke student-athletes gathered outside the athletics center to express concerns about new mandatory practice time policies that they argue conflict with academic commitments.', article_url: 'https://dukechronicle.com/sports/2024/practice-schedule-protest', sentiment_score: -38, keywords: ['protest', 'practice schedule', 'Duke', 'student athletes'], flags: ['protest'], published_at: '2024-09-25T15:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Jon Scheyer\'s Duke team ranks second nationally in academic APR', summary: 'Duke men\'s basketball earned the second-highest Academic Progress Rate in Division I this year, reflecting the program\'s dual commitment to excellence on the court and in the classroom.', article_url: 'https://dukechronicle.com/sports/2024/apr-ranking', sentiment_score: 88, keywords: ['APR', 'academics', 'Duke', 'basketball'], flags: [], published_at: '2024-05-08T10:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Title IX investigation into unequal treatment of women\'s programs ongoing', summary: 'Duke\'s internal Title IX office is conducting a formal review following a January complaint alleging systematic unequal treatment in resource allocation between men\'s and women\'s athletic programs.', article_url: 'https://dukechronicle.com/sports/2024/title-ix-investigation', sentiment_score: -50, keywords: ['Title IX', 'investigation', 'Duke', 'unequal treatment'], flags: ['investigation'], published_at: '2024-02-15T12:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'David Rubenstein commits $30M to Duke Athletic Fund', summary: 'The private equity executive and Duke alumnus made a landmark gift to the athletic program, with funds designated for non-revenue sport scholarships and new coaching staff positions.', article_url: 'https://dukechronicle.com/sports/2024/rubenstein-gift', sentiment_score: 82, keywords: ['donor', 'Rubenstein', 'Duke', 'Athletic Fund'], flags: [], published_at: '2024-03-18T11:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Duke basketball\'s recruiting class features three top-50 prospects', summary: 'Jon Scheyer secured three top-50 commitments for the 2025 class, maintaining the elite recruiting pipeline that has defined Duke basketball under multiple coaching generations.', article_url: 'https://dukechronicle.com/sports/2024/basketball-recruiting', sentiment_score: 87, keywords: ['recruiting', 'basketball', 'Duke', 'top-50'], flags: [], published_at: '2024-11-01T14:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Manny Diaz leads Duke football to bowl game for second straight year', summary: 'Duke secured bowl eligibility with a sixth win, marking back-to-back postseason appearances for the first time in program history under Manny Diaz.', article_url: 'https://dukechronicle.com/sports/2024/football-bowl-eligible', sentiment_score: 78, keywords: ['football', 'bowl game', 'Duke', 'Manny Diaz'], flags: [], published_at: '2024-11-22T18:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Coaching salary equity gap draws criticism from faculty senate', summary: 'Duke\'s faculty senate formally criticized the athletics department for its persistent coaching salary gap, urging immediate remediation and greater transparency in compensation reporting.', article_url: 'https://dukechronicle.com/sports/2024/coaching-salary-faculty', sentiment_score: -55, keywords: ['coaching salaries', 'equity', 'Duke', 'faculty'], flags: ['investigation'], published_at: '2024-04-22T13:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Cameron Indoor renovation plans unveiled by athletics department', summary: 'Duke Athletics released architectural renderings for a $85M Cameron Indoor renovation that will preserve the historic feel of the arena while modernizing infrastructure and fan experience.', article_url: 'https://dukechronicle.com/sports/2024/cameron-renovation', sentiment_score: 75, keywords: ['Cameron Indoor', 'renovation', 'Duke', 'facilities'], flags: [], published_at: '2024-08-30T10:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Duke lacrosse program ranked number one in preseason polls', summary: 'The Blue Devils enter the season as the consensus top-ranked team in collegiate lacrosse, buoyed by the return of All-American players and a strong recruiting class.', article_url: 'https://dukechronicle.com/sports/2025/lacrosse-preseason-one', sentiment_score: 86, keywords: ['lacrosse', 'ranking', 'Duke', 'preseason'], flags: [], published_at: '2025-02-18T09:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Duke player suspended amid academic integrity review', summary: 'A Duke basketball player has been suspended from competition pending an academic integrity review, the first such action in the Scheyer era.', article_url: 'https://dukechronicle.com/sports/2025/academic-suspension', sentiment_score: -45, keywords: ['suspension', 'academic integrity', 'Duke', 'basketball'], flags: ['suspension'], published_at: '2025-01-30T16:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Duke women\'s tennis captures fifth national championship', summary: 'The Blue Devils\' women\'s tennis program won the NCAA championship for the fifth time, cementing Duke\'s status as one of the nation\'s elite programs in the sport.', article_url: 'https://dukechronicle.com/sports/2024/womens-tennis-national', sentiment_score: 91, keywords: ['tennis', 'national championship', 'Duke', 'womens'], flags: [], published_at: '2024-05-22T19:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Duke athletics participation gap subject of NCAA inquiry', summary: 'The NCAA has flagged Duke\'s consistent participation gap as a potential compliance issue, requesting documentation on the university\'s Title IX accommodation analysis.', article_url: 'https://dukechronicle.com/sports/2024/ncaa-participation-inquiry', sentiment_score: -48, keywords: ['participation', 'Title IX', 'NCAA', 'Duke'], flags: ['investigation'], published_at: '2024-06-28T14:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Jon Scheyer named ACC Coach of the Year', summary: 'The Duke basketball coach received ACC Coach of the Year recognition in his second season, validating the faith the university placed in the former Krzyzewski assistant.', article_url: 'https://dukechronicle.com/sports/2025/scheyer-coy', sentiment_score: 88, keywords: ['basketball', 'Jon Scheyer', 'ACC', 'Coach of the Year'], flags: [], published_at: '2025-03-05T11:00:00Z' },
      { publication: 'Duke Chronicle', headline: 'Athletics department budgets challenged by ACC revenue shortfall', summary: 'Duke athletics faces a projected $8M revenue gap following the ACC\'s lower-than-expected media rights distribution, prompting a review of non-revenue sport funding.', article_url: 'https://dukechronicle.com/sports/2024/acc-revenue-shortfall', sentiment_score: -28, keywords: ['revenue', 'ACC', 'Duke', 'finances'], flags: [], published_at: '2024-12-10T10:00:00Z' },
    ],
    kansas: [
      { publication: 'University Daily Kansan', headline: 'Bill Self returns to bench after health scare', summary: 'Kansas head coach Bill Self made his return to coaching duties after a brief medical leave, greeted by a standing ovation at Allen Fieldhouse and renewed optimism about the team\'s championship prospects.', article_url: 'https://kansan.com/sports/2024/self-return', sentiment_score: 88, keywords: ['Bill Self', 'Kansas', 'basketball', 'return'], flags: [], published_at: '2024-01-20T18:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Athletic director responds to misconduct allegations in football staff', summary: 'Kansas Athletic Director Travis Goff issued a formal statement following reports of improper conduct by a football staff member, outlining the investigation process and interim measures taken.', article_url: 'https://kansan.com/sports/2024/ad-misconduct-response', sentiment_score: -50, keywords: ['misconduct', 'investigation', 'Kansas', 'football staff'], flags: ['misconduct', 'investigation'], published_at: '2024-07-08T15:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas basketball wins Big 12 championship for eighth time', summary: 'Bill Self\'s Jayhawks claimed yet another Big 12 regular season title, extending the program\'s remarkable run of conference dominance that defines Kansas basketball\'s modern era.', article_url: 'https://kansan.com/sports/2025/big12-championship', sentiment_score: 92, keywords: ['basketball', 'Big 12', 'championship', 'Kansas'], flags: [], published_at: '2025-03-08T21:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas Title IX publicity gap among worst in Power 5', summary: 'An analysis of EADA data shows Kansas womens sports receive only 30% of institutional media coverage, a gap that advocates say reflects structural inequity in the athletics department\'s promotional priorities.', article_url: 'https://kansan.com/sports/2024/title-ix-publicity', sentiment_score: -65, keywords: ['Title IX', 'publicity', 'Kansas', 'equity'], flags: ['investigation'], published_at: '2024-03-12T12:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Lance Leipold signs multi-year extension after bowl victory', summary: 'Kansas rewarded its football architect with a new contract following the program\'s third consecutive bowl game appearance, the first such run in Kansas football history.', article_url: 'https://kansan.com/sports/2025/leipold-extension', sentiment_score: 80, keywords: ['football', 'Lance Leipold', 'Kansas', 'extension'], flags: [], published_at: '2025-01-15T11:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'David Booth pledges $50M for Allen Fieldhouse renovation', summary: 'The Kansas alumnus and donor made his largest single athletic gift to fund a comprehensive renovation of Allen Fieldhouse that will modernize the iconic arena while preserving its historic character.', article_url: 'https://kansan.com/sports/2024/booth-fieldhouse-gift', sentiment_score: 85, keywords: ['donor', 'David Booth', 'Allen Fieldhouse', 'Kansas'], flags: [], published_at: '2024-08-15T10:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas coaching salary gap for womens programs draws faculty criticism', summary: 'Kansas faculty governance passed a resolution calling on the athletics department to address its coaching salary disparities, citing data showing women\'s coaches earn on average 60 cents for every dollar earned by men\'s coaches.', article_url: 'https://kansan.com/sports/2024/coaching-salary-faculty', sentiment_score: -60, keywords: ['coaching salaries', 'equity', 'Kansas', 'faculty'], flags: [], published_at: '2024-05-02T13:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas volleyball reaches NCAA Sweet 16', summary: 'The Jayhawks advanced past the second round of the NCAA volleyball tournament for the first time in five years, with a young and athletic squad surprising higher seeds.', article_url: 'https://kansan.com/sports/2024/volleyball-sweet-16', sentiment_score: 84, keywords: ['volleyball', 'NCAA', 'Sweet 16', 'Kansas'], flags: [], published_at: '2024-12-12T20:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Second Title IX complaint filed against Kansas athletics in 12 months', summary: 'A second complaint alleging unequal treatment in athletics was filed with the university\'s Title IX office, raising questions about the department\'s compliance culture and internal processes.', article_url: 'https://kansan.com/sports/2024/second-title-ix-complaint', sentiment_score: -62, keywords: ['Title IX', 'complaint', 'Kansas', 'compliance'], flags: ['investigation'], published_at: '2024-02-20T14:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas men\'s basketball extends streak of Top 10 national rankings', summary: 'The Jayhawks have been ranked in the Associated Press top 10 for 34 consecutive weeks, the longest active streak in Division I and a testament to the program\'s elite consistency.', article_url: 'https://kansan.com/sports/2025/top-10-streak', sentiment_score: 90, keywords: ['basketball', 'ranking', 'Kansas', 'top 10'], flags: [], published_at: '2025-02-24T09:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Football player suspended after campus incident under investigation', summary: 'A Kansas football starter has been indefinitely suspended from team activities following a campus conduct incident that is currently under university investigation.', article_url: 'https://kansan.com/sports/2024/player-suspension', sentiment_score: -52, keywords: ['suspension', 'investigation', 'Kansas', 'football'], flags: ['suspension', 'investigation'], published_at: '2024-10-28T16:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas womens basketball coach Brandon Schneider departs for Colorado', summary: 'Head coach Brandon Schneider announced his departure to take the head coaching position at Colorado, leaving Kansas to begin a national search for his replacement.', article_url: 'https://kansan.com/sports/2025/schneider-departure', sentiment_score: -30, keywords: ['coaching', 'departure', 'Kansas', 'womens basketball'], flags: [], published_at: '2025-01-10T14:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Kansas athletics begins gender equity audit', summary: 'Facing mounting pressure from Title IX advocates and faculty governance, Kansas Athletics engaged an independent consulting firm to conduct a comprehensive gender equity audit of the department.', article_url: 'https://kansan.com/sports/2024/equity-audit', sentiment_score: 30, keywords: ['equity', 'audit', 'Kansas', 'Title IX'], flags: [], published_at: '2024-06-20T11:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Rock Chalk Roundball Classic raises $2.5M for student athlete support', summary: 'The annual charity basketball game raised a record $2.5M for Kansas student-athlete scholarship and academic support programs, drawing celebrities and alumni to Lawrence.', article_url: 'https://kansan.com/sports/2024/roundball-classic-fundraiser', sentiment_score: 78, keywords: ['fundraising', 'scholarships', 'Kansas', 'charity'], flags: [], published_at: '2024-09-28T18:00:00Z' },
      { publication: 'University Daily Kansan', headline: 'Athletes protest lack of transparency in NIL distribution at Kansas', summary: 'A group of Kansas athletes held a public demonstration calling for greater transparency in how the Jayhawk Collective distributes NIL compensation, arguing the current system favors revenue sport athletes unfairly.', article_url: 'https://kansan.com/sports/2024/nil-transparency-protest', sentiment_score: -40, keywords: ['protest', 'NIL', 'transparency', 'Kansas'], flags: ['protest'], published_at: '2024-11-05T15:00:00Z' },
    ],
  }

  return data[slug].map(item => ({
    institution_id: instId,
    publication: item.publication,
    headline: item.headline,
    summary: item.summary,
    article_url: item.article_url,
    sentiment_score: item.sentiment_score,
    keywords: item.keywords,
    flags: item.flags,
    published_at: item.published_at,
    scraped_at: new Date().toISOString(),
  }))
}

// ---------------------------------------------------------------------------
// Coach Events
// ---------------------------------------------------------------------------

function buildCoachEvents(idMap: Record<string, string>) {
  return [
    {
      institution_id: idMap['michigan'],
      coach_name: 'Chip Morton',
      sport: 'Football',
      event_type: 'hire',
      confidence_score: 1.0,
      source_urls: ['https://mgoblue.com/news/chip-morton-oc'],
      confirmed: true,
      detected_at: '2024-12-15T00:00:00Z',
    },
    {
      institution_id: idMap['kansas'],
      coach_name: 'Brandon Schneider',
      sport: "Women's Basketball",
      event_type: 'departure',
      confidence_score: 1.0,
      source_urls: ['https://kuathletics.com/news'],
      confirmed: true,
      detected_at: '2025-01-08T00:00:00Z',
    },
    {
      institution_id: idMap['alabama'],
      coach_name: 'Tommy Rees',
      sport: 'Football',
      event_type: 'rumor',
      confidence_score: 0.55,
      source_urls: ['https://on3.com/rumors'],
      confirmed: false,
      detected_at: '2025-02-20T00:00:00Z',
    },
  ]
}

// ---------------------------------------------------------------------------
// Survey Results — 5 schools × 3 respondent_types × 6 dimensions × 2 waves = 180
// ---------------------------------------------------------------------------

const DIMENSIONS = ['facilities', 'staff_culture', 'athlete_experience', 'donor_engagement', 'academic_support', 'competitive_support']
const RESPONDENT_TYPES = ['administrator', 'alumni', 'student']
const WAVES = ['2024-10-01', '2025-02-01']

type SchoolScoreConfig = {
  facilities: [number, number]
  staff_culture: [number, number]
  athlete_experience: [number, number]
  donor_engagement: [number, number]
  academic_support: [number, number]
  competitive_support: [number, number]
}

// [wave1_base, wave2_base] per dimension per school
const SCORE_CONFIGS: Record<string, SchoolScoreConfig> = {
  michigan: {
    facilities: [82, 84],
    staff_culture: [78, 80],
    athlete_experience: [80, 82],
    donor_engagement: [85, 86],
    academic_support: [90, 92],
    competitive_support: [83, 85],
  },
  alabama: {
    facilities: [91, 93],
    staff_culture: [80, 82],
    athlete_experience: [82, 84],
    donor_engagement: [88, 89],
    academic_support: [76, 78],
    competitive_support: [86, 88],
  },
  oregon: {
    facilities: [74, 79],
    staff_culture: [70, 75],
    athlete_experience: [72, 77],
    donor_engagement: [76, 81],
    academic_support: [73, 78],
    competitive_support: [75, 80],
  },
  duke: {
    facilities: [78, 80],
    staff_culture: [76, 78],
    athlete_experience: [87, 90],
    donor_engagement: [80, 82],
    academic_support: [88, 90],
    competitive_support: [79, 81],
  },
  kansas: {
    facilities: [60, 62],
    staff_culture: [58, 60],
    athlete_experience: [62, 64],
    donor_engagement: [65, 67],
    academic_support: [63, 65],
    competitive_support: [67, 70],
  },
}

// Respondent type variance adjustments
const RESPONDENT_ADJUSTMENTS: Record<string, number> = {
  administrator: 3,
  alumni: 0,
  student: -3,
}

function buildSurveyResults(instId: string, slug: string) {
  const rows = []
  const config = SCORE_CONFIGS[slug]

  for (const wave_date of WAVES) {
    const waveIdx = WAVES.indexOf(wave_date)
    for (const respondent_type of RESPONDENT_TYPES) {
      for (const dimension of DIMENSIONS) {
        const [w1base, w2base] = config[dimension as keyof SchoolScoreConfig]
        const base = waveIdx === 0 ? w1base : w2base
        const adj = RESPONDENT_ADJUSTMENTS[respondent_type]
        const score = Math.min(100, Math.max(40, base + adj + randomBetween(-2, 2)))

        rows.push({
          institution_id: instId,
          wave_date,
          respondent_type,
          dimension,
          score,
          n_respondents: randomBetween(180, 420),
          margin_of_error: parseFloat((Math.random() * (4.8 - 2.1) + 2.1).toFixed(1)),
        })
      }
    }
  }

  return rows
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log('Starting seed...')

  // Delete existing data in reverse FK order
  console.log('Clearing existing data...')
  await supabase.from('survey_results').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('coach_events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('news_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('social_signals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('donor_events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('title_ix_complaints').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('eada_filings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('programs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('institutions').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Insert institutions
  console.log('Seeding institutions...')
  const { data: instData, error: instErr } = await supabase
    .from('institutions')
    .insert(INSTITUTIONS)
    .select()

  if (instErr) { console.error('institutions error:', instErr); process.exit(1) }

  const idMap: Record<string, string> = {}
  for (const inst of instData!) {
    idMap[inst.slug] = inst.id
  }
  console.log('Institutions inserted:', Object.keys(idMap))

  // Insert programs
  console.log('Seeding programs...')
  const allPrograms = INSTITUTIONS.flatMap(i => buildPrograms(idMap[i.slug], i.slug))
  const { error: progErr } = await supabase.from('programs').insert(allPrograms)
  if (progErr) { console.error('programs error:', progErr); process.exit(1) }
  console.log(`Programs inserted: ${allPrograms.length}`)

  // Insert EADA filings
  console.log('Seeding EADA filings...')
  const allFilings = INSTITUTIONS.flatMap(i => buildEadaFilings(idMap[i.slug], i.slug))
  const { error: eadaErr } = await supabase.from('eada_filings').insert(allFilings)
  if (eadaErr) { console.error('eada_filings error:', eadaErr); process.exit(1) }
  console.log(`EADA filings inserted: ${allFilings.length}`)

  // Insert Title IX complaints
  console.log('Seeding Title IX complaints...')
  const complaints = buildTitleIXComplaints(idMap)
  const { error: cmpErr } = await supabase.from('title_ix_complaints').insert(complaints)
  if (cmpErr) { console.error('title_ix_complaints error:', cmpErr); process.exit(1) }
  console.log(`Title IX complaints inserted: ${complaints.length}`)

  // Insert donor events
  console.log('Seeding donor events...')
  const allDonors = INSTITUTIONS.flatMap(i => buildDonorEvents(idMap[i.slug], i.slug))
  const { error: donorErr } = await supabase.from('donor_events').insert(allDonors)
  if (donorErr) { console.error('donor_events error:', donorErr); process.exit(1) }
  console.log(`Donor events inserted: ${allDonors.length}`)

  // Insert social signals
  console.log('Seeding social signals...')
  const allSignals = INSTITUTIONS.flatMap(i => buildSocialSignals(idMap[i.slug], i.slug))
  const { error: sigErr } = await supabase.from('social_signals').insert(allSignals)
  if (sigErr) { console.error('social_signals error:', sigErr); process.exit(1) }
  console.log(`Social signals inserted: ${allSignals.length}`)

  // Insert news items
  console.log('Seeding news items...')
  const allNews = INSTITUTIONS.flatMap(i => buildNewsItems(idMap[i.slug], i.slug))
  const { error: newsErr } = await supabase.from('news_items').insert(allNews)
  if (newsErr) { console.error('news_items error:', newsErr); process.exit(1) }
  console.log(`News items inserted: ${allNews.length}`)

  // Insert coach events
  console.log('Seeding coach events...')
  const coachEvts = buildCoachEvents(idMap)
  const { error: coachErr } = await supabase.from('coach_events').insert(coachEvts)
  if (coachErr) { console.error('coach_events error:', coachErr); process.exit(1) }
  console.log(`Coach events inserted: ${coachEvts.length}`)

  // Insert survey results
  console.log('Seeding survey results...')
  const allSurveys = INSTITUTIONS.flatMap(i => buildSurveyResults(idMap[i.slug], i.slug))
  const { error: surveyErr } = await supabase.from('survey_results').insert(allSurveys)
  if (surveyErr) { console.error('survey_results error:', surveyErr); process.exit(1) }
  console.log(`Survey results inserted: ${allSurveys.length}`)

  console.log('\nSeed complete!')
  console.log('Summary:')
  console.log(`  Institutions:       ${instData!.length}`)
  console.log(`  Programs:           ${allPrograms.length}`)
  console.log(`  EADA filings:       ${allFilings.length}`)
  console.log(`  Title IX complaints:${complaints.length}`)
  console.log(`  Donor events:       ${allDonors.length}`)
  console.log(`  Social signals:     ${allSignals.length}`)
  console.log(`  News items:         ${allNews.length}`)
  console.log(`  Coach events:       ${coachEvts.length}`)
  console.log(`  Survey results:     ${allSurveys.length}`)
}

seed().catch(console.error)

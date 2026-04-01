import type { CoachEventType } from '@/types/database'

export interface SeedCoachEvent {
  id: string
  institution_id: string
  institution_name: string
  institution_color: string
  coach_name: string
  sport: string
  event_type: CoachEventType
  confidence_score: number
  source_urls: string[]
  confirmed: boolean
  detected_at: string
}

export const SEED_COACH_EVENTS: SeedCoachEvent[] = [
  {
    id: 'ce-01',
    institution_id: 'michigan',
    institution_name: 'Michigan',
    institution_color: '#00274C',
    coach_name: 'Sherrone Moore',
    sport: 'Football',
    event_type: 'extension',
    confidence_score: 0.95,
    source_urls: ['https://mgoblue.com/news/moore-extension', 'https://espn.com/cfb/story/moore-michigan'],
    confirmed: true,
    detected_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-02',
    institution_id: 'michigan',
    institution_name: 'Michigan',
    institution_color: '#00274C',
    coach_name: 'Tommy Amaker',
    sport: "Men's Basketball",
    event_type: 'rumor',
    confidence_score: 0.41,
    source_urls: ['https://sports.yahoo.com/amaker-michigan-rumor'],
    confirmed: false,
    detected_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-03',
    institution_id: 'alabama',
    institution_name: 'Alabama',
    institution_color: '#9E1B32',
    coach_name: 'Kalen DeBoer',
    sport: 'Football',
    event_type: 'hire',
    confidence_score: 1.0,
    source_urls: ['https://rolltide.com/news/deboer-hired', 'https://cbssports.com/cfb/deboer-alabama', 'https://247sports.com/alabama-hires-deboer'],
    confirmed: true,
    detected_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-04',
    institution_id: 'alabama',
    institution_name: 'Alabama',
    institution_color: '#9E1B32',
    coach_name: 'Nate Oats',
    sport: "Men's Basketball",
    event_type: 'extension',
    confidence_score: 0.88,
    source_urls: ['https://rolltide.com/news/oats-extension', 'https://espn.com/mens-college-basketball/oats-alabama'],
    confirmed: true,
    detected_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-05',
    institution_id: 'oregon',
    institution_name: 'Oregon',
    institution_color: '#154733',
    coach_name: 'Dan Lanning',
    sport: 'Football',
    event_type: 'extension',
    confidence_score: 0.93,
    source_urls: ['https://goducks.com/news/lanning-extension', 'https://espn.com/cfb/lanning-oregon-extension'],
    confirmed: true,
    detected_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-06',
    institution_id: 'oregon',
    institution_name: 'Oregon',
    institution_color: '#154733',
    coach_name: 'Kelly Graves',
    sport: "Women's Basketball",
    event_type: 'departure',
    confidence_score: 0.82,
    source_urls: ['https://dailyemerald.com/graves-departure', 'https://espnw.com/graves-oregon'],
    confirmed: false,
    detected_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-07',
    institution_id: 'duke',
    institution_name: 'Duke',
    institution_color: '#003087',
    coach_name: 'Jon Scheyer',
    sport: "Men's Basketball",
    event_type: 'extension',
    confidence_score: 0.97,
    source_urls: ['https://goduke.com/news/scheyer-extension', 'https://espn.com/mens-college-basketball/scheyer-duke'],
    confirmed: true,
    detected_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-08',
    institution_id: 'duke',
    institution_name: 'Duke',
    institution_color: '#003087',
    coach_name: 'Manny Diaz',
    sport: 'Football',
    event_type: 'rumor',
    confidence_score: 0.55,
    source_urls: ['https://dukechronicle.com/diaz-buyout-rumors'],
    confirmed: false,
    detected_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-09',
    institution_id: 'kansas',
    institution_name: 'Kansas',
    institution_color: '#0051BA',
    coach_name: 'Bill Self',
    sport: "Men's Basketball",
    event_type: 'extension',
    confidence_score: 0.91,
    source_urls: ['https://kuathletics.com/news/self-extension', 'https://espn.com/mens-college-basketball/self-kansas'],
    confirmed: true,
    detected_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-10',
    institution_id: 'kansas',
    institution_name: 'Kansas',
    institution_color: '#0051BA',
    coach_name: 'Lance Leipold',
    sport: 'Football',
    event_type: 'departure',
    confidence_score: 0.78,
    source_urls: ['https://kansan.com/leipold-departure', 'https://rivals.com/kansas-football-coaching'],
    confirmed: false,
    detected_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-11',
    institution_id: 'michigan',
    institution_name: 'Michigan',
    institution_color: '#00274C',
    coach_name: 'Chris Partridge',
    sport: 'Football',
    event_type: 'hire',
    confidence_score: 0.99,
    source_urls: ['https://mgoblue.com/news/partridge-hire'],
    confirmed: true,
    detected_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ce-12',
    institution_id: 'alabama',
    institution_name: 'Alabama',
    institution_color: '#9E1B32',
    coach_name: 'Melissa Dixon',
    sport: "Women's Basketball",
    event_type: 'hire',
    confidence_score: 1.0,
    source_urls: ['https://rolltide.com/news/dixon-hired', 'https://espnw.com/dixon-alabama-hire'],
    confirmed: true,
    detected_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// High-confidence events from last 7 days — used for bell badge count
export function getRecentHighConfidenceCount(): number {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return SEED_COACH_EVENTS.filter(
    (e) => new Date(e.detected_at).getTime() > sevenDaysAgo && e.confidence_score >= 0.8
  ).length
}

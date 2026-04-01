/**
 * Coach Movement Monitor
 *
 * Watches 4 sources for coaching staff changes at a given institution
 * and emits structured CoachEvent records.
 *
 * Sources:
 *   1. ESPN Staff Pages  — https://www.espn.com/college-football/team/staff/_/id/{espn_id}
 *      - Scrape: table[class*="ResponsiveTable"] rows — name, title
 *      - Diff against previous crawl to detect new/missing coaches
 *
 *   2. 247Sports — https://247sports.com/college/{slug}/coaching-staff/
 *      - Scrape: .coach-entry elements — name, role
 *      - Good coverage of coordinator moves + hires before press releases
 *
 *   3. School Press Releases — `athletics_url/news?category=coaching`
 *      - Parse: article headlines and bodies
 *      - Higher confidence if official announcement
 *
 *   4. Google News RSS — https://news.google.com/rss/search?q={coach+name+school+football}
 *      - Parse with fast-xml-parser
 *      - Low confidence signal; triggers deeper check on other sources
 *
 * Confidence Scoring:
 *   - Start at 0.0
 *   - +0.50 if official school press release found
 *   - +0.30 if ESPN staff page diff confirms change
 *   - +0.20 if 247Sports confirms change
 *   - +0.15 if 2+ Google News articles in 24h
 *   - -0.10 if headline contains 'rumor', 'reportedly', 'sources say'
 *   - Cap at 1.0, floor at 0.0
 *
 * Keyword Detection (applied to article titles + first 500 chars of body):
 */

export const HIRE_KEYWORDS = ['named', 'hired', 'appointed', 'joins', 'new head coach', 'tabbed as']
export const DEPARTURE_KEYWORDS = ['fired', 'relieved of duties', 'parted ways', 'stepping down', 'resigned', 'dismissed', 'buyout']
export const EXTENSION_KEYWORDS = ['contract extension', 'new deal', 'signed through', 'extended through', 'multi-year deal']
export const RUMOR_KEYWORDS = ['reportedly', 'sources say', 'expected to', 'in talks', 'target', 'interest in']

import type { CoachEventType } from '@/types/database'

export interface DetectedCoachEvent {
  institution_id: string
  coach_name: string
  sport: string
  event_type: CoachEventType
  confidence_score: number
  source_urls: string[]
  confirmed: boolean
  detected_at: string
}

/**
 * Detect event type from article text using keyword matching.
 * Returns null if no known event type detected.
 * (Used in live scraping — not called in stub mode)
 */
export function detectEventType(text: string): CoachEventType | null {
  const lower = text.toLowerCase()
  if (DEPARTURE_KEYWORDS.some((kw) => lower.includes(kw))) return 'departure'
  if (HIRE_KEYWORDS.some((kw) => lower.includes(kw))) return 'hire'
  if (EXTENSION_KEYWORDS.some((kw) => lower.includes(kw))) return 'extension'
  if (RUMOR_KEYWORDS.some((kw) => lower.includes(kw))) return 'rumor'
  return null
}

/**
 * Score confidence from source signals.
 * Adjust scores upward when multiple independent sources agree.
 */
function scoreConfidence(signals: {
  officialPressRelease: boolean
  espnConfirmed: boolean
  s247Confirmed: boolean
  googleNewsCount: number
  isRumor: boolean
}): number {
  let score = 0
  if (signals.officialPressRelease) score += 0.5
  if (signals.espnConfirmed) score += 0.3
  if (signals.s247Confirmed) score += 0.2
  if (signals.googleNewsCount >= 2) score += 0.15
  if (signals.isRumor) score -= 0.1
  return Math.max(0, Math.min(1, score))
}

/**
 * Main entry point — monitor coaching staff for a single institution.
 *
 * In production:
 *   1. Fetch and diff all 4 sources
 *   2. For each detected change, score confidence
 *   3. Emit events for confidence >= 0.3
 *   4. Upsert to coach_events table (dedupe on institution_id + coach_name + event_type + detected date)
 *
 * This stub returns a mock event for integration testing.
 */
export async function monitorCoachingStaff(institutionSlug: string): Promise<DetectedCoachEvent[]> {
  // ── STUB ──────────────────────────────────────────────────────────────────
  // In production this would:
  //   const browser = await chromium.launch()
  //   const espnPage = await browser.newPage()
  //   await espnPage.goto(`https://www.espn.com/college-football/team/staff/_/id/${espnId}`)
  //   const staffTable = await espnPage.$$('table[class*="ResponsiveTable"] tr')
  //   ... diff against previous_staff stored in DB ...

  // Mock response for testing the POST route and DB upsert
  const mockEvent: DetectedCoachEvent = {
    institution_id: institutionSlug,
    coach_name: 'Mock Coach',
    sport: 'Football',
    event_type: 'rumor',
    confidence_score: scoreConfidence({
      officialPressRelease: false,
      espnConfirmed: false,
      s247Confirmed: false,
      googleNewsCount: 1,
      isRumor: true,
    }),
    source_urls: [`https://news.google.com/rss/search?q=${institutionSlug}+football+coach`],
    confirmed: false,
    detected_at: new Date().toISOString(),
  }

  return [mockEvent]
}

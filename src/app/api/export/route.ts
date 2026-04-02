import { NextResponse } from 'next/server'
import { SEED_DONOR_EVENTS } from '@/lib/seed-data/donor-events'
import { SEED_COACH_EVENTS } from '@/lib/seed-data/coach-events'
import { SEED_SCORING_DATA, INSTITUTION_IDS, INSTITUTION_META } from '@/lib/seed-data/scoring-seed'
import { calculateAllScores } from '@/lib/scoring'
import newspapers from '@/config/newspapers.json'

export async function GET() {
  const scores = calculateAllScores(INSTITUTION_IDS, SEED_SCORING_DATA)

  const payload = {
    exported_at: new Date().toISOString(),
    institutions: INSTITUTION_IDS.map((id) => ({
      ...INSTITUTION_META[id],
      id,
      scores: scores[id],
    })),
    donor_events: SEED_DONOR_EVENTS,
    coach_events: SEED_COACH_EVENTS,
    scoring_data: SEED_SCORING_DATA,
    newspapers,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="athletiq-export-${Date.now()}.json"`,
    },
  })
}

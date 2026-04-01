import { NextRequest, NextResponse } from 'next/server'
import { monitorCoachingStaff } from '@/scrapers/coach-monitor'
import { createServerSupabaseClient as createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Admin-only — check secret header
  const authHeader = req.headers.get('x-scraper-secret')
  if (authHeader !== process.env.SCRAPER_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { institutionSlug } = await req.json()
  if (!institutionSlug || typeof institutionSlug !== 'string') {
    return NextResponse.json({ error: 'institutionSlug required' }, { status: 400 })
  }

  let events: Awaited<ReturnType<typeof monitorCoachingStaff>>
  try {
    events = await monitorCoachingStaff(institutionSlug)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  if (!events.length) {
    return NextResponse.json({ inserted: 0 })
  }

  const supabase = createClient()

  const { error, count } = await supabase
    .from('coach_events')
    .upsert(
      events.map((e) => ({
        institution_id: e.institution_id,
        coach_name: e.coach_name,
        sport: e.sport,
        event_type: e.event_type,
        confidence_score: e.confidence_score,
        source_urls: e.source_urls,
        confirmed: e.confirmed,
        detected_at: e.detected_at,
      })),
      { onConflict: 'institution_id,coach_name,event_type,detected_at' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: count ?? events.length, slug: institutionSlug })
}

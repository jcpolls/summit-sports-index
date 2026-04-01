import { NextRequest, NextResponse } from 'next/server'
import { scrapeDonorPage } from '@/scrapers/donor-scraper'
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

  let events: Awaited<ReturnType<typeof scrapeDonorPage>>
  try {
    events = await scrapeDonorPage(institutionSlug)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  if (!events.length) {
    return NextResponse.json({ inserted: 0 })
  }

  const supabase = createClient()

  // Upsert: if same institution+donor+gift_date already exists, update amount
  const { error, count } = await supabase
    .from('donor_events')
    .upsert(
      events.map((e) => ({
        institution_id: e.institution_id,
        donor_name: e.donor_name,
        amount_usd: e.amount_usd,
        gift_date: e.gift_date,
        designated_sport: e.designated_sport,
        facility_name: e.facility_name,
        source_url: e.source_url,
      })),
      { onConflict: 'institution_id,donor_name,gift_date' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: count ?? events.length, slug: institutionSlug })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { source = 'ap-poll', sport = 'football' } = await req.json()
  const persist = req.nextUrl.searchParams.get('persist') === 'true'

  // Stub: return mock ranking data
  const mockData = [
    { school_slug: 'michigan', rank: 5, score: 87.5, wins: 10, losses: 2 },
    { school_slug: 'alabama', rank: 3, score: 91.2, wins: 11, losses: 1 },
    { school_slug: 'oregon', rank: 8, score: 82.1, wins: 9, losses: 3 },
    { school_slug: 'duke', rank: 45, score: 42.3, wins: 4, losses: 8 },
    { school_slug: 'kansas', rank: 52, score: 38.7, wins: 3, losses: 9 },
  ].map((d) => ({
    ...d,
    source,
    sport,
    season: '2025-26',
    as_of_date: new Date().toISOString().split('T')[0],
  }))

  if (persist) {
    const supabase = createServerSupabaseClient()
    const { data: schools } = await supabase.from('schools').select('id, slug')
    const schoolMap = new Map((schools || []).map((s) => [s.slug, s.id]))

    const rows = mockData
      .filter((d) => schoolMap.has(d.school_slug))
      .map((d) => ({
        school_id: schoolMap.get(d.school_slug),
        season: d.season,
        sport: d.sport,
        source: d.source,
        rank: d.rank,
        score: d.score,
        wins: d.wins,
        losses: d.losses,
        trend: 'steady',
        trend_delta: 0,
        as_of_date: d.as_of_date,
        is_demo: true,
      }))

    await supabase.from('rankings').insert(rows)
  }

  return NextResponse.json({
    success: true,
    records_updated: mockData.length,
    data: mockData,
    stubbed: true,
  })
}

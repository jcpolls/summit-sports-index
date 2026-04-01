import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { school_slug = 'michigan' } = await req.json()

  const mockData = [
    {
      school_slug,
      event_type: 'chronicle-complaint',
      headline: `Title IX compliance concerns raised at ${school_slug} athletics program`,
      source: 'Chronicle of Higher Education',
      sentiment_score: -0.6,
      severity: 'medium',
      event_date: '2025-11-15',
    },
    {
      school_slug,
      event_type: 'chronicle-complaint',
      headline: `Former staff member files workplace complaint against ${school_slug} AD`,
      source: 'Chronicle of Higher Education',
      sentiment_score: -0.45,
      severity: 'medium',
      event_date: '2025-09-22',
    },
  ]

  return NextResponse.json({
    success: true,
    events_found: mockData.length,
    data: mockData,
    stubbed: true,
  })
}

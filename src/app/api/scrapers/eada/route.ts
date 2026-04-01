import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { year = 2025 } = await req.json()

  const mockData = [
    { school_slug: 'michigan', sport: 'football', total_revenue: 18500000000, total_expenses: 12000000000 },
    { school_slug: 'alabama', sport: 'football', total_revenue: 19000000000, total_expenses: 13000000000 },
    { school_slug: 'oregon', sport: 'football', total_revenue: 9500000000, total_expenses: 8500000000 },
    { school_slug: 'duke', sport: 'basketball-m', total_revenue: 4500000000, total_expenses: 2800000000 },
    { school_slug: 'kansas', sport: 'basketball-m', total_revenue: 4000000000, total_expenses: 2500000000 },
  ].map((d) => ({ ...d, reporting_year: year }))

  return NextResponse.json({
    success: true,
    records_updated: mockData.length,
    data: mockData,
    stubbed: true,
  })
}

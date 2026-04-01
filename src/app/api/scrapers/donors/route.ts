import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { school_slug = 'michigan' } = await req.json()

  const mockData = [
    {
      school_slug,
      first_name: 'Robert',
      last_name: 'Henderson',
      donor_tier: 'platinum',
      lifetime_total: 250000000,
      affiliation: 'alumnus',
      is_board_member: true,
    },
    {
      school_slug,
      first_name: 'Patricia',
      last_name: 'Morrison',
      donor_tier: 'gold',
      lifetime_total: 75000000,
      affiliation: 'parent',
      is_board_member: false,
    },
  ]

  return NextResponse.json({
    success: true,
    donors_found: mockData.length,
    data: mockData,
    stubbed: true,
  })
}

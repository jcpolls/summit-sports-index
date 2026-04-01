import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const DEMO_NARRATIVES: Record<string, string> = {
  michigan: "Michigan's composite score of 60.7 reflects strong academic credentials and equity progress, tempered by a fundraising gap relative to donor-wealthy peers and modest football competitiveness. The program's improving EADA trend and elite APR position it well for long-term growth.",
  alabama: "Alabama leads the Summit Sports Index with a 74.7 composite, driven by the nation's largest football budget, best-in-class EADA compliance, and dominant on-field results across multiple sports. The program's only material vulnerability is limited donor diversification outside the football enterprise.",
  oregon: "Oregon ranks second overall, boosted significantly by Phil Knight-era philanthropy that inflates its financial score to peer-best levels. Competitive scores remain mid-tier as the program adjusts to Big Ten competition, and equity metrics show steady year-over-year improvement.",
  duke: "Duke's composite of 57.9 masks a sharp divergence between its elite academic profile — highest APR in the cohort — and a weak competitive score driven by below-average football performance. The program's watch-status EADA flags in Participation and Coaching warrant near-term remediation.",
  kansas: "Kansas scores lowest in the cohort at 41.0, reflecting at-risk EADA flags in Publicity and Coaching, below-average donor activity, and limited football competitiveness. The men's basketball program's historic excellence is not fully captured by the current weighting structure.",
}

export async function POST(req: NextRequest) {
  const { institutionId, schoolName, rank, scores, demoMode } = await req.json()

  if (demoMode || !process.env.ANTHROPIC_API_KEY) {
    const narrative = DEMO_NARRATIVES[institutionId] ?? `${schoolName} has a composite score of ${scores.composite} in the Summit Sports Index.`
    return NextResponse.json({ narrative })
  }

  const client = new Anthropic()

  const userPrompt = `${schoolName} ranks ${rank} of 5 in the Summit Sports Index with a composite score of ${scores.composite}. Dimension scores: financial=${scores.financial}, equity=${scores.equity}, academic=${scores.academic}, competitive=${scores.competitive}, reputation=${scores.reputation}, survey=${scores.survey}. Write a 2-sentence analyst summary.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 150,
    system: 'You are a terse athletics program analyst. Return 2 sentences only, no markdown, no hedging.',
    messages: [{ role: 'user', content: userPrompt }],
  })

  const narrative = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ narrative })
}

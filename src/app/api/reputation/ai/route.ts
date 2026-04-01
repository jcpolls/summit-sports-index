import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export interface ReputationAnalysis {
  momentum: 'rising' | 'stable' | 'declining'
  momentum_delta: number // -100 to +100
  summary: string
  strengths: string[]
  concerns: string[]
  controversies: string[]
  sentiment_score: number // -100 to +100
  generated_at: string
}

// In-memory 24h cache keyed by institutionSlug
const cache = new Map<string, ReputationAnalysis>()

// Seed data for demo mode
const DEMO_ANALYSES: Record<string, ReputationAnalysis> = {
  michigan: {
    momentum: 'rising',
    momentum_delta: 14,
    summary:
      "Michigan Athletics is experiencing a strong upward trajectory following its CFP national championship run. Fan sentiment is at a multi-year high, donor engagement has accelerated significantly, and the program's academic performance remains a national model. Minor compliance-related scrutiny from the sign-stealing investigation has faded, leaving the program well-positioned heading into the upcoming season.",
    strengths: [
      'CFP national championship run galvanized donor base — YTD giving up 34%',
      'Top-10 AP ranking across football and basketball simultaneously',
      'Highest 4-year APR among Big Ten football programs',
      'New $400M Athletics facilities master plan announced',
    ],
    concerns: [
      'Coaching staff turnover on offensive line following coordinator departure',
      'Revenue gap with SEC peers widening despite strong fundraising',
    ],
    controversies: [
      'NCAA sign-stealing investigation closed with no major sanctions — residual media scrutiny',
    ],
    sentiment_score: 72,
    generated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  alabama: {
    momentum: 'stable',
    momentum_delta: 2,
    summary:
      "Alabama Athletics maintains elite national standing across multiple sports but faces a pivotal transition period following Nick Saban's retirement. New head coach Kalen DeBoer is navigating an influx of transfer portal talent while preserving the program's championship culture. Donor base remains deeply committed, though some long-tenured boosters are adopting a cautious wait-and-see posture.",
    strengths: [
      'Roster talent depth remains best-in-class despite coaching transition',
      'Bryant-Denny Stadium renovation nearing completion — premium revenue uplift expected',
      "Women's gymnastics and softball both ranked No. 1 nationally",
      'SEC brand premium continues to drive sponsorship revenue records',
    ],
    concerns: [
      'Transfer portal attrition higher than in Saban era — 14 departures since January',
      'Fan sentiment slightly subdued entering DeBoer era — cautious optimism rather than confidence',
    ],
    controversies: [],
    sentiment_score: 58,
    generated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  oregon: {
    momentum: 'rising',
    momentum_delta: 22,
    summary:
      "Oregon Athletics is riding exceptional momentum into its first full Big Ten season. Phil Knight's continued investment has elevated facilities to national elite status, and the football program's offensive identity is generating significant national media attention. The move to the Big Ten has materially expanded Oregon's recruiting footprint and national brand visibility.",
    strengths: [
      'Phil Knight family foundation committed additional $50M in FY2024',
      'Football recruiting class ranked No. 3 nationally by 247Sports',
      "Big Ten entry expanding TV exposure and national recruiting reach",
      'State-of-the-art Hatfield-Dowlin Complex ranked No. 1 in FacilitiesRank index',
    ],
    concerns: [
      "First Big Ten season creates scheduling uncertainty — tougher road slate than Pac-12",
      'Basketball program lagging football in national perception gap',
    ],
    controversies: [],
    sentiment_score: 81,
    generated_at: new Date(Date.now() - 1800000).toISOString(),
  },
  duke: {
    momentum: 'stable',
    momentum_delta: -4,
    summary:
      "Duke Athletics occupies a unique position as an academically elite brand with a globally recognized basketball program but a football program that has historically underperformed its peer set. Jon Scheyer is building continuity in basketball while Cooper DeJean's departure to the NFL highlighted football's inability to retain elite talent. The program's overall reputation remains strong but is heavily dependent on basketball outcomes.",
    strengths: [
      'Cameron Indoor Stadium remains the most iconic venue in college basketball',
      'Basketball brand generates premium sponsorship rates unmatched outside the Blue Bloods',
      'Academic reputation provides recruiting differentiation in non-revenue sports',
    ],
    concerns: [
      'Football program ranked 8th in ACC — significant gap to conference leaders',
      'Dependence on basketball single-sport narrative limits overall athletic brand breadth',
      'NIL collective lagging ACC peers in total committed capital',
    ],
    controversies: [],
    sentiment_score: 54,
    generated_at: new Date(Date.now() - 5400000).toISOString(),
  },
  kansas: {
    momentum: 'declining',
    momentum_delta: -11,
    summary:
      "Kansas Athletics faces a challenging moment as NCAA investigation findings and football's continued struggles weigh on the program's national reputation. Bill Self's basketball program retains elite brand equity despite sanctions, but the broader athletic department is navigating significant headwinds. Donor fatigue is emerging as a concern, with mid-tier giving down 18% year-over-year despite a strong basketball season.",
    strengths: [
      'Bill Self basketball program still drawing top-10 recruiting classes',
      'Allen Fieldhouse consistently rated the top atmosphere in college basketball',
      "Women's volleyball had breakout season — Sweet 16 appearance",
    ],
    concerns: [
      'NCAA Level I violations finding puts program under enhanced compliance monitoring',
      'Football program ranked last quartile in Big 12 for 4th consecutive season',
      'Donor fatigue emerging — mid-tier ($1K–$25K) giving down 18% YoY',
    ],
    controversies: [
      'NCAA investigation findings released Q3 2024 — Level I violations in basketball recruiting',
      'Head football coach buyout language drew criticism from faculty senate',
    ],
    sentiment_score: 31,
    generated_at: new Date(Date.now() - 10800000).toISOString(),
  },
}

export async function POST(req: NextRequest) {
  const { institutionSlug, institutionName } = await req.json()

  if (!institutionSlug || typeof institutionSlug !== 'string') {
    return NextResponse.json({ error: 'institutionSlug required' }, { status: 400 })
  }

  // Check in-memory cache (24h)
  const cached = cache.get(institutionSlug)
  if (cached) {
    const age = Date.now() - new Date(cached.generated_at).getTime()
    if (age < 86400000) {
      return NextResponse.json({ ...cached, cached: true })
    }
  }

  // Demo mode or no API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || req.nextUrl.searchParams.get('demo') === 'true') {
    const demo = DEMO_ANALYSES[institutionSlug] ?? DEMO_ANALYSES.michigan
    cache.set(institutionSlug, demo)
    return NextResponse.json({ ...demo, cached: false })
  }

  // Live Claude call
  const client = new Anthropic({ apiKey })

  const systemPrompt = `You are an elite college athletics intelligence analyst. Analyze the reputational health of an athletics program and return ONLY a JSON object with this exact structure:
{
  "momentum": "rising" | "stable" | "declining",
  "momentum_delta": <integer -100 to +100, positive = improving>,
  "summary": "<2-3 sentence executive summary, no markdown>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "concerns": ["<concern 1>", "<concern 2>"],
  "controversies": ["<controversy if any>"],
  "sentiment_score": <integer -100 to +100>
}
No markdown, no explanation, only valid JSON.`

  const userPrompt = `Analyze the current reputational health of ${institutionName ?? institutionSlug} Athletics. Consider recent competitive results, coaching stability, NIL landscape, facilities investment, donor engagement, compliance status, and national media coverage. Return the JSON analysis.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed: Omit<ReputationAnalysis, 'generated_at'> = JSON.parse(text)
    const analysis: ReputationAnalysis = {
      ...parsed,
      generated_at: new Date().toISOString(),
    }

    cache.set(institutionSlug, analysis)
    return NextResponse.json({ ...analysis, cached: false })
  } catch {
    // Fall back to demo on parse/API error
    const demo = DEMO_ANALYSES[institutionSlug] ?? DEMO_ANALYSES.michigan
    return NextResponse.json({ ...demo, cached: false, fallback: true })
  }
}

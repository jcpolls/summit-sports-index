import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { schoolId } = await req.json()
    if (!schoolId) {
      return NextResponse.json({ error: 'schoolId is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const [schoolRes, eventsRes, rankingsRes, surveyRes] = await Promise.all([
      supabase.from('schools').select('*').eq('id', schoolId).single(),
      supabase
        .from('reputation_events')
        .select('*')
        .eq('school_id', schoolId)
        .order('event_date', { ascending: false })
        .limit(20),
      supabase
        .from('rankings')
        .select('*')
        .eq('school_id', schoolId)
        .order('as_of_date', { ascending: false })
        .limit(10),
      supabase
        .from('survey_results')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false })
        .limit(8),
    ])

    const school = schoolRes.data
    const events = eventsRes.data || []
    const rankings = rankingsRes.data || []
    const surveys = surveyRes.data || []

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Return a stub narrative when no API key is configured
      const stubNarrative = `${school.name} has experienced a mixed reputational trajectory over the recent period. ` +
        `With ${events.length} tracked events and current rankings reflecting ${rankings.length > 0 ? 'active competition' : 'off-season status'}, ` +
        `the overall sentiment trend suggests continued monitoring is warranted. ` +
        `Survey data indicates ${surveys.length > 0 ? 'moderate stakeholder engagement' : 'pending survey collection'}. ` +
        `\n\nThis is a demo narrative. Connect an Anthropic API key for AI-generated analysis.`
      return NextResponse.json({ narrative: stubNarrative, stubbed: true })
    }

    const client = new Anthropic({ apiKey })

    const prompt = `You are a college athletics intelligence analyst. Based on the following data for ${school.name}, write a 2-3 paragraph narrative summary of their recent reputational trajectory. Be specific, cite data points, and note any concerning trends or opportunities.

REPUTATION EVENTS (most recent first):
${JSON.stringify(events.map(e => ({ type: e.event_type, headline: e.headline, sentiment: e.sentiment_score, severity: e.severity, date: e.event_date })), null, 2)}

CURRENT RANKINGS:
${JSON.stringify(rankings.map(r => ({ sport: r.sport, source: r.source, rank: r.rank, score: r.score, trend: r.trend })), null, 2)}

SURVEY INDICATORS:
${JSON.stringify(surveys.map(s => ({ category: s.category, score: s.score, benchmark: s.benchmark_avg, trend: s.trend_vs_prior })), null, 2)}

Write in a professional, analytical tone. Highlight key risks and opportunities. Keep it to 2-3 concise paragraphs.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const narrative = message.content[0].type === 'text' ? message.content[0].text : ''

    // Store narrative on the most recent reputation event
    if (events.length > 0) {
      await supabase
        .from('reputation_events')
        .update({ ai_narrative: narrative })
        .eq('id', events[0].id)
    }

    return NextResponse.json({ narrative, stubbed: false })
  } catch (error) {
    console.error('Narrative generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate narrative' },
      { status: 500 }
    )
  }
}

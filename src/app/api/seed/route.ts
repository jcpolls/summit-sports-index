import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const SCHOOL_IDS = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
]

const SPORTS = ['football', 'basketball-m', 'basketball-w']

const HEADLINES = [
  'Program announces new NIL collective partnership',
  'Head coach addresses media about recruitment strategy',
  'Athletic department reports record ticket sales',
  'Student-athlete academic achievement recognized',
  'Facility upgrade plans unveiled for upcoming season',
  'Conference realignment impacts competitive landscape',
  'Booster club reaches membership milestone',
  'Transfer portal activity shapes roster outlook',
]

const EVENT_TYPES = ['media-mention', 'social-sentiment', 'media-mention', 'social-sentiment']
const SEVERITIES = ['low', 'low', 'medium', 'low', 'medium']
const ALERT_TYPES = ['ranking-change', 'donation-spike', 'reputation-drop', 'compliance-flag']

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()
    const schoolId = randomPick(SCHOOL_IDS)
    const eventType = randomPick(['ranking', 'reputation', 'donation', 'alert'] as const)
    const today = new Date().toISOString().split('T')[0]

    switch (eventType) {
      case 'ranking': {
        const sport = randomPick(SPORTS)
        const rank = randomBetween(1, 25)
        const delta = randomBetween(-3, 3)
        await supabase.from('rankings').insert({
          school_id: schoolId,
          season: '2025-26',
          sport,
          source: 'composite',
          rank,
          score: parseFloat((100 - rank * 2.5 + Math.random() * 10).toFixed(4)),
          wins: randomBetween(5, 15),
          losses: randomBetween(0, 8),
          trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'steady',
          trend_delta: delta,
          as_of_date: today,
          is_demo: true,
        })
        break
      }
      case 'reputation': {
        const sentiment = parseFloat((Math.random() * 2 - 1).toFixed(2))
        await supabase.from('reputation_events').insert({
          school_id: schoolId,
          event_type: randomPick(EVENT_TYPES),
          headline: randomPick(HEADLINES),
          source: randomPick(['ESPN', 'Stadium', 'Social Media', 'Local News']),
          sentiment_score: sentiment,
          severity: randomPick(SEVERITIES),
          event_date: today,
          is_demo: true,
        })
        break
      }
      case 'donation': {
        const amount = randomBetween(500000, 50000000) // $5K - $500K in cents
        await supabase.from('donations').insert({
          school_id: schoolId,
          donor_id: null,
          amount,
          designation: randomPick(['athletics-general', 'football', 'basketball', 'facilities', 'scholarships']),
          gift_date: today,
          fiscal_year: 2026,
          payment_type: randomPick(['cash', 'pledge']),
          is_demo: true,
        })
        break
      }
      case 'alert': {
        const severity = randomPick(['info', 'warning', 'critical'] as const)
        const alertType = randomPick(ALERT_TYPES)
        await supabase.from('alerts').insert({
          school_id: schoolId,
          alert_type: alertType,
          severity,
          title: `${alertType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Detected`,
          message: `Automated alert: A ${alertType.replace('-', ' ')} event has been detected for this school. Review the data for details.`,
          is_read: false,
          is_emailed: false,
        })
        break
      }
    }

    return NextResponse.json({ success: true, eventType, schoolId })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed event' }, { status: 500 })
  }
}

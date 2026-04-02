import { NextRequest, NextResponse } from 'next/server'
import type { CoachEventType } from '@/types/database'

interface CoachEventPayload {
  id: string
  institution_id: string
  coach_name: string
  sport: string
  event_type: CoachEventType
  confidence_score: number
  source_urls: string[] | null
  confirmed: boolean
  detected_at: string
}

interface AlertSubscription {
  id: string
  email: string
  institution_ids: string[] | null
  sports: string[] | null
  event_types: string[] | null
  active: boolean
  last_notified: string | null
}

const EVENT_TYPE_LABELS: Record<CoachEventType, string> = {
  hire: 'Hire',
  departure: 'Departure',
  extension: 'Contract Extension',
  suspension: 'Suspension',
  investigation: 'Investigation',
  rumor: 'Rumor',
}

function buildEmailHtml(event: CoachEventPayload, institutionName: string): string {
  const confidence = Math.round(event.confidence_score * 100)
  const confidenceColor = confidence >= 80 ? '#22c55e' : confidence >= 60 ? '#f59e0b' : '#ef4444'
  const eventLabel = EVENT_TYPE_LABELS[event.event_type] ?? event.event_type

  const sourceLinks = (event.source_urls ?? [])
    .map(
      (url) =>
        `<a href="${url}" style="color:#3b82f6;text-decoration:none;">${url.replace(/^https?:\/\//, '')}</a>`
    )
    .join('<br />')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 24px;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
    <!-- Header -->
    <div style="background: #111827; padding: 20px 24px;">
      <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">AthletIQ</p>
      <h1 style="margin: 6px 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">⚡ Coach Alert</h1>
    </div>

    <!-- Body -->
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; width: 40%; color: #6b7280; font-size: 13px;">Coach</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600;">${event.coach_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">School</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${institutionName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Sport</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${event.sport}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Event</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600;">${eventLabel}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Confidence</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px;">
            <span style="color: ${confidenceColor}; font-weight: 700; font-family: monospace;">${confidence}%</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Detected</td>
          <td style="padding: 8px 0; font-size: 13px;">${new Date(event.detected_at).toLocaleString()}</td>
        </tr>
      </table>

      ${
        sourceLinks
          ? `<div style="margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Sources</p>
        <div style="font-size: 12px; line-height: 1.8;">${sourceLinks}</div>
      </div>`
          : ''
      }

      <!-- CTA button -->
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/alerts"
         style="display: inline-block; background: #111827; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
        View in Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 11px; color: #9ca3af;">
        You're receiving this because you have an active alert subscription in AthletIQ.
        <br />To manage your alerts, visit the Alerts tab in the dashboard.
      </p>
    </div>
  </div>
</body>
</html>`
}

// In-memory rate limit: track last email time per subscription id
const lastNotifiedMap = new Map<string, number>()
const RATE_LIMIT_MS = 60 * 60 * 1000 // 1 hour

export async function POST(req: NextRequest) {
  // Supabase webhook secret validation
  const webhookSecret = req.headers.get('x-webhook-secret')
  if (webhookSecret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // Supabase sends { type: 'INSERT', record: {...}, ... }
  if (body.type !== 'INSERT') {
    return NextResponse.json({ skipped: true, reason: 'not an insert' })
  }

  const event: CoachEventPayload = body.record

  // Only notify for high-confidence events
  if (event.confidence_score < 0.8) {
    return NextResponse.json({ skipped: true, reason: 'low confidence' })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.log('[alerts/notify] RESEND_API_KEY not set — logging email instead')
    console.log('[MOCK EMAIL]', {
      subject: `⚡ Coach Alert: ${EVENT_TYPE_LABELS[event.event_type]} — ${event.coach_name} at ${event.institution_id}`,
      event,
    })
    return NextResponse.json({ sent: 0, mock: true })
  }

  // In production: query Supabase for active alert subscriptions matching this event
  // const supabase = createClient()
  // const { data: subscriptions } = await supabase
  //   .from('alerts')
  //   .select('*')
  //   .eq('active', true)
  //   .or(`institution_ids.cs.{${event.institution_id}},institution_ids.is.null`)

  // For now, stub with empty subscription list (no real DB in demo mode)
  const subscriptions: AlertSubscription[] = []

  const matchingSubscriptions = subscriptions.filter((sub) => {
    if (!sub.active) return false
    if (sub.institution_ids && !sub.institution_ids.includes(event.institution_id)) return false
    if (sub.sports && !sub.sports.includes(event.sport) && !sub.sports.includes('All Sports')) return false
    if (sub.event_types && !sub.event_types.includes(event.event_type)) return false
    return true
  })

  let sent = 0
  const institutionName = event.institution_id.charAt(0).toUpperCase() + event.institution_id.slice(1)

  for (const sub of matchingSubscriptions) {
    if (!sub.email) continue

    // Rate limit: max 1 email per subscription per 60 minutes
    const lastSent = lastNotifiedMap.get(sub.id) ?? 0
    if (Date.now() - lastSent < RATE_LIMIT_MS) continue

    const html = buildEmailHtml(event, institutionName)
    const subject = `⚡ Coach Alert: ${EVENT_TYPE_LABELS[event.event_type]} — ${event.coach_name} at ${institutionName}`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AthletIQ <alerts@athletiq.io>',
        to: [sub.email],
        subject,
        html,
      }),
    })

    if (res.ok) {
      lastNotifiedMap.set(sub.id, Date.now())
      sent++
    }
  }

  return NextResponse.json({ sent, total: matchingSubscriptions.length })
}

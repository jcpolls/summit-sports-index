import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { alertId, recipientEmail = 'demo@summitsportsindex.com' } = await req.json()

    if (!alertId) {
      return NextResponse.json({ error: 'alertId is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data: alert } = await supabase
      .from('alerts')
      .select('*, school:schools(*)')
      .eq('id', alertId)
      .single()

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    const emailPayload = {
      from: 'alerts@summitsportsindex.com',
      to: recipientEmail,
      subject: `[SSI Alert] ${alert.severity.toUpperCase()}: ${alert.title}`,
      html: `
        <h2>${alert.title}</h2>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>School:</strong> ${alert.school?.name || 'Unknown'}</p>
        <p>${alert.message}</p>
        <hr />
        <p><em>Summit Sports Index - Automated Alert</em></p>
      `,
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('Email alert (stubbed):', JSON.stringify(emailPayload, null, 2))
      await supabase.from('alerts').update({ is_emailed: true }).eq('id', alertId)
      return NextResponse.json({ success: true, stubbed: true, emailPayload })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send(emailPayload)
    await supabase.from('alerts').update({ is_emailed: true }).eq('id', alertId)

    return NextResponse.json({ success: true, stubbed: false })
  } catch (error) {
    console.error('Alert email error:', error)
    return NextResponse.json({ error: 'Failed to send alert email' }, { status: 500 })
  }
}

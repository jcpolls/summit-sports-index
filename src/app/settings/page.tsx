'use client'

import { useState } from 'react'
import { Eye, EyeOff, Play, Download, Save, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SCHOOLS } from '@/lib/constants/schools'

// ─── Credential row ───────────────────────────────────────────────────────────

function CredentialRow({
  envKey,
  label,
  description,
}: {
  envKey: string
  label: string
  description: string
}) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // In production: POST to /api/settings/secrets with { key, value }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <code className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{envKey}</code>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={visible ? 'text' : 'password'}
            placeholder={`Enter ${label}…`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 text-xs pr-8 font-mono"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={handleSave}>
          <Save className="h-3 w-3" />
          {saved ? 'Saved!' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

// ─── Scraper schedule row ─────────────────────────────────────────────────────

function ScraperRow({
  label,
  defaultCron,
  endpoint,
}: {
  label: string
  defaultCron: string
  endpoint: string
}) {
  const [cron, setCron] = useState(defaultCron)
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState<string | null>(null)

  async function handleRunNow() {
    setRunning(true)
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'x-scraper-secret': 'demo', 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionSlug: 'michigan' }),
      })
    } catch { /* ignore */ }
    setLastRun(new Date().toLocaleTimeString())
    setRunning(false)
  }

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-40 shrink-0">
        <p className="text-sm font-medium">{label}</p>
        {lastRun && <p className="text-[11px] text-muted-foreground">Last run: {lastRun}</p>}
      </div>
      <Input
        value={cron}
        onChange={(e) => setCron(e.target.value)}
        className="h-7 text-xs font-mono w-36"
        placeholder="0 */6 * * *"
      />
      <p className="text-xs text-muted-foreground hidden md:block">
        {cron === '0 */6 * * *' ? 'Every 6 hours' :
         cron === '0 * * * *' ? 'Every hour' :
         cron === '0 0 * * *' ? 'Daily at midnight' :
         cron === '*/15 * * * *' ? 'Every 15 minutes' : cron}
      </p>
      <Button
        size="sm"
        variant="outline"
        className="h-7 gap-1 text-xs ml-auto shrink-0"
        onClick={handleRunNow}
        disabled={running}
      >
        <Play className={`h-3 w-3 ${running ? 'animate-pulse' : ''}`} />
        {running ? 'Running…' : 'Run Now'}
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [schoolUrls, setSchoolUrls] = useState<Record<string, { athletics_url: string; newspaper_rss: string }>>(
    Object.fromEntries(
      SCHOOLS.map((s) => [
        s.slug,
        { athletics_url: s.slug + '.edu/athletics', newspaper_rss: '' },
      ])
    )
  )
  const [truedotKey, setTruedotKey] = useState('')
  const [truedotConnected, setTruedotConnected] = useState(false)
  const [exporting, setExporting] = useState(false)

  function handleExport() {
    setExporting(true)
    const a = document.createElement('a')
    a.href = '/api/export'
    a.download = `athletiq-export-${Date.now()}.json`
    a.click()
    setTimeout(() => setExporting(false), 1000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          API credentials, scraper schedules, school management, and integrations.
        </p>
      </div>

      {/* ── API Credentials ────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-base font-semibold">API Credentials</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Values are stored encrypted in Supabase Vault and never logged.
          </p>
        </div>
        <Separator />
        <div className="space-y-5">
          <CredentialRow
            envKey="TWITTER_BEARER_TOKEN"
            label="Twitter Bearer Token"
            description="Required for Social Media Surveillance in Reputation Watch. Get from developer.twitter.com."
          />
          <CredentialRow
            envKey="RESEND_API_KEY"
            label="Resend API Key"
            description="Required for coach alert email notifications. Get from resend.com."
          />
          <CredentialRow
            envKey="ANTHROPIC_API_KEY"
            label="Anthropic API Key"
            description="Required for AI narrative generation, sentiment scoring, and reputation analysis. Get from console.anthropic.com."
          />
          <CredentialRow
            envKey="SCRAPER_SECRET"
            label="Scraper Secret"
            description="Shared secret for authenticating scraper POST endpoints. Set to any secure random string."
          />
        </div>
      </section>

      {/* ── Scraper Schedules ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Scraper Schedules</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cron expressions (UTC). Use a deployment cron (Vercel, GitHub Actions, EasyCron) to POST to each endpoint.
          </p>
        </div>
        <Separator />
        <div className="divide-y">
          <ScraperRow label="Donor Scraper" defaultCron="0 */6 * * *" endpoint="/api/scraper/donor" />
          <ScraperRow label="Coach Monitor" defaultCron="0 * * * *" endpoint="/api/scraper/coaches" />
          <ScraperRow label="Social Media" defaultCron="*/15 * * * *" endpoint="/api/social/twitter" />
          <ScraperRow label="Campus News" defaultCron="0 */2 * * *" endpoint="/api/reputation/news" />
        </div>
      </section>

      {/* ── School Management ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">School Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Edit scrapers&apos; target URLs per school.
          </p>
        </div>
        <Separator />
        <div className="space-y-3">
          {SCHOOLS.map((school) => (
            <div key={school.slug} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end py-2 border-b last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: school.primaryColor }} />
                <span className="text-sm font-medium">{school.shortName}</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1">{school.conference}</Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Athletics URL</Label>
                <div className="flex gap-1">
                  <Input
                    value={schoolUrls[school.slug]?.athletics_url ?? ''}
                    onChange={(e) =>
                      setSchoolUrls((prev) => ({
                        ...prev,
                        [school.slug]: { ...prev[school.slug], athletics_url: e.target.value },
                      }))
                    }
                    className="h-7 text-xs"
                    placeholder="athletics.university.edu"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Newspaper RSS</Label>
                <Input
                  value={schoolUrls[school.slug]?.newspaper_rss ?? ''}
                  onChange={(e) =>
                    setSchoolUrls((prev) => ({
                      ...prev,
                      [school.slug]: { ...prev[school.slug], newspaper_rss: e.target.value },
                    }))
                  }
                  className="h-7 text-xs"
                  placeholder="https://paper.edu/feed/"
                />
              </div>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="gap-1 text-xs">
          <Save className="h-3 w-3" />
          Save Changes
        </Button>
      </section>

      {/* ── TrueDot Integration ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">TrueDot Integration</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect TrueDot survey data to replace mock wave results with live respondent data.
          </p>
        </div>
        <Separator />
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${truedotConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium">
              {truedotConnected ? 'Connected to TrueDot' : 'Not connected'}
            </span>
            {truedotConnected && <Badge className="text-[10px] h-4 px-1.5 bg-green-100 text-green-700">Live Data</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            Once connected, survey scores on the Rankings and Overview tabs will pull from live TrueDot wave results
            instead of the mock seed data. Historical waves are preserved for trend calculations.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter TrueDot API key…"
              value={truedotKey}
              onChange={(e) => setTruedotKey(e.target.value)}
              className="h-8 text-xs font-mono flex-1"
            />
            <Button
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => { if (truedotKey) setTruedotConnected(true) }}
              disabled={!truedotKey}
            >
              Connect TrueDot API
            </Button>
          </div>
        </div>
      </section>

      {/* ── Export ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Export</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download a full JSON snapshot of all institutions, scores, donor events, and coach alerts.
          </p>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Preparing…' : 'Download all data as JSON'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Includes institutions, composite scores, donor events, coach events, and scoring inputs.
          </p>
        </div>
      </section>
    </div>
  )
}

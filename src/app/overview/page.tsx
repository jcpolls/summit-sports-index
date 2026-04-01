'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, BellRing } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { useRole, useSelectedSchool, useDemoMode } from '@/lib/contexts/app-contexts'
import { calculateAllScores } from '@/lib/scoring'
import { SEED_SCORING_DATA, INSTITUTION_IDS, INSTITUTION_META } from '@/lib/seed-data/scoring-seed'
import { SEED_DONOR_EVENTS, formatAmount, sportColor } from '@/lib/seed-data/donor-events'
import { SEED_COACH_EVENTS } from '@/lib/seed-data/coach-events'
import type { CoachEventType } from '@/types/database'

// ─── Static derived data ──────────────────────────────────────────────────────

const ALL_SCORES = calculateAllScores(INSTITUTION_IDS, SEED_SCORING_DATA)

const RANKED_IDS = [...INSTITUTION_IDS].sort(
  (a, b) => ALL_SCORES[b].composite - ALL_SCORES[a].composite
)

// EADA at-risk area counts per school (derived from overall compliance scores in seed)
const TITLE_IX_RISK: Record<string, number> = {
  michigan: 1,
  alabama: 0,
  oregon: 2,
  duke: 3,
  kansas: 5,
}

// Prior-year 2024 composite scores for trend calculation (±2-4 from current)
const PRIOR_COMPOSITE: Record<string, number> = {
  michigan: 64.2,
  alabama: 70.1,
  oregon: 65.8,
  duke: 60.3,
  kansas: 51.4,
}

function ytdDonations(slug: string, year: number): number {
  return SEED_DONOR_EVENTS.filter(
    (e) => e.institution_id === slug && e.gift_date.startsWith(String(year))
  ).reduce((s, e) => s + e.amount_usd, 0)
}

function compositeSparkline(slug: string): { v: number }[] {
  const base = ALL_SCORES[slug]?.composite ?? 60
  return Array.from({ length: 30 }, (_, i) => ({
    v: Math.round((base - 4 + (i / 29) * 4 + Math.sin(i * 0.7) * 1.5) * 10) / 10,
  }))
}

// ─── KPI Tile ─────────────────────────────────────────────────────────────────

function KpiTile({
  label,
  value,
  sub,
  subColor,
  sparkData,
  sparkColor,
  highlight,
  icon,
}: {
  label: string
  value: string
  sub?: string
  subColor?: string
  sparkData?: { v: number }[]
  sparkColor?: string
  highlight?: 'red' | 'amber' | 'green'
  icon?: React.ReactNode
}) {
  const highlightClass =
    highlight === 'red'
      ? 'border-red-200 bg-red-50/50 dark:bg-red-950/10'
      : highlight === 'amber'
      ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/10'
      : ''

  return (
    <div className={`rounded-xl border p-4 space-y-2 ${highlightClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub && (
        <p className={`text-xs font-medium ${subColor ?? 'text-muted-foreground'}`}>{sub}</p>
      )}
      {sparkData && sparkData.length > 0 && (
        <div className="h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor ?? '#6b7280'}
                dot={false}
                strokeWidth={1.5}
              />
              <Tooltip
                formatter={(v: unknown) => [String(v), '']}
                contentStyle={{ fontSize: 11, padding: '2px 6px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ─── Mini Donor Ticker ────────────────────────────────────────────────────────

interface TickerEntry {
  id: string
  donor_name: string
  amount_usd: number
  designated_sport: string | null
  ts: Date
  visible: boolean
}

let miniDemoIdx = 0

function MiniDonorTicker({ slug }: { slug: string }) {
  const { role } = useRole()
  const { demoMode } = useDemoMode()
  const [entries, setEntries] = useState<TickerEntry[]>([])
  const isResearcher = role === 'researcher'
  const pool = SEED_DONOR_EVENTS.filter((e) => e.institution_id === slug)

  function pushEntry(e: { donor_name: string; amount_usd: number; designated_sport: string | null }) {
    const entry: TickerEntry = {
      id: `mini-${Date.now()}-${Math.random()}`,
      donor_name: isResearcher ? 'Anonymous Donor' : e.donor_name,
      amount_usd: e.amount_usd,
      designated_sport: e.designated_sport,
      ts: new Date(),
      visible: false,
    }
    setEntries((prev) => [entry, ...prev].slice(0, 5))
    setTimeout(() => {
      setEntries((prev) => prev.map((x) => (x.id === entry.id ? { ...x, visible: true } : x)))
    }, 50)
  }

  useEffect(() => {
    // Prime with last 5 seed entries (sorted by date desc)
    const recent = [...pool]
      .sort((a, b) => new Date(b.gift_date).getTime() - new Date(a.gift_date).getTime())
      .slice(0, 5)
    recent.reverse().forEach((e, i) => {
      setTimeout(() => pushEntry(e), i * 80)
    })
    miniDemoIdx = 5

    if (!demoMode) return
    const interval = setInterval(() => {
      if (!pool.length) return
      const pick = pool[miniDemoIdx % pool.length]
      miniDemoIdx++
      pushEntry(pick)
    }, 8000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, demoMode, isResearcher])

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 h-full">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Gifts</p>
        {demoMode ? (
          <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600">DEMO</Badge>
        ) : (
          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            LIVE
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="transition-all duration-500 ease-out flex items-center justify-between gap-2"
            style={{ opacity: entry.visible ? 1 : 0, transform: entry.visible ? 'translateY(0)' : 'translateY(-8px)' }}
          >
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{entry.donor_name}</p>
              {entry.designated_sport && (
                <span
                  className="text-[10px] text-white px-1 py-0.5 rounded-full inline-block mt-0.5"
                  style={{ backgroundColor: sportColor(entry.designated_sport) }}
                >
                  {entry.designated_sport}
                </span>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold tabular-nums">{formatAmount(entry.amount_usd)}</p>
              <p className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(entry.ts, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Mini Reputation ──────────────────────────────────────────────────────────

const SCHOOL_KEYWORDS: Record<string, string[]> = {
  michigan: ['football', 'wolverines', 'big ten', 'recruiting', 'cfp', 'donations'],
  alabama: ['crimson tide', 'deboer', 'sec', 'transfer portal', 'gymnastics', 'fan base'],
  oregon: ['ducks', 'phil knight', 'big ten', 'lanning', 'facilities', 'recruiting'],
  duke: ['basketball', 'scheyer', 'cameron', 'acc', 'football', 'academics'],
  kansas: ['bill self', 'jayhawks', 'ncaa', 'big 12', 'fieldhouse', 'compliance'],
}

function MiniSentimentGauge({ score }: { score: number }) {
  const clamped = Math.max(-100, Math.min(100, score))
  const angleRad = (((clamped + 100) / 200) * 180 - 90) * (Math.PI / 180)
  const cx = 60
  const cy = 52
  const r = 42
  const nx = cx + r * Math.sin(angleRad)
  const ny = cy - r * Math.cos(angleRad)
  const color = clamped >= 20 ? '#22c55e' : clamped <= -20 ? '#ef4444' : '#f59e0b'
  return (
    <svg viewBox="0 0 120 70" className="w-28">
      <path d="M 10 52 A 50 50 0 0 1 110 52" fill="none" stroke="#e5e7eb" strokeWidth="9" strokeLinecap="round" />
      <path
        d="M 10 52 A 50 50 0 0 1 110 52"
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${((clamped + 100) / 200) * 157} 157`}
      />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#374151" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3" fill="#374151" />
      <text x={cx} y={cy + 14} fontSize="11" fontWeight="bold" fill={color} textAnchor="middle">
        {clamped > 0 ? '+' : ''}{clamped}
      </text>
    </svg>
  )
}

function MiniReputation({ slug }: { slug: string }) {
  const rep = ALL_SCORES[slug]?.reputation ?? 50
  const sentScore = Math.round(rep * 2 - 100) // map 0–100 → -100–+100

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 h-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reputation Pulse</p>
      <div className="flex items-center gap-4">
        <MiniSentimentGauge score={sentScore} />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Sentiment score</p>
          <p className="text-lg font-bold">{Math.round(rep)} / 100</p>
        </div>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground mb-1.5">Trending keywords</p>
        <div className="flex flex-wrap gap-1">
          {(SCHOOL_KEYWORDS[slug] ?? []).slice(0, 5).map((kw) => (
            <span key={kw} className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[11px]">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Mini Alerts ──────────────────────────────────────────────────────────────

const EVENT_BADGES: Record<CoachEventType, { label: string; cls: string }> = {
  hire: { label: 'HIRE', cls: 'bg-green-100 text-green-800 border-green-200' },
  departure: { label: 'DEPARTURE', cls: 'bg-red-100 text-red-800 border-red-200' },
  extension: { label: 'EXTENSION', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  rumor: { label: 'RUMOR', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  suspension: { label: 'SUSPENSION', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  investigation: { label: 'INVESTIGATION', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
}

function MiniAlerts({ slug }: { slug: string }) {
  const events = SEED_COACH_EVENTS.filter((e) => e.institution_id === slug)
    .sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime())
    .slice(0, 3)

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 h-full">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Coach Alerts</p>
        <BellRing className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">No recent alerts</p>
      ) : (
        <div className="space-y-2">
          {events.map((e) => {
            const cfg = EVENT_BADGES[e.event_type] ?? EVENT_BADGES.rumor
            let ago = ''
            try { ago = formatDistanceToNow(new Date(e.detected_at), { addSuffix: true }) } catch { ago = '' }
            return (
              <div key={e.id} className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[10px] h-5 px-1.5 shrink-0 ${cfg.cls}`}>
                  {cfg.label}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{e.coach_name}</p>
                  <p className="text-[10px] text-muted-foreground">{e.sport} · {ago}</p>
                </div>
                {!e.confirmed && (
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" title="Unconfirmed" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Rankings Spotlight ───────────────────────────────────────────────────────

const RADAR_AXES = [
  { key: 'financial', label: 'Financial' },
  { key: 'equity', label: 'Equity' },
  { key: 'academic', label: 'Academic' },
  { key: 'competitive', label: 'Competitive' },
  { key: 'reputation', label: 'Reputation' },
  { key: 'survey', label: 'Survey' },
]

function RankingsSpotlight({ slug }: { slug: string }) {
  const meta = INSTITUTION_META[slug]
  const scores = ALL_SCORES[slug]
  if (!scores || !meta) return null

  const radarData = RADAR_AXES.map((ax) => ({
    axis: ax.label,
    value: Math.round(scores[ax.key as keyof typeof scores] as number),
  }))

  const rank = RANKED_IDS.indexOf(slug) + 1

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{meta.shortName} — Rankings Spotlight</h3>
          <p className="text-xs text-muted-foreground">{meta.conference} · Rank #{rank} of {INSTITUTION_IDS.length}</p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-white text-sm font-bold"
          style={{ backgroundColor: meta.primaryColor }}
        >
          {scores.composite.toFixed(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Score dimensions */}
        <div className="space-y-2">
          {RADAR_AXES.map((ax) => {
            const val = Math.round(scores[ax.key as keyof typeof scores] as number)
            const color = val >= 70 ? 'bg-green-500' : val >= 50 ? 'bg-amber-400' : 'bg-red-400'
            return (
              <div key={ax.key} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 shrink-0">{ax.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all`}
                    style={{ width: `${val}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold w-8 text-right">{val}</span>
              </div>
            )
          })}
        </div>

        {/* Radar chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
              <Radar
                dataKey="value"
                stroke={meta.primaryColor}
                fill={meta.primaryColor}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peer comparison row */}
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
        {RANKED_IDS.map((id, i) => {
          const m = INSTITUTION_META[id]
          const s = ALL_SCORES[id]
          const isSelected = id === slug
          return (
            <div
              key={id}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                isSelected ? 'ring-2 ring-offset-1 opacity-100' : 'opacity-60'
              }`}
              style={isSelected ? { outline: `2px solid ${m.primaryColor}` } : undefined}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: m.primaryColor }}
              />
              <span className="font-medium">{m.shortName}</span>
              <span className="font-mono text-muted-foreground">#{i + 1}</span>
              <span
                className="font-bold font-mono"
                style={{ color: isSelected ? m.primaryColor : undefined }}
              >
                {s.composite.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { role } = useRole()
  const { selectedSchool } = useSelectedSchool()
  const slug = selectedSchool === 'all' ? 'michigan' : selectedSchool

  const meta = INSTITUTION_META[slug]
  const scores = ALL_SCORES[slug]
  const rank = RANKED_IDS.indexOf(slug) + 1
  const priorComposite = PRIOR_COMPOSITE[slug] ?? scores.composite - 2
  const compositeDelta = Math.round((scores.composite - priorComposite) * 10) / 10

  const ytd2025 = ytdDonations(slug, 2025)
  const ytd2024 = ytdDonations(slug, 2024)
  const donationPctChange = ytd2024 > 0 ? Math.round(((ytd2025 - ytd2024) / ytd2024) * 100) : 0
  const donationDisplay = ytd2025 >= 1_000_000 ? `$${(ytd2025 / 1_000_000).toFixed(1)}M` : ytd2025 >= 1_000 ? `$${Math.round(ytd2025 / 1000)}K` : `$${ytd2025}`

  const titleIxRisk = TITLE_IX_RISK[slug] ?? 0
  const coachEvents = SEED_COACH_EVENTS.filter((e) => e.institution_id === slug)
  const unconfirmedCount = coachEvents.filter((e) => !e.confirmed).length

  const sparkline = compositeSparkline(slug)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {selectedSchool === 'all' ? 'Command Center' : `${meta?.shortName} — Command Center`}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedSchool === 'all'
            ? 'Showing Michigan data. Select a school above to filter.'
            : `${meta?.conference} · Real-time athletics intelligence dashboard`}
        </p>
      </div>

      {/* ROW 1 — KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Overall Rank */}
        <KpiTile
          label="Overall Rank"
          value={`#${rank} of ${INSTITUTION_IDS.length}`}
          sub={meta?.conference}
          icon={
            compositeDelta > 0 ? (
              <div className="flex items-center gap-0.5 text-xs text-green-600 font-semibold">
                <TrendingUp className="h-3 w-3" />
                +{compositeDelta}
              </div>
            ) : compositeDelta < 0 ? (
              <div className="flex items-center gap-0.5 text-xs text-red-500 font-semibold">
                <TrendingDown className="h-3 w-3" />
                {compositeDelta}
              </div>
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground" />
            )
          }
        />

        {/* 2. Composite Score */}
        <KpiTile
          label="Composite Score"
          value={`${scores.composite.toFixed(1)} / 100`}
          sub="30-day trend"
          sparkData={sparkline}
          sparkColor={meta?.primaryColor}
        />

        {/* 3. Title IX Risk — hidden for Donor role */}
        {role !== 'donor' ? (
          <KpiTile
            label="Title IX Risk"
            value={`${titleIxRisk} area${titleIxRisk !== 1 ? 's' : ''} at risk`}
            sub={titleIxRisk > 0 ? 'Action recommended' : 'All areas compliant'}
            subColor={titleIxRisk > 0 ? 'text-red-600' : 'text-green-600'}
            highlight={titleIxRisk > 0 ? 'red' : undefined}
            icon={
              titleIxRisk > 0 ? (
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              )
            }
          />
        ) : (
          <KpiTile
            label="Title IX"
            value="—"
            sub="Not available for your role"
          />
        )}

        {/* 4. YTD Donations */}
        <KpiTile
          label="YTD Donations"
          value={donationDisplay || '—'}
          sub={
            ytd2024 > 0
              ? `${donationPctChange > 0 ? '+' : ''}${donationPctChange}% vs prior year`
              : 'No prior year data'
          }
          subColor={donationPctChange > 0 ? 'text-green-600' : donationPctChange < 0 ? 'text-red-500' : undefined}
        />

        {/* 5. Reputation Score */}
        <KpiTile
          label="Reputation Score"
          value={`${Math.round(scores.reputation)} / 100`}
          sub={
            scores.reputation >= 70
              ? 'Positive trend'
              : scores.reputation >= 50
              ? 'Neutral sentiment'
              : 'Negative pressure'
          }
          subColor={
            scores.reputation >= 70
              ? 'text-green-600'
              : scores.reputation < 50
              ? 'text-red-500'
              : undefined
          }
          icon={
            scores.reputation >= 70 ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            ) : scores.reputation < 50 ? (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )
          }
        />

        {/* 6. Coach Alerts */}
        <KpiTile
          label="Coach Alerts"
          value={`${coachEvents.length} open`}
          sub={unconfirmedCount > 0 ? `${unconfirmedCount} unconfirmed` : 'All confirmed'}
          subColor={unconfirmedCount > 0 ? 'text-amber-600' : 'text-green-600'}
          highlight={unconfirmedCount > 0 ? 'amber' : undefined}
          icon={<BellRing className={`h-3.5 w-3.5 ${unconfirmedCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />}
        />
      </div>

      {/* ROW 2 — Mini Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniDonorTicker slug={slug} />
        <MiniReputation slug={slug} />
        <MiniAlerts slug={slug} />
      </div>

      {/* ROW 3 — Rankings Spotlight */}
      <RankingsSpotlight slug={slug} />
    </div>
  )
}

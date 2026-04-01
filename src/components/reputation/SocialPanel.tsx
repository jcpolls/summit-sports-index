'use client'

import { useEffect, useState, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface SocialSignal {
  id: string
  institution_id: string
  platform: string
  post_url: string | null
  post_text: string
  author_handle: string | null
  sentiment_score: number
  keywords: string[]
  flagged: boolean
  collected_at: string
}

interface Props {
  institutionSlug: string
  institutionName: string
  primaryColor: string
  demo?: boolean
}

// Semicircle gauge: maps -100..+100 → 0°..180° arc
function SentimentGauge({ score }: { score: number }) {
  const clamped = Math.max(-100, Math.min(100, score))
  // 0°=left (neg), 90°=top (neutral), 180°=right (pos)
  const angleDeg = ((clamped + 100) / 200) * 180
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  const cx = 80
  const cy = 72
  const r = 58
  const needleX = cx + r * Math.sin(angleRad)
  const needleY = cy - r * Math.cos(angleRad)

  const color = clamped >= 20 ? '#22c55e' : clamped <= -20 ? '#ef4444' : '#f59e0b'

  return (
    <svg viewBox="0 0 160 90" className="w-full max-w-[180px]">
      {/* Track */}
      <path
        d="M 14 72 A 66 66 0 0 1 146 72"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Fill arc (negative = red, positive = green) */}
      <path
        d="M 14 72 A 66 66 0 0 1 146 72"
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${((clamped + 100) / 200) * 207} 207`}
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke="#374151"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="4" fill="#374151" />
      {/* Labels */}
      <text x="10" y="86" fontSize="9" fill="#9ca3af">Neg</text>
      <text x="68" y="20" fontSize="9" fill="#9ca3af" textAnchor="middle">Neutral</text>
      <text x="140" y="86" fontSize="9" fill="#9ca3af" textAnchor="end">Pos</text>
      {/* Score */}
      <text x={cx} y={cy + 18} fontSize="14" fontWeight="bold" fill={color} textAnchor="middle">
        {clamped > 0 ? '+' : ''}{clamped}
      </text>
    </svg>
  )
}

function SparklineTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded bg-background border px-2 py-1 text-xs shadow">
      Score: {payload[0].value > 0 ? '+' : ''}{payload[0].value}
    </div>
  )
}

function TagCloud({ keywords }: { keywords: string[] }) {
  const freq: Record<string, number> = {}
  keywords.forEach((kw) => { freq[kw] = (freq[kw] ?? 0) + 1 })
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
  const max = sorted[0]?.[1] ?? 1

  return (
    <div className="flex flex-wrap gap-1.5">
      {sorted.map(([kw, count]) => {
        const size = 10 + Math.round((count / max) * 6)
        return (
          <span
            key={kw}
            style={{ fontSize: size }}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-default"
          >
            {kw}
          </span>
        )
      })}
    </div>
  )
}

export function SocialPanel({ institutionSlug, primaryColor, demo = true }: Props) {
  const [signals, setSignals] = useState<SocialSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSignals = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const params = new URLSearchParams({ institutionSlug, demo: demo ? 'true' : 'false' })
      const res = await fetch(`/api/social/twitter?${params}`)
      if (res.ok) {
        const data = await res.json()
        setSignals(data.signals ?? [])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [institutionSlug, demo])

  useEffect(() => {
    fetchSignals()
  }, [fetchSignals])

  const avgScore =
    signals.length > 0
      ? Math.round(signals.reduce((s, x) => s + x.sentiment_score, 0) / signals.length)
      : 0

  // Sparkline: last 7 signals by collected_at
  const sparkData = [...signals]
    .sort((a, b) => new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime())
    .slice(-10)
    .map((s) => ({ v: s.sentiment_score }))

  // Tag cloud keywords
  const allKeywords = signals.flatMap((s) => s.keywords ?? [])

  const trend =
    sparkData.length >= 3
      ? sparkData[sparkData.length - 1].v - sparkData[0].v
      : 0

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus
  const trendColor = trend > 5 ? 'text-green-500' : trend < -5 ? 'text-red-500' : 'text-yellow-500'

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sky-500 font-bold text-sm">𝕏</span>
          <span className="font-semibold text-sm">Social Media Surveillance</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => fetchSignals(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <>
          {/* Gauge + sparkline row */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <SentimentGauge score={avgScore} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                <span>7-day trend</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground font-medium">Sentiment trend (last {sparkData.length} posts)</p>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={primaryColor}
                      dot={false}
                      strokeWidth={2}
                    />
                    <Tooltip content={<SparklineTooltip />} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{signals.length} signals</span>
                <span>·</span>
                <span>{signals.filter((s) => s.flagged).length} flagged</span>
              </div>
            </div>
          </div>

          {/* Tag cloud */}
          {allKeywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Top Keywords</p>
              <TagCloud keywords={allKeywords} />
            </div>
          )}

          {/* Post feed */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Recent Posts</p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {signals.slice(0, 10).map((signal) => {
                const score = signal.sentiment_score
                const badgeColor =
                  score >= 20
                    ? 'bg-green-100 text-green-700'
                    : score <= -20
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                return (
                  <div
                    key={signal.id}
                    className={`rounded-lg border p-2.5 text-xs space-y-1 ${signal.flagged ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground font-medium truncate">
                        {signal.author_handle ?? 'Anonymous'}
                      </span>
                      <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${badgeColor}`}>
                        {score > 0 ? '+' : ''}{score}
                      </span>
                    </div>
                    <p className="leading-snug line-clamp-2">{signal.post_text}</p>
                    {signal.flagged && (
                      <Badge variant="destructive" className="text-[10px] h-4 px-1">Flagged</Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reddit placeholder */}
          <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
            Reddit r/{institutionSlug} integration — coming soon
          </div>
        </>
      )}
    </div>
  )
}

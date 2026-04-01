'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { useRole } from '@/lib/contexts/app-contexts'
import { useDemoMode } from '@/lib/contexts/app-contexts'
import { createClient } from '@/lib/supabase/client'
import { SEED_DONOR_EVENTS, formatAmount, sportColor } from '@/lib/seed-data/donor-events'
import { INSTITUTION_META } from '@/lib/seed-data/scoring-seed'

interface TickerEntry {
  id: string
  donor_name: string
  amount_usd: number
  designated_sport: string | null
  ts: Date
  visible: boolean
}

const THRESHOLDS = [
  { label: 'All', min: 0 },
  { label: '$10K+', min: 10_000 },
  { label: '$100K+', min: 100_000 },
  { label: '$1M+', min: 1_000_000 },
]

interface Props {
  institutionId: string
}

let demoIdx = 0

export function LiveTicker({ institutionId }: Props) {
  const { role } = useRole()
  const { demoMode } = useDemoMode()
  const [entries, setEntries] = useState<TickerEntry[]>([])
  const [threshold, setThreshold] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const isResearcher = role === 'researcher'
  const poolEvents = SEED_DONOR_EVENTS.filter((e) => e.institution_id === institutionId)

  function pushEntry(e: { donor_name: string; amount_usd: number; designated_sport: string | null }) {
    const entry: TickerEntry = {
      id: `${Date.now()}-${Math.random()}`,
      donor_name: isResearcher ? 'Anonymous Donor' : e.donor_name,
      amount_usd: e.amount_usd,
      designated_sport: e.designated_sport,
      ts: new Date(),
      visible: false,
    }
    setEntries((prev) => [entry, ...prev].slice(0, 20))
    // Animate in
    setTimeout(() => {
      setEntries((prev) =>
        prev.map((x) => (x.id === entry.id ? { ...x, visible: true } : x))
      )
    }, 50)
  }

  useEffect(() => {
    if (demoMode) {
      const interval = setInterval(() => {
        if (!poolEvents.length) return
        const pick = poolEvents[demoIdx % poolEvents.length]
        demoIdx++
        pushEntry(pick)
      }, 8_000)
      // Prime with 3 entries immediately
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const pick = poolEvents[(demoIdx + i) % poolEvents.length]
          pushEntry(pick)
        }, i * 200)
      }
      demoIdx += 3
      return () => clearInterval(interval)
    } else {
      // Real Supabase Realtime subscription
      const supabase = createClient()
      const channel = supabase
        .channel('donor_events')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'donor_events',
            filter: `institution_id=eq.${institutionId}`,
          },
          (payload) => {
            const row = payload.new as { donor_name: string; amount_usd: number; designated_sport: string | null }
            pushEntry(row)
          }
        )
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, institutionId, isResearcher])

  const filtered = entries.filter((e) => e.amount_usd >= threshold)
  const meta = INSTITUTION_META[institutionId]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          {demoMode ? (
            <Badge variant="outline" className="text-[10px] font-semibold border-amber-400 text-amber-600">DEMO</Badge>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">LIVE</span>
            </span>
          )}
          <span className="text-sm font-semibold">Donation Feed</span>
        </div>
        <span className="text-xs text-muted-foreground">{meta?.shortName}</span>
      </div>

      {/* Threshold filters */}
      <div className="flex gap-1 mb-3 shrink-0 flex-wrap">
        {THRESHOLDS.map((t) => (
          <button
            key={t.min}
            onClick={() => setThreshold(t.min)}
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
              threshold === t.min
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            {demoMode ? 'Waiting for demo events...' : 'Listening for new gifts...'}
          </p>
        )}
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="transition-all duration-500 ease-out"
            style={{
              opacity: entry.visible ? 1 : 0,
              transform: entry.visible ? 'translateY(0)' : 'translateY(-12px)',
            }}
          >
            <div className="rounded-lg border bg-card px-3 py-2.5 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold leading-tight truncate">
                  {entry.donor_name}
                </span>
                <span className="text-sm font-bold shrink-0 tabular-nums">
                  {formatAmount(entry.amount_usd)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                {entry.designated_sport ? (
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: sportColor(entry.designated_sport) }}
                  >
                    {entry.designated_sport}
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(entry.ts, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

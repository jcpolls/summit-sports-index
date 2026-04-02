'use client'

import { useRef, useState } from 'react'
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SchoolLogo } from '@/components/shared/school-logo'
import { NarrativeCard } from '@/components/rankings/NarrativeCard'
import { DimensionScores } from '@/lib/scoring'
import { INSTITUTION_META } from '@/lib/seed-data/scoring-seed'

export interface RankedSchool {
  id: string
  rank: number
  scores: DimensionScores
}

interface Props {
  schools: RankedSchool[]
}

const DIM_KEYS: (keyof Omit<DimensionScores, 'composite'>)[] = [
  'financial', 'equity', 'academic', 'competitive', 'reputation', 'survey',
]

const DIM_LABELS: Record<string, string> = {
  financial: 'Financial', equity: 'Equity', academic: 'Academic',
  competitive: 'Competitive', reputation: 'Reputation', survey: 'Survey',
}

const DIM_COLORS: Record<string, string> = {
  financial: '#3b82f6', equity: '#8b5cf6', academic: '#10b981',
  competitive: '#f59e0b', reputation: '#ec4899', survey: '#6b7280',
}

function ScoreCell({ value }: { value: number }) {
  const color = value > 75 ? 'text-green-600' : value >= 50 ? 'text-amber-500' : 'text-red-500'
  return <span className={`font-mono text-xs font-semibold ${color}`}>{value.toFixed(1)}</span>
}

function MiniBarChart({ scores }: { scores: DimensionScores }) {
  return (
    <div className="space-y-1.5 py-1">
      {DIM_KEYS.map((k) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-20 text-[11px] text-muted-foreground shrink-0">{DIM_LABELS[k]}</span>
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${scores[k]}%`, backgroundColor: DIM_COLORS[k] }}
            />
          </div>
          <ScoreCell value={scores[k]} />
        </div>
      ))}
    </div>
  )
}

function exportCsv(schools: RankedSchool[]) {
  const header = ['Rank', 'School', 'Conference', 'Composite', ...DIM_KEYS.map((k) => DIM_LABELS[k])]
  const rows = schools.map((s) => {
    const m = INSTITUTION_META[s.id]
    return [
      s.rank,
      m?.name ?? s.id,
      m?.conference ?? '',
      s.scores.composite,
      ...DIM_KEYS.map((k) => s.scores[k]),
    ]
  })
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'athletiq-rankings.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function RankingsTable({ schools }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const prevRanks = useRef<Record<string, number>>({})

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  // Detect rank changes vs prior render
  const rankChanges: Record<string, number> = {}
  for (const s of schools) {
    const prev = prevRanks.current[s.id]
    rankChanges[s.id] = prev !== undefined ? prev - s.rank : 0
  }
  // Update ref after render
  setTimeout(() => {
    for (const s of schools) prevRanks.current[s.id] = s.rank
  }, 0)

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportCsv(schools)}>
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="grid bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground"
          style={{ gridTemplateColumns: '3rem 2rem 1fr 7rem 6rem 5rem 5rem 5rem 5rem 5rem 5rem' }}>
          <span>Rank</span>
          <span></span>
          <span>School</span>
          <span>Conference</span>
          <span>Composite</span>
          <span>Financial</span>
          <span>Equity</span>
          <span>Academic</span>
          <span>Competitive</span>
          <span>Reputation</span>
          <span>Survey</span>
        </div>

        {schools.map((s) => {
          const meta = INSTITUTION_META[s.id]
          const isOpen = expanded === s.id
          const delta = rankChanges[s.id]

          return (
            <div key={s.id} className="border-t">
              {/* Main row */}
              <button
                onClick={() => toggle(s.id)}
                className="w-full grid items-center px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                style={{ gridTemplateColumns: '3rem 2rem 1fr 7rem 6rem 5rem 5rem 5rem 5rem 5rem 5rem' }}
              >
                <span className="text-sm font-bold">#{s.rank}</span>

                {/* Trend indicator */}
                <span>
                  {delta > 0 && <ArrowUp className="h-3.5 w-3.5 text-green-600" />}
                  {delta < 0 && <ArrowDown className="h-3.5 w-3.5 text-red-500" />}
                </span>

                {/* School */}
                <div className="flex items-center gap-2">
                  <SchoolLogo
                    name={meta?.shortName ?? s.id}
                    primaryColor={meta?.primaryColor ?? '#666'}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm font-medium">{meta?.shortName ?? s.id}</div>
                    <div className="text-[11px] text-muted-foreground">{meta?.name}</div>
                  </div>
                  <span className="ml-1 text-muted-foreground">
                    {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </span>
                </div>

                <span className="text-xs text-muted-foreground">{meta?.conference}</span>

                {/* Composite */}
                <span className="text-base font-bold">{s.scores.composite.toFixed(1)}</span>

                {DIM_KEYS.map((k) => (
                  <ScoreCell key={k} value={s.scores[k]} />
                ))}
              </button>

              {/* Expanded row */}
              {isOpen && (
                <div className="px-6 pb-5 pt-2 bg-muted/10 border-t space-y-4">
                  <MiniBarChart scores={s.scores} />
                  <NarrativeCard
                    institutionId={s.id}
                    schoolName={meta?.shortName ?? s.id}
                    rank={s.rank}
                    scores={s.scores}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

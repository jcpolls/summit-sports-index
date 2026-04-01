'use client'

import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { WeightSliders } from '@/components/rankings/WeightSliders'
import { RankingsTable, RankedSchool } from '@/components/rankings/RankingsTable'
import { PeerComparison } from '@/components/rankings/PeerComparison'
import { calculateAllScores, DEFAULT_WEIGHTS, Weights } from '@/lib/scoring'
import { INSTITUTION_IDS, SEED_SCORING_DATA } from '@/lib/seed-data/scoring-seed'

export default function RankingsPage() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS)

  const handleWeightsChange = useCallback((w: Weights) => {
    setWeights(w)
  }, [])

  const rankedSchools = useMemo<RankedSchool[]>(() => {
    const scores = calculateAllScores(INSTITUTION_IDS, SEED_SCORING_DATA, weights)
    return Object.entries(scores)
      .map(([id, s]) => ({ id, scores: s, rank: 0 }))
      .sort((a, b) => b.scores.composite - a.scores.composite)
      .map((s, i) => ({ ...s, rank: i + 1 }))
  }, [weights])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rankings</h2>
        <p className="text-sm text-muted-foreground">
          Composite institution score across six weighted dimensions
        </p>
      </div>

      <WeightSliders onChange={handleWeightsChange} />

      <RankingsTable schools={rankedSchools} />

      <PeerComparison schools={rankedSchools} />

      {/* Survey callout */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-400">
          <span className="font-semibold">Survey dimension</span> sourced from TrueDot mock data
          (Oct&nbsp;2024 + Feb&nbsp;2025 waves). Connect the TrueDot API in{' '}
          <span className="underline underline-offset-2 cursor-pointer hover:text-amber-900">
            Settings
          </span>{' '}
          to enable live ingestion.
        </p>
      </div>
    </div>
  )
}

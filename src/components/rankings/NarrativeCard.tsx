'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'
import { DimensionScores } from '@/lib/scoring'
import { useDemoMode } from '@/lib/contexts/app-contexts'

interface Props {
  institutionId: string
  schoolName: string
  rank: number
  scores: DimensionScores
}

export function NarrativeCard({ institutionId, schoolName, rank, scores }: Props) {
  const { demoMode } = useDemoMode()
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/rankings/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId, schoolName, rank, scores, demoMode }),
      })
      const data = await res.json()
      setNarrative(data.narrative)
    } catch {
      setError('Failed to generate narrative.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {!narrative && !loading && (
        <Button variant="outline" size="sm" onClick={generate} className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Generate Analysis
        </Button>
      )}
      {loading && <Skeleton className="h-10 w-full" />}
      {narrative && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground leading-relaxed">{narrative}</p>
          <p className="text-[10px] text-muted-foreground/60">
            Powered by Claude AI · Anthropic
          </p>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

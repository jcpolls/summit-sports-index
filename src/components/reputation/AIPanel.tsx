'use client'

import { useEffect, useState, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus, Sparkles, RefreshCw, CheckCircle, AlertTriangle, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReputationAnalysis } from '@/app/api/reputation/ai/route'

interface Props {
  institutionSlug: string
  institutionName: string
  demo?: boolean
}

function MomentumBadge({ momentum, delta }: { momentum: ReputationAnalysis['momentum']; delta: number }) {
  if (momentum === 'rising') {
    return (
      <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
        <TrendingUp className="h-3 w-3" />
        Rising {delta > 0 ? `+${delta}` : delta}
      </Badge>
    )
  }
  if (momentum === 'declining') {
    return (
      <Badge className="gap-1 bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
        <TrendingDown className="h-3 w-3" />
        Declining {delta}
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">
      <Minus className="h-3 w-3" />
      Stable {delta > 0 ? `+${delta}` : delta}
    </Badge>
  )
}

function SentimentMeter({ score }: { score: number }) {
  const pct = ((score + 100) / 200) * 100
  const color = score >= 20 ? 'bg-green-500' : score <= -20 ? 'bg-red-500' : 'bg-yellow-400'
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground w-16 text-right">{score <= -20 ? 'Negative' : score >= 20 ? 'Positive' : 'Neutral'}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono font-semibold w-8">{score > 0 ? '+' : ''}{score}</span>
    </div>
  )
}

export function AIPanel({ institutionSlug, institutionName, demo = true }: Props) {
  const [analysis, setAnalysis] = useState<ReputationAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  const fetchAnalysis = useCallback(async (bust = false) => {
    if (bust) setRegenerating(true)
    else setLoading(true)

    try {
      const url = `/api/reputation/ai${bust ? '?bust=true' : ''}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionSlug, institutionName, demo }),
      })
      if (res.ok) {
        const data = await res.json()
        setAnalysis(data)
      }
    } finally {
      setLoading(false)
      setRegenerating(false)
    }
  }, [institutionSlug, institutionName, demo])

  useEffect(() => {
    fetchAnalysis()
  }, [fetchAnalysis])

  const generatedAgo = analysis?.generated_at
    ? Math.round((Date.now() - new Date(analysis.generated_at).getTime()) / 60000)
    : null

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="font-semibold text-sm">Reputational AI</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => fetchAnalysis(true)}
          disabled={regenerating}
        >
          <RefreshCw className={`h-3 w-3 ${regenerating ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : analysis ? (
        <>
          {/* Momentum + sentiment */}
          <div className="flex items-center gap-3 flex-wrap">
            <MomentumBadge momentum={analysis.momentum} delta={analysis.momentum_delta} />
            <SentimentMeter score={analysis.sentiment_score} />
          </div>

          {/* Summary */}
          <p className="text-sm leading-relaxed text-foreground/90">{analysis.summary}</p>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-semibold text-green-700">Strengths</span>
              </div>
              <ul className="space-y-1">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-green-500 mt-0.5 shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns */}
          {analysis.concerns.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-xs font-semibold text-yellow-700">Concerns</span>
              </div>
              <ul className="space-y-1">
                {analysis.concerns.map((c, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Controversies */}
          {analysis.controversies.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Flame className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-semibold text-red-700">Controversies</span>
              </div>
              <ul className="space-y-1">
                {analysis.controversies.map((c, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-red-500 mt-0.5 shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto pt-2 border-t flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Powered by Claude AI · Anthropic
            </span>
            {generatedAgo !== null && (
              <span className="text-[10px] text-muted-foreground">
                {generatedAgo < 1 ? 'Just now' : `${generatedAgo}m ago`}
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
          Failed to load analysis
        </div>
      )}
    </div>
  )
}

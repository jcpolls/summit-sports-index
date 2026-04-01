'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DEFAULT_WEIGHTS, Weights } from '@/lib/scoring'

const STORAGE_KEY = 'summit-weights'

const DIMENSION_LABELS: Record<keyof Weights, string> = {
  financial:   'Financial',
  equity:      'Equity (EADA)',
  academic:    'Academic (APR)',
  competitive: 'Competitive',
  reputation:  'Reputation',
  survey:      'Survey',
}

interface Props {
  onChange: (weights: Weights) => void
}

function weightsToSliders(w: Weights): Record<keyof Weights, number> {
  return {
    financial:   Math.round(w.financial * 100),
    equity:      Math.round(w.equity * 100),
    academic:    Math.round(w.academic * 100),
    competitive: Math.round(w.competitive * 100),
    reputation:  Math.round(w.reputation * 100),
    survey:      Math.round(w.survey * 100),
  }
}

function slidersToWeights(s: Record<keyof Weights, number>): Weights {
  return {
    financial:   s.financial / 100,
    equity:      s.equity / 100,
    academic:    s.academic / 100,
    competitive: s.competitive / 100,
    reputation:  s.reputation / 100,
    survey:      s.survey / 100,
  }
}

function loadSaved(): Record<keyof Weights, number> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function WeightSliders({ onChange }: Props) {
  const [sliders, setSliders] = useState<Record<keyof Weights, number>>(() => {
    const saved = loadSaved()
    return saved ?? weightsToSliders(DEFAULT_WEIGHTS)
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = Object.values(sliders).reduce((s, v) => s + v, 0)
  const isExact = total === 100

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sliders))
      onChange(slidersToWeights(sliders))
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [sliders, onChange])

  function handleChange(key: keyof Weights, value: number) {
    setSliders((prev) => ({ ...prev, [key]: value }))
  }

  function autoNormalize() {
    if (total === 0) return
    const normalized = Object.fromEntries(
      Object.entries(sliders).map(([k, v]) => [k, Math.round((v / total) * 100)])
    ) as Record<keyof Weights, number>
    // Fix rounding drift on the largest key
    const drift = 100 - Object.values(normalized).reduce((s, v) => s + v, 0)
    const largest = (Object.keys(normalized) as (keyof Weights)[]).reduce((a, b) =>
      normalized[a] > normalized[b] ? a : b
    )
    normalized[largest] += drift
    setSliders(normalized)
  }

  function resetDefaults() {
    setSliders(weightsToSliders(DEFAULT_WEIGHTS))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Weight Configuration</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isExact ? 'text-green-600' : 'text-red-500'}`}>
              {total}% allocated
            </span>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={autoNormalize}>
              Auto-normalize
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetDefaults}>
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(Object.keys(DIMENSION_LABELS) as (keyof Weights)[]).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-28 text-xs text-muted-foreground shrink-0">
              {DIMENSION_LABELS[key]}
            </span>
            <input
              type="range"
              min={0}
              max={50}
              value={sliders[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="flex-1 h-1.5 accent-foreground cursor-pointer"
            />
            <span className="w-10 text-right text-xs font-mono font-medium">
              {sliders[key]}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

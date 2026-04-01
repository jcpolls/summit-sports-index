'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function CompositeScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? 'bg-green-100 text-green-800 border-green-200' :
    score >= 70 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    score >= 50 ? 'bg-orange-100 text-orange-800 border-orange-200' :
    'bg-red-100 text-red-800 border-red-200'

  return (
    <Badge variant="outline" className={cn('font-mono text-xs', color)}>
      {score.toFixed(1)}
    </Badge>
  )
}

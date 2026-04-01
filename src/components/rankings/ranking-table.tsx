'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SchoolLogo } from '@/components/shared/school-logo'
import { CompositeScoreBadge } from './composite-score-badge'
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/format'

interface RankingRow {
  id: string
  schoolName: string
  schoolShortName: string
  primaryColor: string
  sport: string
  source: string
  rank: number
  score: number
  wins: number
  losses: number
  conferenceRank: number
  trend: 'up' | 'down' | 'steady'
  trendDelta: number
  asOfDate: string
}

type SortKey = 'rank' | 'score' | 'schoolShortName'

export function RankingTable({ data }: { data: RankingRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const mult = sortAsc ? 1 : -1
      if (sortKey === 'rank') return (a.rank - b.rank) * mult
      if (sortKey === 'score') return (a.score - b.score) * mult
      return a.schoolShortName.localeCompare(b.schoolShortName) * mult
    })
  }, [data, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(key === 'rank')
    }
  }

  const SortButton = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 text-xs font-medium hover:bg-transparent"
      onClick={() => handleSort(sortKeyVal)}
    >
      {label}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  )

  const sportLabel = (s: string) => {
    if (s === 'football') return 'Football'
    if (s === 'basketball-m') return "Men's BBall"
    if (s === 'basketball-w') return "Women's BBall"
    return s
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><SortButton label="School" sortKeyVal="schoolShortName" /></TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Source</TableHead>
            <TableHead><SortButton label="Rank" sortKeyVal="rank" /></TableHead>
            <TableHead><SortButton label="Score" sortKeyVal="score" /></TableHead>
            <TableHead>Record</TableHead>
            <TableHead>Conf.</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => {
            const TrendIcon = row.trend === 'up' ? TrendingUp : row.trend === 'down' ? TrendingDown : Minus
            const trendColor = row.trend === 'up' ? 'text-green-600' : row.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'

            return (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <SchoolLogo name={row.schoolName} primaryColor={row.primaryColor} size="sm" />
                    <span className="text-sm font-medium">{row.schoolShortName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{sportLabel(row.sport)}</TableCell>
                <TableCell className="text-xs capitalize">{row.source.replace('-', ' ')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">#{row.rank}</span>
                    <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                    {row.trendDelta !== 0 && (
                      <span className={`text-[10px] ${trendColor}`}>
                        {row.trendDelta > 0 ? '+' : ''}{row.trendDelta}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell><CompositeScoreBadge score={row.score} /></TableCell>
                <TableCell className="text-xs">{row.wins}-{row.losses}</TableCell>
                <TableCell className="text-xs">#{row.conferenceRank}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(row.asOfDate)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

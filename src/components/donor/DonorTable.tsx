'use client'

import { useMemo, useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ExternalLink, Lock } from 'lucide-react'
import { useRole } from '@/lib/contexts/app-contexts'
import { SEED_DONOR_EVENTS, formatAmount, sportColor } from '@/lib/seed-data/donor-events'

type SortKey = 'totalGiving' | 'giftCount' | 'largestGift'

interface DonorRow {
  id: string
  institution_id: string
  donor_name: string
  totalGiving: number
  giftCount: number
  largestGift: number
  primarySport: string | null
  source_url: string | null
  rank: number
}

function buildRows(institutionId: string): DonorRow[] {
  const events = SEED_DONOR_EVENTS.filter((e) => e.institution_id === institutionId)
  const map: Record<string, DonorRow> = {}
  for (const e of events) {
    if (!map[e.donor_name]) {
      map[e.donor_name] = {
        id: e.id,
        institution_id: e.institution_id,
        donor_name: e.donor_name,
        totalGiving: 0,
        giftCount: 0,
        largestGift: 0,
        primarySport: e.designated_sport,
        source_url: null,
        rank: 0,
      }
    }
    map[e.donor_name].totalGiving += e.amount_usd
    map[e.donor_name].giftCount += 1
    map[e.donor_name].largestGift = Math.max(map[e.donor_name].largestGift, e.amount_usd)
  }
  return Object.values(map)
    .sort((a, b) => b.totalGiving - a.totalGiving)
    .map((d, i) => ({ ...d, rank: i + 1 }))
}

interface Props {
  institutionId: string
}

export function DonorTable({ institutionId }: Props) {
  const { role } = useRole()
  const [sortKey, setSortKey] = useState<SortKey>('totalGiving')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const baseRows = useMemo(() => buildRows(institutionId), [institutionId])

  const sorted = useMemo(() => {
    return [...baseRows].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      return sortDir === 'desc' ? -diff : diff
    })
  }, [baseRows, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function displayName(row: DonorRow, idx: number): React.ReactNode {
    if (role === 'researcher') {
      return (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Lock className="h-3 w-3 shrink-0" />
          Donor #{String(idx + 1).padStart(2, '0')}
        </span>
      )
    }
    if (role === 'admin' && row.source_url) {
      return (
        <a
          href={row.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline text-blue-600"
        >
          {row.donor_name}
          <ExternalLink className="h-3 w-3" />
        </a>
      )
    }
    return row.donor_name
  }

  function SortButton({ col }: { col: SortKey }) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 hover:bg-transparent font-semibold text-xs"
        onClick={() => toggleSort(col)}
      >
        <ArrowUpDown className="h-3 w-3 ml-1 inline" />
      </Button>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-12 text-xs">Rank</TableHead>
            <TableHead className="text-xs">Name</TableHead>
            <TableHead className="text-xs">
              Total Giving <SortButton col="totalGiving" />
            </TableHead>
            <TableHead className="text-xs">Primary Sport</TableHead>
            <TableHead className="text-xs">
              Largest Gift <SortButton col="largestGift" />
            </TableHead>
            <TableHead className="text-xs">
              Gifts <SortButton col="giftCount" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row, idx) => (
            <TableRow key={row.id} className="hover:bg-muted/20">
              <TableCell className="text-sm font-bold text-muted-foreground">
                #{row.rank}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {displayName(row, idx)}
              </TableCell>
              <TableCell className="text-sm font-mono font-semibold">
                {formatAmount(row.totalGiving)}
              </TableCell>
              <TableCell>
                {row.primarySport ? (
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: sportColor(row.primarySport) }}
                  >
                    {row.primarySport}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm font-mono">
                {formatAmount(row.largestGift)}
              </TableCell>
              <TableCell className="text-sm text-center">
                {row.giftCount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

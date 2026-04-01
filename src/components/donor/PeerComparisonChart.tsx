'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer } from '@/components/shared/chart-container'
import { formatAmount, peerComparison } from '@/lib/seed-data/donor-events'
import { INSTITUTION_META } from '@/lib/seed-data/scoring-seed'

interface Props {
  institutionId: string
}

export function PeerComparisonChart({ institutionId }: Props) {
  const { mine, peerAvg } = peerComparison(institutionId)
  const meta = INSTITUTION_META[institutionId]
  const schoolColor = meta?.primaryColor ?? '#3b82f6'
  const shortName = meta?.shortName ?? institutionId

  const data = [
    {
      metric: 'Total Donors',
      [shortName]: mine.totalDonors,
      'Peer Avg': peerAvg.totalDonors,
    },
    {
      metric: 'Avg Gift',
      [shortName]: mine.avgGift,
      'Peer Avg': peerAvg.avgGift,
    },
    {
      metric: 'Total Raised',
      [shortName]: mine.totalRaised,
      'Peer Avg': peerAvg.totalRaised,
    },
  ]

  function formatTick(value: number, metricName: string): string {
    if (metricName === 'Total Donors') return String(value)
    return formatAmount(value)
  }

  return (
    <ChartContainer
      title="Peer Comparison"
      description={`${shortName} vs. 5-school average`}
      height={220}
    >
      <BarChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
        <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v: number, i: number) => {
            // Use the metric name from data to decide formatting
            const metric = data[i]?.metric ?? ''
            return formatTick(v, metric)
          }}
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          formatter={(value: unknown, name: unknown) => [
            typeof value === 'number' ? formatAmount(value) : String(value),
            String(name),
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey={shortName} fill={schoolColor} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Peer Avg" fill="#9ca3af" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

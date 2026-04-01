'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { ChartContainer } from '@/components/shared/chart-container'
import { formatAmount, ytdBySport } from '@/lib/seed-data/donor-events'

interface Props {
  institutionId: string
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { sport: string; total: number; count: number; max: number; avg: number } }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-background shadow-md p-3 text-xs space-y-1">
      <p className="font-semibold">{d.sport}</p>
      <p>Total: <span className="font-mono">{formatAmount(d.total)}</span></p>
      <p>Gifts: {d.count}</p>
      <p>Avg: <span className="font-mono">{formatAmount(d.avg)}</span></p>
      <p>Largest: <span className="font-mono">{formatAmount(d.max)}</span></p>
    </div>
  )
}

export function YtdBySportChart({ institutionId }: Props) {
  const data = ytdBySport(institutionId)
  const year = new Date().getFullYear()

  return (
    <ChartContainer
      title={`${year} YTD Giving by Sport`}
      description="Donor records via public foundation pages · Blue = Men's · Rose = Women's · Gray = General"
      height={Math.max(200, data.length * 40)}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatAmount(v)}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="sport"
          width={130}
          tick={{ fontSize: 11 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

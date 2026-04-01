'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { ChartContainer } from '@/components/shared/chart-container'
import { formatAmount, monthlyTrend } from '@/lib/seed-data/donor-events'

interface Props {
  institutionId: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background shadow-md p-3 text-xs space-y-1.5">
      <p className="font-semibold">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-medium">{formatAmount(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function MonthlyTrendChart({ institutionId }: Props) {
  const data = monthlyTrend(institutionId)
  const megaMonths = data.filter((d) => d.megaGift)

  return (
    <ChartContainer
      title="Monthly Giving Trend (24 months)"
      description="Total Giving · Major Gifts (>$100K) · Annual Fund (<$10K)"
      height={240}
    >
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-major" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-annual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={3} />
        <YAxis tickFormatter={(v: number) => formatAmount(v)} tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        {megaMonths.map((d) => (
          <ReferenceLine
            key={d.month}
            x={d.label}
            stroke="#6366f1"
            strokeDasharray="3 3"
            label={{ value: formatAmount(d.megaGift!.amount_usd), fontSize: 9, fill: '#6366f1', position: 'top' }}
          />
        ))}
        <Area
          type="monotone"
          dataKey="total"
          name="Total Giving"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#grad-total)"
        />
        <Area
          type="monotone"
          dataKey="major"
          name="Major Gifts"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#grad-major)"
        />
        <Area
          type="monotone"
          dataKey="annual"
          name="Annual Fund"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#grad-annual)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

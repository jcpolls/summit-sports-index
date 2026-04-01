'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, AlertTriangle, Heart, DollarSign } from 'lucide-react'
import { formatCompactCurrency } from '@/lib/utils/format'

interface KeyMetricsGridProps {
  totalSchools: number
  activeAlerts: number
  avgSentiment: number
  totalDonations: number
}

interface MetricCardProps {
  label: string
  value: string
  trend: string
  trendUp: boolean
  icon: React.ReactNode
}

function MetricCard({ label, value, trend, trendUp, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '\u2191' : '\u2193'} {trend}
        </p>
      </CardContent>
    </Card>
  )
}

export function KeyMetricsGrid({ totalSchools, activeAlerts, avgSentiment, totalDonations }: KeyMetricsGridProps) {
  const metrics: MetricCardProps[] = [
    {
      label: 'Total Schools',
      value: String(totalSchools),
      trend: 'All active',
      trendUp: true,
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: 'Active Alerts',
      value: String(activeAlerts),
      trend: '3 critical',
      trendUp: false,
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      label: 'Avg. Sentiment',
      value: avgSentiment.toFixed(1),
      trend: '+2.1 vs last month',
      trendUp: true,
      icon: <Heart className="h-4 w-4" />,
    },
    {
      label: 'Total Donations (FY)',
      value: formatCompactCurrency(totalDonations),
      trend: '+8.3% vs prior FY',
      trendUp: true,
      icon: <DollarSign className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  )
}

'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SchoolLogo } from '@/components/shared/school-logo'
import { MetricSparkline } from './metric-sparkline'
import { formatCompactCurrency } from '@/lib/utils/format'
import { ArrowUp, ArrowDown, Minus, Bell } from 'lucide-react'
import type { ComplianceStatus } from '@/types/database'

export interface SchoolCardData {
  slug: string
  name: string
  shortName: string
  conference: string
  primaryColor: string
  compositeRank: number
  trend: 'up' | 'down' | 'steady'
  trendDelta: number
  sparklineData: { value: number }[]
  totalDonationsFY: number
  complianceStatus: ComplianceStatus
  sentimentScore: number
  unreadAlerts: number
}

const COMPLIANCE_COLORS: Record<ComplianceStatus, string> = {
  compliant: 'bg-green-500',
  'under-review': 'bg-yellow-500',
  'non-compliant': 'bg-red-500',
}

const COMPLIANCE_LABELS: Record<ComplianceStatus, string> = {
  compliant: 'Compliant',
  'under-review': 'Under Review',
  'non-compliant': 'Non-Compliant',
}

export function SchoolCard({ school }: { school: SchoolCardData }) {
  const TrendIcon = school.trend === 'up' ? ArrowUp : school.trend === 'down' ? ArrowDown : Minus
  const trendColor = school.trend === 'up' ? 'text-green-600' : school.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <SchoolLogo name={school.name} primaryColor={school.primaryColor} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{school.shortName}</p>
            <Badge variant="secondary" className="text-[10px] mt-0.5">
              {school.conference}
            </Badge>
          </div>
          {school.unreadAlerts > 0 && (
            <div className="relative shrink-0">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {school.unreadAlerts}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Composite Rank</p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">#{school.compositeRank}</span>
              <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
              {school.trendDelta !== 0 && (
                <span className={`text-xs font-medium ${trendColor}`}>
                  {Math.abs(school.trendDelta)}
                </span>
              )}
            </div>
          </div>
          <MetricSparkline
            data={school.sparklineData}
            color={school.primaryColor}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Donations FY</p>
            <p className="text-xs font-semibold">{formatCompactCurrency(school.totalDonationsFY)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Compliance</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <div className={`h-2 w-2 rounded-full ${COMPLIANCE_COLORS[school.complianceStatus]}`} />
              <span className="text-[10px]">{COMPLIANCE_LABELS[school.complianceStatus]}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Sentiment</p>
            <p className="text-xs font-semibold">{school.sentimentScore.toFixed(1)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SchoolLogo } from '@/components/shared/school-logo'
import { formatRelativeTime } from '@/lib/utils/format'
import { SCHOOLS } from '@/lib/constants/schools'
import { LegacyAlert as Alert, AlertSeverity } from "@/types/database"
import { CheckCircle, Eye } from 'lucide-react'

const SEVERITY_BORDER: Record<AlertSeverity, string> = {
  info: 'border-l-blue-500',
  warning: 'border-l-yellow-500',
  critical: 'border-l-red-500',
}

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
}

const ALERT_TYPE_LABELS: Record<string, string> = {
  'sentiment-drop': 'Sentiment',
  'ncaa-violation': 'NCAA',
  'coaching-change': 'Coaching',
  'media-spike': 'Media',
  'chronicle-complaint': 'Chronicle',
  'budget-threshold': 'Budget',
  'title-ix': 'Title IX',
}

interface AlertCardProps {
  alert: Alert
  onMarkRead: (id: string) => void
}

export function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  const school = SCHOOLS.find((s) => s.slug === alert.school_id)

  return (
    <Card
      className={`border-l-4 ${SEVERITY_BORDER[alert.severity]} ${
        !alert.is_read ? 'bg-muted/30' : ''
      }`}
    >
      <CardContent className="py-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!alert.is_read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                  <h3 className="font-medium text-sm leading-snug">
                    {alert.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {school && (
                <div className="flex items-center gap-1.5">
                  <SchoolLogo
                    name={school.name}
                    primaryColor={school.primaryColor}
                    size="sm"
                  />
                  <span className="text-xs font-medium">{school.shortName}</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(alert.created_at)}
              </span>
              <Badge className={SEVERITY_BADGE[alert.severity]}>
                {alert.severity}
              </Badge>
              <Badge variant="secondary">
                {ALERT_TYPE_LABELS[alert.alert_type] ?? alert.alert_type}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            {!alert.is_read ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkRead(alert.id)}
                title="Mark as read"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <CheckCircle className="h-4 w-4 text-muted-foreground/50" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/shared/empty-state'
import { useRole } from '@/lib/providers/role-provider'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { formatDate, formatRelativeTime } from '@/lib/utils/format'
import { filterReputationEvents } from '@/lib/utils/permissions'
import { SEED_REPUTATION_EVENTS } from '@/lib/seed-data/reputation-events'
import { SCHOOLS } from '@/lib/constants/schools'
import { ReputationEventType } from '@/types/database'
import {
  Newspaper,
  MessageSquare,
  AlertTriangle,
  Gavel,
  UserCog,
  ListFilter,
} from 'lucide-react'

const EVENT_TYPE_CONFIG: Record<
  ReputationEventType,
  { label: string; icon: React.ElementType; className: string }
> = {
  'media-mention': { label: 'Media', icon: Newspaper, className: 'text-blue-600 bg-blue-50' },
  'social-sentiment': { label: 'Social', icon: MessageSquare, className: 'text-cyan-600 bg-cyan-50' },
  'chronicle-complaint': { label: 'Complaint', icon: AlertTriangle, className: 'text-orange-600 bg-orange-50' },
  'ncaa-infraction': { label: 'Infraction', icon: Gavel, className: 'text-red-600 bg-red-50' },
  'coaching-change': { label: 'Coaching', icon: UserCog, className: 'text-purple-600 bg-purple-50' },
}

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}

function sentimentBadge(score: number) {
  if (score >= 0.2) return { label: `+${score.toFixed(2)}`, className: 'bg-green-100 text-green-800' }
  if (score <= -0.2) return { label: score.toFixed(2), className: 'bg-red-100 text-red-800' }
  return { label: score.toFixed(2), className: 'bg-gray-100 text-gray-700' }
}

export function ReputationEventList() {
  const { role } = useRole()
  const { selectedSchool } = useSchoolFilter()
  const [typeFilter, setTypeFilter] = useState<string>('all')

  let events = filterReputationEvents(SEED_REPUTATION_EVENTS, role)

  if (selectedSchool !== 'all') {
    events = events.filter((e) => e.school_id === selectedSchool)
  }
  if (typeFilter !== 'all') {
    events = events.filter((e) => e.event_type === typeFilter)
  }

  events = events.sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            Reputation Events
          </CardTitle>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="media-mention">Media Mentions</SelectItem>
              <SelectItem value="social-sentiment">Social Sentiment</SelectItem>
              <SelectItem value="chronicle-complaint">Chronicle Complaints</SelectItem>
              <SelectItem value="ncaa-infraction">NCAA Infractions</SelectItem>
              <SelectItem value="coaching-change">Coaching Changes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState
            title="No events found"
            description="No reputation events match your current filters."
          />
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const config = EVENT_TYPE_CONFIG[event.event_type]
              const Icon = config.icon
              const school = SCHOOLS.find((s) => s.slug === event.school_id)
              const sentiment = sentimentBadge(event.sentiment_score)

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className={`rounded-lg p-2 shrink-0 ${config.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm leading-snug">
                      {event.headline}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      {school && (
                        <span className="font-medium" style={{ color: school.primaryColor }}>
                          {school.shortName}
                        </span>
                      )}
                      {event.source && <span>{event.source}</span>}
                      <span title={formatDate(event.event_date)}>
                        {formatRelativeTime(event.event_date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge className={sentiment.className}>
                      {sentiment.label}
                    </Badge>
                    <Badge className={SEVERITY_STYLES[event.severity] ?? SEVERITY_STYLES.medium}>
                      {event.severity}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

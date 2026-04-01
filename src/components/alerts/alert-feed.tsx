'use client'

import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { SEED_ALERTS } from '@/lib/seed-data/alerts'
import { LegacyAlert as Alert } from "@/types/database"
import { AlertCard } from './alert-card'
import { Bell } from 'lucide-react'

export function AlertFeed() {
  const { selectedSchool } = useSchoolFilter()
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredAlerts = useMemo(() => {
    let result = [...alerts]

    if (selectedSchool !== 'all') {
      result = result.filter((a) => a.school_id === selectedSchool)
    }
    if (severityFilter !== 'all') {
      result = result.filter((a) => a.severity === severityFilter)
    }
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.alert_type === typeFilter)
    }

    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [alerts, selectedSchool, severityFilter, typeFilter])

  const totalCount = filteredAlerts.length
  const unreadCount = filteredAlerts.filter((a) => !a.is_read).length

  const alertTypes = useMemo(() => {
    const types = new Set(alerts.map((a) => a.alert_type))
    return Array.from(types).sort()
  }, [alerts])

  function handleMarkRead(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
    )
  }

  const ALERT_TYPE_LABELS: Record<string, string> = {
    'sentiment-drop': 'Sentiment Drop',
    'ncaa-violation': 'NCAA Violation',
    'coaching-change': 'Coaching Change',
    'media-spike': 'Media Spike',
    'chronicle-complaint': 'Chronicle Complaint',
    'budget-threshold': 'Budget Threshold',
    'title-ix': 'Title IX',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{totalCount} alerts</span>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-blue-100 text-blue-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {alertTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {ALERT_TYPE_LABELS[type] ?? type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No alerts found"
          description="No alerts match your current filters."
        />
      ) : (
        <div className="space-y-2">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}

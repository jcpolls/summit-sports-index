'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RoleGuard } from '@/components/shared/role-guard'
import { EmptyState } from '@/components/shared/empty-state'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { formatDate } from '@/lib/utils/format'
import { SEED_REPUTATION_EVENTS } from '@/lib/seed-data/reputation-events'
import { SCHOOLS } from '@/lib/constants/schools'
import { FileWarning } from 'lucide-react'

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}

export function ChronicleComplaints() {
  const { selectedSchool } = useSchoolFilter()

  const complaints = SEED_REPUTATION_EVENTS.filter((e) => {
    if (e.event_type !== 'chronicle-complaint') return false
    if (selectedSchool !== 'all' && e.school_id !== selectedSchool) return false
    return true
  }).sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  )

  return (
    <RoleGuard allowedRoles={['admin', 'researcher']}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-orange-600" />
            Chronicle Complaints
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <EmptyState
              title="No complaints found"
              description="No Chronicle complaints match your current filters."
            />
          ) : (
            <div className="space-y-3">
              {complaints.map((complaint) => {
                const school = SCHOOLS.find((s) => s.slug === complaint.school_id)
                return (
                  <Card key={complaint.id}>
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <p className="font-medium text-sm leading-snug">
                            {complaint.headline}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {school && (
                              <span className="font-medium" style={{ color: school.primaryColor }}>
                                {school.shortName}
                              </span>
                            )}
                            <span>{complaint.source}</span>
                            <span>{formatDate(complaint.event_date)}</span>
                          </div>
                        </div>
                        <Badge
                          className={SEVERITY_STYLES[complaint.severity] ?? SEVERITY_STYLES.medium}
                        >
                          {complaint.severity}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleGuard>
  )
}

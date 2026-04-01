'use client'

import { ComplianceStatus } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const STATUS_CONFIG: Record<
  ComplianceStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  compliant: {
    label: 'Compliant',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
  },
  'under-review': {
    label: 'Under Review',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: AlertTriangle,
  },
  'non-compliant': {
    label: 'Non-Compliant',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
}

interface ComplianceIndicatorProps {
  status: ComplianceStatus
}

export function ComplianceIndicator({ status }: ComplianceIndicatorProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}

'use client'

import { useRole } from '@/lib/providers/role-provider'
import { ROLES, ROLE_LABELS } from '@/lib/constants/roles'
import { cn } from '@/lib/utils'
import { Role } from '@/types/database'

const ROLE_ACTIVE_COLORS: Record<Role, string> = {
  admin: 'bg-blue-600 text-white',
  donor: 'bg-green-600 text-white',
  researcher: 'bg-purple-600 text-white',
}

export function RoleToggle() {
  const { role, setRole } = useRole()

  return (
    <div className="flex items-center rounded-lg border bg-muted p-0.5">
      {ROLES.map((r) => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            role === r ? ROLE_ACTIVE_COLORS[r] : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {ROLE_LABELS[r]}
        </button>
      ))}
    </div>
  )
}

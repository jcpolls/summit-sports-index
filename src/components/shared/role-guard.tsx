'use client'

import { useRole } from '@/lib/providers/role-provider'
import { Role } from '@/types/database'
import { ReactNode } from 'react'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { role } = useRole()
  if (!allowedRoles.includes(role)) return <>{fallback}</>
  return <>{children}</>
}

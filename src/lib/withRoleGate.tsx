'use client'

import { ReactNode } from 'react'
import { useRole } from '@/lib/contexts/app-contexts'
import type { Role } from '@/lib/contexts/app-contexts'

interface RoleGateProps {
  allowedRoles: Role[]
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders children only when current role is in allowedRoles.
 * Otherwise renders fallback (default: null).
 *
 * Usage:
 *   <RoleGate allowedRoles={['admin', 'researcher']} fallback={<AnonDonorLabel />}>
 *     <DonorName name={donor.name} />
 *   </RoleGate>
 */
export function RoleGate({ allowedRoles, fallback = null, children }: RoleGateProps) {
  const { role } = useRole()
  if (!allowedRoles.includes(role)) return <>{fallback}</>
  return <>{children}</>
}

/**
 * Higher-order component variant.
 * Wraps a component so it only renders for allowed roles.
 *
 * Usage:
 *   const AdminOnly = withRoleGate(MyComponent, ['admin'])
 */
export function withRoleGate<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Role[],
  fallback: ReactNode = null
) {
  const Wrapped = (props: P) => (
    <RoleGate allowedRoles={allowedRoles} fallback={fallback}>
      <Component {...props} />
    </RoleGate>
  )
  Wrapped.displayName = `withRoleGate(${Component.displayName ?? Component.name})`
  return Wrapped
}

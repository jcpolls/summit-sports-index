'use client'
// Thin shim — contexts are now provided by RootLayout via app-contexts
export { useRole } from '@/lib/contexts/app-contexts'
export type { Role } from '@/lib/contexts/app-contexts'

import { ReactNode } from 'react'
export function RoleProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

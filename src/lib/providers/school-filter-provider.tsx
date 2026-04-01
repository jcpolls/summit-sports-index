'use client'
// Thin shim — contexts are now provided by RootLayout via app-contexts
export { useSchoolFilter, useSelectedSchool } from '@/lib/contexts/app-contexts'

import { ReactNode } from 'react'
export function SchoolFilterProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

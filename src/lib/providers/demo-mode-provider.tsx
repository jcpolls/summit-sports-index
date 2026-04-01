'use client'
// Thin shim — contexts are now provided by RootLayout via app-contexts
export { useDemoMode } from '@/lib/contexts/app-contexts'

import { ReactNode } from 'react'
export function DemoModeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

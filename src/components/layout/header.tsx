'use client'

import { RoleToggle } from './role-toggle'
import { DemoModeToggle } from './demo-mode-toggle'
import { SchoolSelector } from './school-selector'
import { MobileNav } from './mobile-nav'
import { Separator } from '@/components/ui/separator'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3 bg-card">
      <div className="flex items-center gap-3">
        <MobileNav />
        <SchoolSelector />
      </div>
      <div className="flex items-center gap-3">
        <DemoModeToggle />
        <Separator orientation="vertical" className="h-6" />
        <RoleToggle />
      </div>
    </header>
  )
}

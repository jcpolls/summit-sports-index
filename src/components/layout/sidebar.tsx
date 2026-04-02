'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TABS } from '@/lib/constants/tabs'
import { cn } from '@/lib/utils'
import { Mountain } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 border-r bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Mountain className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-sm font-bold leading-tight">AthletIQ</h1>
          <p className="text-[10px] text-muted-foreground">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t px-4 py-3">
        <p className="text-[10px] text-muted-foreground">
          AthletIQ v1.0
        </p>
      </div>
    </aside>
  )
}

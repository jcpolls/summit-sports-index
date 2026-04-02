'use client'

import { useState, ReactNode } from 'react'
import localFont from 'next/font/local'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './globals.css'
import { SCHOOLS } from '@/lib/constants/schools'
import { Bell, LayoutDashboard, Trophy, Scale, Heart, Eye, BellRing, Settings } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Role,
  RoleContext,
  SchoolContext,
  DemoModeContext,
  useRole,
  useSelectedSchool,
  useDemoMode,
} from '@/lib/contexts/app-contexts'
import { getRecentHighConfidenceCount } from '@/lib/seed-data/coach-events'
import { AlertFeed } from '@/components/alerts/AlertFeed'
import { DataFreshnessBar } from '@/components/layout/DataFreshnessBar'

// ─── Fonts ────────────────────────────────────────────────────────────────────
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Rankings', href: '/rankings', icon: Trophy },
  { label: 'Title IX / EADA', href: '/title-ix', icon: Scale },
  { label: 'Donor Tracker', href: '/donor-tracker', icon: Heart },
  { label: 'Reputation Watch', href: '/reputation', icon: Eye },
  { label: 'Alerts', href: '/alerts', icon: BellRing },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const ROLES: Role[] = ['admin', 'donor', 'researcher']

// ─── App Nav ──────────────────────────────────────────────────────────────────
function AppNav() {
  const { role, setRole } = useRole()
  const { selectedSchool, setSelectedSchool } = useSelectedSchool()
  const { demoMode, setDemoMode } = useDemoMode()
  const pathname = usePathname()
  const [bellOpen, setBellOpen] = useState(false)
  const alertCount = getRecentHighConfidenceCount()

  return (
    <header className="border-b bg-background">
      {/* Top bar */}
      <div className="flex h-14 items-center gap-4 px-6">
        <span className="text-lg font-bold tracking-tight mr-2">
          Athlet<span className="text-blue-600">IQ</span>
        </span>

        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCHOOLS.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Role segmented control */}
        <div className="flex items-center rounded-md border overflow-hidden">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                role === r
                  ? 'bg-foreground text-background'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Demo mode toggle */}
        <button onClick={() => setDemoMode(!demoMode)}>
          <Badge
            variant={demoMode ? 'default' : 'outline'}
            className={demoMode ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'cursor-pointer'}
          >
            {demoMode ? 'Demo ON' : 'Demo OFF'}
          </Badge>
        </button>

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-md hover:bg-muted transition-colors"
          onClick={() => setBellOpen(true)}
          aria-label="Open recent alerts"
        >
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* Bell Sheet — high-confidence events from last 7 days */}
        <Sheet open={bellOpen} onOpenChange={setBellOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Recent High-Confidence Alerts
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                Coach events with ≥80% confidence detected in the last 7 days.
              </p>
            </SheetHeader>
            <AlertFeed compact />
          </SheetContent>
        </Sheet>
      </div>

      {/* Tab bar */}
      <nav className="flex items-center gap-1 px-6">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                active
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

// ─── Providers ────────────────────────────────────────────────────────────────
function Providers({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('admin')
  const [selectedSchool, setSelectedSchool] = useState('michigan')
  const [demoMode, setDemoMode] = useState(true)

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <SchoolContext.Provider value={{ selectedSchool, setSelectedSchool }}>
        <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
          {children}
        </DemoModeContext.Provider>
      </SchoolContext.Provider>
    </RoleContext.Provider>
  )
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <Providers>
          <div className="flex h-screen flex-col overflow-hidden">
            <AppNav />
            <main className="flex-1 overflow-auto bg-background">
              <div className="max-w-screen-2xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>
            <DataFreshnessBar />
          </div>
        </Providers>
      </body>
    </html>
  )
}

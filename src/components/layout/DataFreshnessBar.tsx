'use client'

import { useDemoMode } from '@/lib/contexts/app-contexts'

interface Source {
  label: string
  demoMinutesAgo: number
  liveLastScraped: string | null
}

const SOURCES: Source[] = [
  { label: 'Donors', demoMinutesAgo: 18, liveLastScraped: null },
  { label: 'Social Media', demoMinutesAgo: 12, liveLastScraped: null },
  { label: 'Campus News', demoMinutesAgo: 31, liveLastScraped: null },
  { label: 'Coach Monitor', demoMinutesAgo: 45, liveLastScraped: null },
]

function freshnessColor(minutesAgo: number): string {
  if (minutesAgo < 60) return 'text-green-600'
  if (minutesAgo < 1440) return 'text-amber-500'
  return 'text-red-500'
}

function freshnessLabel(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo}m ago`
  if (minutesAgo < 1440) return `${Math.round(minutesAgo / 60)}h ago`
  return `${Math.round(minutesAgo / 1440)}d ago`
}

function freshnessIndicator(minutesAgo: number): string {
  if (minutesAgo < 60) return 'bg-green-500'
  if (minutesAgo < 1440) return 'bg-amber-400'
  return 'bg-red-500'
}

export function DataFreshnessBar() {
  const { demoMode } = useDemoMode()

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-2 flex items-center gap-6 overflow-x-auto shrink-0">
      <span className="label-xs shrink-0">Data Freshness</span>
      {SOURCES.map((source) => {
        const minutesAgo = demoMode
          ? source.demoMinutesAgo
          : source.liveLastScraped
          ? Math.round((Date.now() - new Date(source.liveLastScraped).getTime()) / 60000)
          : 9999

        return (
          <div key={source.label} className="flex items-center gap-1.5 shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${freshnessIndicator(minutesAgo)}`} />
            <span className="text-[11px] text-gray-500">{source.label}</span>
            <span className={`text-[11px] font-semibold ${freshnessColor(minutesAgo)}`}>
              {minutesAgo >= 9999 ? 'Never' : freshnessLabel(minutesAgo)}
            </span>
          </div>
        )
      })}
      <div className="flex-1" />
      <span className="label-xs text-gray-300">AthletIQ v1.0</span>
    </div>
  )
}

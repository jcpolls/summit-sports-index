'use client'

import { AlertFeed } from '@/components/alerts/AlertFeed'
import { AlertSetup } from '@/components/alerts/AlertSetup'

export default function AlertsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Coach movement intelligence — hires, departures, contract extensions, and rumors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Alert feed — 2/3 width */}
        <div className="lg:col-span-2">
          <AlertFeed />
        </div>

        {/* Right: Alert configuration — 1/3 width */}
        <div className="lg:col-span-1">
          <AlertSetup />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useSelectedSchool } from '@/lib/contexts/app-contexts'
import { LiveTicker } from '@/components/donor/LiveTicker'
import { YtdBySportChart } from '@/components/donor/YtdBySportChart'
import { MonthlyTrendChart } from '@/components/donor/MonthlyTrendChart'
import { PeerComparisonChart } from '@/components/donor/PeerComparisonChart'
import { DonorTable } from '@/components/donor/DonorTable'
import { INSTITUTION_META } from '@/lib/seed-data/scoring-seed'

export default function DonorTrackerPage() {
  const { selectedSchool } = useSelectedSchool()

  // Default to 'michigan' if 'all' is selected (all isn't meaningful for donor tracker)
  const institutionId = selectedSchool === 'all' ? 'michigan' : selectedSchool
  const meta = INSTITUTION_META[institutionId]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Donor Tracker</h2>
        <p className="text-sm text-muted-foreground">
          {meta?.name ?? institutionId} — public donation records and giving trends
        </p>
      </div>

      {/* Main 2/3 + 1/3 grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left: charts */}
        <div className="space-y-6 min-w-0">
          <YtdBySportChart institutionId={institutionId} />
          <MonthlyTrendChart institutionId={institutionId} />
          <PeerComparisonChart institutionId={institutionId} />
        </div>

        {/* Right: live ticker */}
        <div
          className="rounded-lg border bg-card p-4 sticky top-4"
          style={{ height: 'calc(100vh - 12rem)', maxHeight: '700px' }}
        >
          <LiveTicker institutionId={institutionId} />
        </div>
      </div>

      {/* Donor table */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Donor Leaderboard</h3>
        <DonorTable institutionId={institutionId} />
      </div>
    </div>
  )
}

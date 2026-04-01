'use client'

import { DonorTable } from '@/components/donors/donor-table'
import { DonationHistoryChart } from '@/components/donors/donation-history-chart'

export default function DonorsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donor Tracker</h2>
          <p className="text-sm text-muted-foreground">
            Athletic department donor management and giving trends
          </p>
        </div>
        <DonationHistoryChart />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">All Donors</h3>
          <p className="text-sm text-muted-foreground">
            Click a row to view donor details (admin and donor roles only)
          </p>
        </div>
        <DonorTable />
      </section>
    </div>
  )
}

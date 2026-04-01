'use client'

import { useState } from 'react'
import { TitleIXSummary } from '@/components/title-ix/title-ix-summary'
import { EadaChart } from '@/components/title-ix/eada-chart'
import { FinancialBreakdown } from '@/components/title-ix/financial-breakdown'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const YEARS = [2024, 2023, 2022]

export default function TitleIXPage() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const { selectedSchool } = useSchoolFilter()

  return (
    <div className="space-y-8">
      {/* Title IX Compliance Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Title IX Compliance</h2>
            <p className="text-sm text-muted-foreground">
              Gender equity participation data and compliance status
            </p>
          </div>
          <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TitleIXSummary selectedYear={selectedYear} />
      </section>

      <Separator />

      {/* EADA Financials Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">EADA Financials</h2>
          <p className="text-sm text-muted-foreground">
            Equity in Athletics Disclosure Act financial reporting
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <EadaChart selectedSchool={selectedSchool} />
          <FinancialBreakdown />
        </div>
      </section>
    </div>
  )
}

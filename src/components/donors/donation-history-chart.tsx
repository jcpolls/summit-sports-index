'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer } from '@/components/shared/chart-container'
import { formatCurrency } from '@/lib/utils/format'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { Donation } from '@/types/database'

const DESIGNATIONS = [
  'athletics-general',
  'football',
  'facilities',
  'scholarships',
] as const

const DESIGNATION_COLORS: Record<string, string> = {
  'athletics-general': '#3b82f6',
  football: '#10b981',
  facilities: '#f59e0b',
  scholarships: '#8b5cf6',
}

const DESIGNATION_LABELS: Record<string, string> = {
  'athletics-general': 'Athletics General',
  football: 'Football',
  facilities: 'Facilities',
  scholarships: 'Scholarships',
}

// 150 donations (30 per school, spread across years and designations)
function generateDonations(): Donation[] {
  const donations: Donation[] = []
  const schools = ['michigan', 'alabama', 'oregon', 'duke', 'kansas']
  const donorIdsBySchool: Record<string, string[]> = {
    michigan: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10'],
    alabama: ['d11', 'd12', 'd13', 'd14', 'd15', 'd16', 'd17', 'd18', 'd19', 'd20'],
    oregon: ['d21', 'd22', 'd23', 'd24', 'd25', 'd26', 'd27', 'd28', 'd29', 'd30'],
    duke: ['d31', 'd32', 'd33', 'd34', 'd35', 'd36', 'd37', 'd38', 'd39', 'd40'],
    kansas: ['d41', 'd42', 'd43', 'd44', 'd45', 'd46', 'd47', 'd48', 'd49', 'd50'],
  }

  // Gift amounts in cents by donor tier approximate
  const amounts = [
    50000000, 25000000, 10000000, 5000000, 2500000,
    1000000, 500000, 250000, 100000, 75000000,
  ]

  let idx = 0
  for (const school of schools) {
    const donorIds = donorIdsBySchool[school]
    for (let fy = 2022; fy <= 2024; fy++) {
      for (let d = 0; d < 10; d++) {
        const donorId = donorIds[d]
        const designation = DESIGNATIONS[d % 4]
        const month = ((d * 3) % 12) + 1
        const day = ((d * 7) % 28) + 1
        const giftDate = `${fy}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const amount = amounts[d] * (1 + (fy - 2022) * 0.08)

        donations.push({
          id: `don-${idx}`,
          donor_id: donorId,
          school_id: school,
          amount: Math.round(amount),
          designation,
          gift_date: giftDate,
          fiscal_year: fy,
          payment_type: d < 5 ? 'wire' : d < 8 ? 'check' : 'credit-card',
          is_anonymous: false,
          is_demo: true,
          created_at: giftDate,
        })
        idx++
      }
    }
  }

  return donations
}

const SEED_DONATIONS = generateDonations()

export function DonationHistoryChart() {
  const { selectedSchool } = useSchoolFilter()

  const chartData = useMemo(() => {
    const filtered =
      selectedSchool === 'all'
        ? SEED_DONATIONS
        : SEED_DONATIONS.filter((d) => d.school_id === selectedSchool)

    const byYear: Record<number, Record<string, number>> = {}
    for (const d of filtered) {
      if (!byYear[d.fiscal_year]) {
        byYear[d.fiscal_year] = {}
      }
      byYear[d.fiscal_year][d.designation] =
        (byYear[d.fiscal_year][d.designation] || 0) + d.amount
    }

    return Object.entries(byYear)
      .map(([year, designations]) => ({
        year: Number(year),
        ...designations,
      }))
      .sort((a, b) => a.year - b.year)
  }, [selectedSchool])

  return (
    <ChartContainer
      title="Donation History by Fiscal Year"
      description="Total donations stacked by designation"
      height={350}
    >
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(v: number) => formatCurrency(v)}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: unknown, name: unknown) => [
            formatCurrency(Number(value)),
            DESIGNATION_LABELS[String(name)] || String(name),
          ]}
        />
        <Legend
          formatter={(value: string) => DESIGNATION_LABELS[value] || value}
        />
        {DESIGNATIONS.map((des) => (
          <Area
            key={des}
            type="monotone"
            dataKey={des}
            stackId="1"
            fill={DESIGNATION_COLORS[des]}
            stroke={DESIGNATION_COLORS[des]}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

export { SEED_DONATIONS }

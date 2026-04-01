'use client'

import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer } from '@/components/shared/chart-container'
import { formatCurrency } from '@/lib/utils/format'
import { SEED_EADA } from '@/components/title-ix/eada-chart'
import { SCHOOLS } from '@/lib/constants/schools'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const YEARS = [2024, 2023, 2022]

const CATEGORY_COLORS: Record<string, string> = {
  'Coaching (M)': '#3b82f6',
  'Coaching (F)': '#8b5cf6',
  Recruiting: '#f59e0b',
  'Scholarships (M)': '#10b981',
  'Scholarships (F)': '#ec4899',
  Operating: '#6b7280',
}

export function FinancialBreakdown() {
  const [selectedYear, setSelectedYear] = useState(2024)

  const chartData = useMemo(() => {
    return SCHOOLS.map((school) => {
      const records = SEED_EADA.filter(
        (d) => d.school_id === school.slug && d.reporting_year === selectedYear
      )
      const totals = records.reduce(
        (acc, d) => ({
          'Coaching (M)': acc['Coaching (M)'] + d.coaching_salaries_m,
          'Coaching (F)': acc['Coaching (F)'] + d.coaching_salaries_f,
          Recruiting: acc.Recruiting + d.recruiting_expenses,
          'Scholarships (M)': acc['Scholarships (M)'] + d.scholarships_m,
          'Scholarships (F)': acc['Scholarships (F)'] + d.scholarships_f,
          Operating: acc.Operating + d.operating_expenses,
        }),
        {
          'Coaching (M)': 0,
          'Coaching (F)': 0,
          Recruiting: 0,
          'Scholarships (M)': 0,
          'Scholarships (F)': 0,
          Operating: 0,
        }
      )
      return { school: school.shortName, ...totals }
    })
  }, [selectedYear])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
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
      <ChartContainer
        title="Expense Breakdown by School"
        description="Stacked expenses across all sports by category"
        height={380}
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="school" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v: number) => formatCurrency(v)}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
          <Legend />
          {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="expenses"
              fill={color}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}

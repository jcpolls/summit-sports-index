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
import { EadaFinancial } from '@/types/database'
import { SCHOOLS } from '@/lib/constants/schools'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SEED_EADA: EadaFinancial[] = [
  // Michigan 2024
  { id: 'e1', school_id: 'michigan', reporting_year: 2024, sport: 'Football', total_revenue: 18500000000, total_expenses: 5200000000, coaching_salaries_m: 1250000000, coaching_salaries_f: 0, recruiting_expenses: 320000000, scholarships_m: 980000000, scholarships_f: 0, operating_expenses: 1450000000, profit_loss: 13300000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e2', school_id: 'michigan', reporting_year: 2024, sport: "Men's Basketball", total_revenue: 4800000000, total_expenses: 2100000000, coaching_salaries_m: 650000000, coaching_salaries_f: 0, recruiting_expenses: 180000000, scholarships_m: 420000000, scholarships_f: 0, operating_expenses: 550000000, profit_loss: 2700000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e3', school_id: 'michigan', reporting_year: 2024, sport: "Women's Basketball", total_revenue: 950000000, total_expenses: 1200000000, coaching_salaries_m: 0, coaching_salaries_f: 380000000, recruiting_expenses: 120000000, scholarships_m: 0, scholarships_f: 350000000, operating_expenses: 280000000, profit_loss: -250000000, is_demo: true, created_at: '2024-10-01' },
  // Michigan 2023
  { id: 'e4', school_id: 'michigan', reporting_year: 2023, sport: 'Football', total_revenue: 17200000000, total_expenses: 4900000000, coaching_salaries_m: 1180000000, coaching_salaries_f: 0, recruiting_expenses: 290000000, scholarships_m: 940000000, scholarships_f: 0, operating_expenses: 1380000000, profit_loss: 12300000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e5', school_id: 'michigan', reporting_year: 2023, sport: "Men's Basketball", total_revenue: 4500000000, total_expenses: 1950000000, coaching_salaries_m: 620000000, coaching_salaries_f: 0, recruiting_expenses: 165000000, scholarships_m: 400000000, scholarships_f: 0, operating_expenses: 520000000, profit_loss: 2550000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e6', school_id: 'michigan', reporting_year: 2023, sport: "Women's Basketball", total_revenue: 880000000, total_expenses: 1100000000, coaching_salaries_m: 0, coaching_salaries_f: 360000000, recruiting_expenses: 110000000, scholarships_m: 0, scholarships_f: 330000000, operating_expenses: 250000000, profit_loss: -220000000, is_demo: true, created_at: '2023-10-01' },
  // Michigan 2022
  { id: 'e7', school_id: 'michigan', reporting_year: 2022, sport: 'Football', total_revenue: 16100000000, total_expenses: 4600000000, coaching_salaries_m: 1100000000, coaching_salaries_f: 0, recruiting_expenses: 270000000, scholarships_m: 900000000, scholarships_f: 0, operating_expenses: 1300000000, profit_loss: 11500000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e8', school_id: 'michigan', reporting_year: 2022, sport: "Men's Basketball", total_revenue: 4200000000, total_expenses: 1800000000, coaching_salaries_m: 580000000, coaching_salaries_f: 0, recruiting_expenses: 150000000, scholarships_m: 380000000, scholarships_f: 0, operating_expenses: 480000000, profit_loss: 2400000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e9', school_id: 'michigan', reporting_year: 2022, sport: "Women's Basketball", total_revenue: 810000000, total_expenses: 1020000000, coaching_salaries_m: 0, coaching_salaries_f: 340000000, recruiting_expenses: 100000000, scholarships_m: 0, scholarships_f: 310000000, operating_expenses: 230000000, profit_loss: -210000000, is_demo: true, created_at: '2022-10-01' },
  // Alabama 2024
  { id: 'e10', school_id: 'alabama', reporting_year: 2024, sport: 'Football', total_revenue: 21200000000, total_expenses: 7800000000, coaching_salaries_m: 2100000000, coaching_salaries_f: 0, recruiting_expenses: 450000000, scholarships_m: 1100000000, scholarships_f: 0, operating_expenses: 2200000000, profit_loss: 13400000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e11', school_id: 'alabama', reporting_year: 2024, sport: "Men's Basketball", total_revenue: 3200000000, total_expenses: 1800000000, coaching_salaries_m: 550000000, coaching_salaries_f: 0, recruiting_expenses: 140000000, scholarships_m: 380000000, scholarships_f: 0, operating_expenses: 480000000, profit_loss: 1400000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e12', school_id: 'alabama', reporting_year: 2024, sport: "Women's Basketball", total_revenue: 520000000, total_expenses: 780000000, coaching_salaries_m: 0, coaching_salaries_f: 280000000, recruiting_expenses: 80000000, scholarships_m: 0, scholarships_f: 240000000, operating_expenses: 150000000, profit_loss: -260000000, is_demo: true, created_at: '2024-10-01' },
  // Alabama 2023
  { id: 'e13', school_id: 'alabama', reporting_year: 2023, sport: 'Football', total_revenue: 19800000000, total_expenses: 7200000000, coaching_salaries_m: 1950000000, coaching_salaries_f: 0, recruiting_expenses: 420000000, scholarships_m: 1050000000, scholarships_f: 0, operating_expenses: 2050000000, profit_loss: 12600000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e14', school_id: 'alabama', reporting_year: 2023, sport: "Men's Basketball", total_revenue: 2900000000, total_expenses: 1650000000, coaching_salaries_m: 520000000, coaching_salaries_f: 0, recruiting_expenses: 130000000, scholarships_m: 360000000, scholarships_f: 0, operating_expenses: 440000000, profit_loss: 1250000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e15', school_id: 'alabama', reporting_year: 2023, sport: "Women's Basketball", total_revenue: 480000000, total_expenses: 720000000, coaching_salaries_m: 0, coaching_salaries_f: 260000000, recruiting_expenses: 70000000, scholarships_m: 0, scholarships_f: 220000000, operating_expenses: 140000000, profit_loss: -240000000, is_demo: true, created_at: '2023-10-01' },
  // Alabama 2022
  { id: 'e16', school_id: 'alabama', reporting_year: 2022, sport: 'Football', total_revenue: 18500000000, total_expenses: 6800000000, coaching_salaries_m: 1800000000, coaching_salaries_f: 0, recruiting_expenses: 390000000, scholarships_m: 1000000000, scholarships_f: 0, operating_expenses: 1900000000, profit_loss: 11700000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e17', school_id: 'alabama', reporting_year: 2022, sport: "Men's Basketball", total_revenue: 2700000000, total_expenses: 1500000000, coaching_salaries_m: 480000000, coaching_salaries_f: 0, recruiting_expenses: 120000000, scholarships_m: 340000000, scholarships_f: 0, operating_expenses: 410000000, profit_loss: 1200000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e18', school_id: 'alabama', reporting_year: 2022, sport: "Women's Basketball", total_revenue: 440000000, total_expenses: 680000000, coaching_salaries_m: 0, coaching_salaries_f: 240000000, recruiting_expenses: 65000000, scholarships_m: 0, scholarships_f: 200000000, operating_expenses: 130000000, profit_loss: -240000000, is_demo: true, created_at: '2022-10-01' },
  // Oregon 2024
  { id: 'e19', school_id: 'oregon', reporting_year: 2024, sport: 'Football', total_revenue: 12800000000, total_expenses: 6200000000, coaching_salaries_m: 1600000000, coaching_salaries_f: 0, recruiting_expenses: 380000000, scholarships_m: 950000000, scholarships_f: 0, operating_expenses: 1800000000, profit_loss: 6600000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e20', school_id: 'oregon', reporting_year: 2024, sport: "Men's Basketball", total_revenue: 2400000000, total_expenses: 1400000000, coaching_salaries_m: 480000000, coaching_salaries_f: 0, recruiting_expenses: 110000000, scholarships_m: 320000000, scholarships_f: 0, operating_expenses: 380000000, profit_loss: 1000000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e21', school_id: 'oregon', reporting_year: 2024, sport: "Women's Basketball", total_revenue: 620000000, total_expenses: 850000000, coaching_salaries_m: 0, coaching_salaries_f: 310000000, recruiting_expenses: 90000000, scholarships_m: 0, scholarships_f: 280000000, operating_expenses: 150000000, profit_loss: -230000000, is_demo: true, created_at: '2024-10-01' },
  // Oregon 2023
  { id: 'e22', school_id: 'oregon', reporting_year: 2023, sport: 'Football', total_revenue: 11900000000, total_expenses: 5800000000, coaching_salaries_m: 1500000000, coaching_salaries_f: 0, recruiting_expenses: 350000000, scholarships_m: 900000000, scholarships_f: 0, operating_expenses: 1650000000, profit_loss: 6100000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e23', school_id: 'oregon', reporting_year: 2023, sport: "Men's Basketball", total_revenue: 2200000000, total_expenses: 1300000000, coaching_salaries_m: 450000000, coaching_salaries_f: 0, recruiting_expenses: 100000000, scholarships_m: 300000000, scholarships_f: 0, operating_expenses: 350000000, profit_loss: 900000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e24', school_id: 'oregon', reporting_year: 2023, sport: "Women's Basketball", total_revenue: 560000000, total_expenses: 790000000, coaching_salaries_m: 0, coaching_salaries_f: 290000000, recruiting_expenses: 80000000, scholarships_m: 0, scholarships_f: 260000000, operating_expenses: 130000000, profit_loss: -230000000, is_demo: true, created_at: '2023-10-01' },
  // Oregon 2022
  { id: 'e25', school_id: 'oregon', reporting_year: 2022, sport: 'Football', total_revenue: 11200000000, total_expenses: 5400000000, coaching_salaries_m: 1400000000, coaching_salaries_f: 0, recruiting_expenses: 320000000, scholarships_m: 860000000, scholarships_f: 0, operating_expenses: 1520000000, profit_loss: 5800000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e26', school_id: 'oregon', reporting_year: 2022, sport: "Men's Basketball", total_revenue: 2050000000, total_expenses: 1200000000, coaching_salaries_m: 420000000, coaching_salaries_f: 0, recruiting_expenses: 90000000, scholarships_m: 280000000, scholarships_f: 0, operating_expenses: 320000000, profit_loss: 850000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e27', school_id: 'oregon', reporting_year: 2022, sport: "Women's Basketball", total_revenue: 510000000, total_expenses: 740000000, coaching_salaries_m: 0, coaching_salaries_f: 270000000, recruiting_expenses: 75000000, scholarships_m: 0, scholarships_f: 240000000, operating_expenses: 120000000, profit_loss: -230000000, is_demo: true, created_at: '2022-10-01' },
  // Duke 2024
  { id: 'e28', school_id: 'duke', reporting_year: 2024, sport: 'Football', total_revenue: 3200000000, total_expenses: 3800000000, coaching_salaries_m: 950000000, coaching_salaries_f: 0, recruiting_expenses: 200000000, scholarships_m: 680000000, scholarships_f: 0, operating_expenses: 1100000000, profit_loss: -600000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e29', school_id: 'duke', reporting_year: 2024, sport: "Men's Basketball", total_revenue: 6800000000, total_expenses: 3100000000, coaching_salaries_m: 1200000000, coaching_salaries_f: 0, recruiting_expenses: 250000000, scholarships_m: 450000000, scholarships_f: 0, operating_expenses: 680000000, profit_loss: 3700000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e30', school_id: 'duke', reporting_year: 2024, sport: "Women's Basketball", total_revenue: 780000000, total_expenses: 920000000, coaching_salaries_m: 0, coaching_salaries_f: 350000000, recruiting_expenses: 95000000, scholarships_m: 0, scholarships_f: 300000000, operating_expenses: 160000000, profit_loss: -140000000, is_demo: true, created_at: '2024-10-01' },
  // Duke 2023
  { id: 'e31', school_id: 'duke', reporting_year: 2023, sport: 'Football', total_revenue: 2900000000, total_expenses: 3500000000, coaching_salaries_m: 900000000, coaching_salaries_f: 0, recruiting_expenses: 185000000, scholarships_m: 650000000, scholarships_f: 0, operating_expenses: 1020000000, profit_loss: -600000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e32', school_id: 'duke', reporting_year: 2023, sport: "Men's Basketball", total_revenue: 6500000000, total_expenses: 2900000000, coaching_salaries_m: 1150000000, coaching_salaries_f: 0, recruiting_expenses: 230000000, scholarships_m: 430000000, scholarships_f: 0, operating_expenses: 640000000, profit_loss: 3600000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e33', school_id: 'duke', reporting_year: 2023, sport: "Women's Basketball", total_revenue: 720000000, total_expenses: 860000000, coaching_salaries_m: 0, coaching_salaries_f: 330000000, recruiting_expenses: 85000000, scholarships_m: 0, scholarships_f: 280000000, operating_expenses: 140000000, profit_loss: -140000000, is_demo: true, created_at: '2023-10-01' },
  // Duke 2022
  { id: 'e34', school_id: 'duke', reporting_year: 2022, sport: 'Football', total_revenue: 2700000000, total_expenses: 3300000000, coaching_salaries_m: 850000000, coaching_salaries_f: 0, recruiting_expenses: 170000000, scholarships_m: 620000000, scholarships_f: 0, operating_expenses: 960000000, profit_loss: -600000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e35', school_id: 'duke', reporting_year: 2022, sport: "Men's Basketball", total_revenue: 6200000000, total_expenses: 2700000000, coaching_salaries_m: 1100000000, coaching_salaries_f: 0, recruiting_expenses: 210000000, scholarships_m: 410000000, scholarships_f: 0, operating_expenses: 600000000, profit_loss: 3500000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e36', school_id: 'duke', reporting_year: 2022, sport: "Women's Basketball", total_revenue: 670000000, total_expenses: 800000000, coaching_salaries_m: 0, coaching_salaries_f: 310000000, recruiting_expenses: 78000000, scholarships_m: 0, scholarships_f: 260000000, operating_expenses: 130000000, profit_loss: -130000000, is_demo: true, created_at: '2022-10-01' },
  // Kansas 2024
  { id: 'e37', school_id: 'kansas', reporting_year: 2024, sport: 'Football', total_revenue: 4500000000, total_expenses: 4200000000, coaching_salaries_m: 1050000000, coaching_salaries_f: 0, recruiting_expenses: 240000000, scholarships_m: 720000000, scholarships_f: 0, operating_expenses: 1250000000, profit_loss: 300000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e38', school_id: 'kansas', reporting_year: 2024, sport: "Men's Basketball", total_revenue: 5200000000, total_expenses: 2400000000, coaching_salaries_m: 850000000, coaching_salaries_f: 0, recruiting_expenses: 200000000, scholarships_m: 410000000, scholarships_f: 0, operating_expenses: 600000000, profit_loss: 2800000000, is_demo: true, created_at: '2024-10-01' },
  { id: 'e39', school_id: 'kansas', reporting_year: 2024, sport: "Women's Basketball", total_revenue: 410000000, total_expenses: 650000000, coaching_salaries_m: 0, coaching_salaries_f: 240000000, recruiting_expenses: 65000000, scholarships_m: 0, scholarships_f: 210000000, operating_expenses: 120000000, profit_loss: -240000000, is_demo: true, created_at: '2024-10-01' },
  // Kansas 2023
  { id: 'e40', school_id: 'kansas', reporting_year: 2023, sport: 'Football', total_revenue: 4100000000, total_expenses: 3900000000, coaching_salaries_m: 980000000, coaching_salaries_f: 0, recruiting_expenses: 220000000, scholarships_m: 690000000, scholarships_f: 0, operating_expenses: 1150000000, profit_loss: 200000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e41', school_id: 'kansas', reporting_year: 2023, sport: "Men's Basketball", total_revenue: 4900000000, total_expenses: 2200000000, coaching_salaries_m: 800000000, coaching_salaries_f: 0, recruiting_expenses: 185000000, scholarships_m: 390000000, scholarships_f: 0, operating_expenses: 560000000, profit_loss: 2700000000, is_demo: true, created_at: '2023-10-01' },
  { id: 'e42', school_id: 'kansas', reporting_year: 2023, sport: "Women's Basketball", total_revenue: 380000000, total_expenses: 600000000, coaching_salaries_m: 0, coaching_salaries_f: 220000000, recruiting_expenses: 58000000, scholarships_m: 0, scholarships_f: 195000000, operating_expenses: 110000000, profit_loss: -220000000, is_demo: true, created_at: '2023-10-01' },
  // Kansas 2022
  { id: 'e43', school_id: 'kansas', reporting_year: 2022, sport: 'Football', total_revenue: 3800000000, total_expenses: 3600000000, coaching_salaries_m: 920000000, coaching_salaries_f: 0, recruiting_expenses: 200000000, scholarships_m: 660000000, scholarships_f: 0, operating_expenses: 1050000000, profit_loss: 200000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e44', school_id: 'kansas', reporting_year: 2022, sport: "Men's Basketball", total_revenue: 4600000000, total_expenses: 2050000000, coaching_salaries_m: 750000000, coaching_salaries_f: 0, recruiting_expenses: 170000000, scholarships_m: 370000000, scholarships_f: 0, operating_expenses: 520000000, profit_loss: 2550000000, is_demo: true, created_at: '2022-10-01' },
  { id: 'e45', school_id: 'kansas', reporting_year: 2022, sport: "Women's Basketball", total_revenue: 350000000, total_expenses: 560000000, coaching_salaries_m: 0, coaching_salaries_f: 200000000, recruiting_expenses: 52000000, scholarships_m: 0, scholarships_f: 180000000, operating_expenses: 100000000, profit_loss: -210000000, is_demo: true, created_at: '2022-10-01' },
]

const YEARS = [2024, 2023, 2022]

interface EadaChartProps {
  selectedSchool: string
}

export function EadaChart({ selectedSchool }: EadaChartProps) {
  const [selectedYear, setSelectedYear] = useState(2024)

  const chartData = useMemo(() => {
    const schoolSlug = selectedSchool === 'all' ? 'michigan' : selectedSchool
    return SEED_EADA
      .filter((d) => d.school_id === schoolSlug && d.reporting_year === selectedYear)
      .map((d) => ({
        sport: d.sport,
        Revenue: d.total_revenue,
        Expenses: d.total_expenses,
      }))
  }, [selectedSchool, selectedYear])

  const schoolLabel = selectedSchool === 'all'
    ? 'Michigan'
    : SCHOOLS.find((s) => s.slug === selectedSchool)?.shortName ?? selectedSchool

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
        title={`Revenue vs Expenses - ${schoolLabel}`}
        description="EADA financial data by sport"
        height={320}
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sport" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v: number) => formatCurrency(v)}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
          <Legend />
          <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export { SEED_EADA }

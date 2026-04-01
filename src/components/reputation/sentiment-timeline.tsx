'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts'
import { ChartContainer } from '@/components/shared/chart-container'
import { SCHOOLS } from '@/lib/constants/schools'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { SEED_SENTIMENT_TIMELINE } from '@/lib/seed-data/reputation-events'

interface TimelinePoint {
  date: string
  [key: string]: number | string
}

function buildChartData() {
  const dateMap = new Map<string, TimelinePoint>()

  for (const point of SEED_SENTIMENT_TIMELINE) {
    if (!dateMap.has(point.date)) {
      dateMap.set(point.date, { date: point.date })
    }
    const entry = dateMap.get(point.date)!
    entry[point.school_id] = point.score
    entry[`${point.school_id}_headline`] = point.headline
  }

  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null

  const formattedDate = new Date(label as string).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="rounded-lg border bg-popover p-3 text-sm shadow-md">
      <p className="font-medium mb-2">{formattedDate}</p>
      {payload.map((entry) => {
        const school = SCHOOLS.find((s) => s.slug === entry.dataKey)
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{school?.shortName ?? entry.dataKey}:</span>
            <span>{entry.value.toFixed(2)}</span>
          </div>
        )
      })}
    </div>
  )
}

export function SentimentTimeline() {
  const { selectedSchool } = useSchoolFilter()
  const chartData = buildChartData()

  const visibleSchools =
    selectedSchool === 'all'
      ? SCHOOLS
      : SCHOOLS.filter((s) => s.slug === selectedSchool)

  return (
    <ChartContainer
      title="Sentiment Timeline"
      description="Monthly average sentiment scores by school (-1.0 to 1.0)"
      height={350}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="date"
          tickFormatter={(val: string) =>
            new Date(val).toLocaleDateString('en-US', { month: 'short' })
          }
          fontSize={12}
        />
        <YAxis domain={[-1, 1]} tickCount={5} fontSize={12} />
        <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value: string) => {
            const school = SCHOOLS.find((s) => s.slug === value)
            return school?.shortName ?? value
          }}
        />
        {visibleSchools.map((school) => (
          <Line
            key={school.slug}
            type="monotone"
            dataKey={school.slug}
            stroke={school.primaryColor}
            strokeWidth={2}
            dot={{ r: 4, fill: school.primaryColor }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

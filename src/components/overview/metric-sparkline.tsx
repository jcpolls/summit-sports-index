'use client'

import { LineChart, Line } from 'recharts'

interface MetricSparklineProps {
  data: { value: number }[]
  color?: string
  width?: number
  height?: number
}

export function MetricSparkline({
  data,
  color = '#3b82f6',
  width = 120,
  height = 40,
}: MetricSparklineProps) {
  return (
    <LineChart width={width} height={height} data={data}>
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  )
}

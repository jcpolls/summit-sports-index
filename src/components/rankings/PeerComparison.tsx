'use client'

import { useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { INSTITUTION_IDS, INSTITUTION_META } from '@/lib/seed-data/scoring-seed'
import { RankedSchool } from '@/components/rankings/RankingsTable'

const DIM_AXES = [
  { key: 'financial',   label: 'Financial' },
  { key: 'equity',      label: 'Equity' },
  { key: 'academic',    label: 'Academic' },
  { key: 'competitive', label: 'Competitive' },
  { key: 'reputation',  label: 'Reputation' },
  { key: 'survey',      label: 'Survey' },
] as const

interface Props {
  schools: RankedSchool[]
}

function ScoreColor({ value, winner }: { value: number; winner: boolean }) {
  const dimColor = value > 75 ? 'text-green-600' : value >= 50 ? 'text-amber-500' : 'text-red-500'
  return (
    <span className={`font-mono text-xs ${winner ? dimColor : 'text-muted-foreground'} ${winner ? 'font-bold' : ''}`}>
      {value.toFixed(1)}
    </span>
  )
}

export function PeerComparison({ schools }: Props) {
  const [idA, setIdA] = useState('michigan')
  const [idB, setIdB] = useState('alabama')

  const schoolA = schools.find((s) => s.id === idA)
  const schoolB = schools.find((s) => s.id === idB)

  const metaA = INSTITUTION_META[idA]
  const metaB = INSTITUTION_META[idB]

  const radarData = DIM_AXES.map(({ key, label }) => ({
    dimension: label,
    [idA]: schoolA?.scores[key] ?? 0,
    [idB]: schoolB?.scores[key] ?? 0,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Peer Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* School selectors */}
        <div className="flex items-center gap-3">
          <Select value={idA} onValueChange={setIdA}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INSTITUTION_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {INSTITUTION_META[id]?.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">vs</span>
          <Select value={idB} onValueChange={setIdB}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INSTITUTION_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {INSTITUTION_META[id]?.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Radar chart */}
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickCount={4} />
            <Radar
              name={metaA?.shortName ?? idA}
              dataKey={idA}
              stroke={metaA?.primaryColor ?? '#3b82f6'}
              fill={metaA?.primaryColor ?? '#3b82f6'}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              name={metaB?.shortName ?? idB}
              dataKey={idB}
              stroke={metaB?.primaryColor ?? '#ef4444'}
              fill={metaB?.primaryColor ?? '#ef4444'}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                `${Number(value).toFixed(1)}`,
                String(name),
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Numeric comparison table */}
        {schoolA && schoolB && (
          <div className="rounded-md border overflow-hidden text-xs">
            <div className="grid bg-muted/40 px-3 py-1.5 font-semibold text-muted-foreground"
              style={{ gridTemplateColumns: '1fr 5rem 5rem' }}>
              <span>Dimension</span>
              <span className="text-center" style={{ color: metaA?.primaryColor }}>{metaA?.shortName}</span>
              <span className="text-center" style={{ color: metaB?.primaryColor }}>{metaB?.shortName}</span>
            </div>
            {DIM_AXES.map(({ key, label }) => {
              const a = schoolA.scores[key]
              const b = schoolB.scores[key]
              return (
                <div key={key}
                  className="grid px-3 py-1.5 border-t"
                  style={{ gridTemplateColumns: '1fr 5rem 5rem' }}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-center">
                    <ScoreColor value={a} winner={a >= b} />
                  </span>
                  <span className="text-center">
                    <ScoreColor value={b} winner={b >= a} />
                  </span>
                </div>
              )
            })}
            <div className="grid px-3 py-1.5 border-t bg-muted/20 font-semibold"
              style={{ gridTemplateColumns: '1fr 5rem 5rem' }}>
              <span>Composite</span>
              <span className="text-center font-bold">{schoolA.scores.composite.toFixed(1)}</span>
              <span className="text-center font-bold">{schoolB.scores.composite.toFixed(1)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RankingFiltersProps {
  sport: string
  source: string
  season: string
  conference: string
  onSportChange: (v: string) => void
  onSourceChange: (v: string) => void
  onSeasonChange: (v: string) => void
  onConferenceChange: (v: string) => void
}

export function RankingFilters({
  sport,
  source,
  season,
  conference,
  onSportChange,
  onSourceChange,
  onSeasonChange,
  onConferenceChange,
}: RankingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={sport} onValueChange={onSportChange}>
        <SelectTrigger className="w-[170px] h-8 text-xs">
          <SelectValue placeholder="Sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          <SelectItem value="football">Football</SelectItem>
          <SelectItem value="basketball-m">Men&apos;s Basketball</SelectItem>
          <SelectItem value="basketball-w">Women&apos;s Basketball</SelectItem>
        </SelectContent>
      </Select>

      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="ap-poll">AP Poll</SelectItem>
          <SelectItem value="composite">Composite</SelectItem>
        </SelectContent>
      </Select>

      <Select value={season} onValueChange={onSeasonChange}>
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="Season" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025-26">2025-26</SelectItem>
        </SelectContent>
      </Select>

      <Select value={conference} onValueChange={onConferenceChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Conference" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conferences</SelectItem>
          <SelectItem value="Big Ten">Big Ten</SelectItem>
          <SelectItem value="SEC">SEC</SelectItem>
          <SelectItem value="ACC">ACC</SelectItem>
          <SelectItem value="Big 12">Big 12</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle, ExternalLink, ChevronDown, ChevronUp, Filter, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRole } from '@/lib/contexts/app-contexts'
import { SCHOOLS } from '@/lib/constants/schools'
import { SEED_COACH_EVENTS } from '@/lib/seed-data/coach-events'
import type { CoachEventType } from '@/types/database'

interface Props {
  /** When true, pre-filters to high-confidence last 7 days (bell sheet mode) */
  compact?: boolean
}

const EVENT_TYPE_CONFIG: Record<CoachEventType, { label: string; className: string }> = {
  hire: { label: 'HIRE', className: 'bg-green-100 text-green-800 border-green-200' },
  departure: { label: 'DEPARTURE', className: 'bg-red-100 text-red-800 border-red-200' },
  extension: { label: 'EXTENSION', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  rumor: { label: 'RUMOR', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  suspension: { label: 'SUSPENSION', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  investigation: { label: 'INVESTIGATION', className: 'bg-purple-100 text-purple-800 border-purple-200' },
}

function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-mono text-muted-foreground">{pct}%</span>
    </div>
  )
}

function SourcesCell({ urls }: { urls: string[] }) {
  if (!urls.length) return <span className="text-xs text-muted-foreground">—</span>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-xs">
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 cursor-pointer">
            {urls.length} source{urls.length > 1 ? 's' : ''}
          </Badge>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-w-xs">
        {urls.map((url, i) => (
          <DropdownMenuItem key={i} asChild>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs"
            >
              <ExternalLink className="h-3 w-3 shrink-0" />
              <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const EVENT_TYPES: CoachEventType[] = ['hire', 'departure', 'extension', 'rumor', 'suspension', 'investigation']

export function AlertFeed({ compact = false }: Props) {
  const { role } = useRole()

  // Filter state
  const [eventTypeFilter, setEventTypeFilter] = useState<CoachEventType | 'all'>('all')
  const [sportFilter, setSportFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState<string[]>([])
  const [confirmedOnly, setConfirmedOnly] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)

  // Optimistic confirm state
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const filtered = SEED_COACH_EVENTS.filter((e) => {
    if (compact) {
      if (new Date(e.detected_at).getTime() < sevenDaysAgo) return false
      if (e.confidence_score < 0.8) return false
    }
    if (eventTypeFilter !== 'all' && e.event_type !== eventTypeFilter) return false
    if (sportFilter && !e.sport.toLowerCase().includes(sportFilter.toLowerCase())) return false
    if (schoolFilter.length && !schoolFilter.includes(e.institution_id)) return false
    const isConfirmed = confirmed[e.id] ?? e.confirmed
    if (confirmedOnly && !isConfirmed) return false
    return true
  }).sort((a, b) => {
    const diff = new Date(a.detected_at).getTime() - new Date(b.detected_at).getTime()
    return sortAsc ? diff : -diff
  })

  function toggleSchool(slug: string) {
    setSchoolFilter((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  function handleConfirm(id: string) {
    setConfirmed((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <div className="space-y-4">
      {/* Filter bar — hidden in compact mode */}
      {!compact && (
        <div className="flex flex-wrap gap-2 items-center p-3 rounded-lg border bg-muted/30">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

          {/* Event type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                {eventTypeFilter === 'all' ? 'All Events' : EVENT_TYPE_CONFIG[eventTypeFilter]?.label ?? eventTypeFilter}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEventTypeFilter('all')}>All Events</DropdownMenuItem>
              {EVENT_TYPES.map((et) => (
                <DropdownMenuItem key={et} onClick={() => setEventTypeFilter(et)}>
                  {EVENT_TYPE_CONFIG[et]?.label ?? et}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sport text input */}
          <Input
            placeholder="Sport..."
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="h-7 w-32 text-xs"
          />

          {/* School multi-select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                Schools {schoolFilter.length > 0 ? `(${schoolFilter.length})` : ''}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {SCHOOLS.map((s) => (
                <DropdownMenuItem
                  key={s.slug}
                  onClick={() => toggleSchool(s.slug)}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${
                      schoolFilter.includes(s.slug) ? 'border-foreground bg-foreground' : 'border-muted-foreground'
                    }`}
                  >
                    {schoolFilter.includes(s.slug) && <Check className="h-2.5 w-2.5 text-background" />}
                  </div>
                  {s.shortName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Confirmed only toggle */}
          <div className="flex items-center gap-1.5 ml-1">
            <Switch
              id="confirmed-filter"
              checked={confirmedOnly}
              onCheckedChange={setConfirmedOnly}
              className="h-4 w-7"
            />
            <Label htmlFor="confirmed-filter" className="text-xs cursor-pointer">
              Confirmed only
            </Label>
          </div>

          {/* Sort */}
          <button
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {sortAsc ? 'Oldest first' : 'Newest first'}
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        {compact && ' · high-confidence · last 7 days'}
      </p>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Coach</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">School</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Sport</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Event</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Confidence</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Sources</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Detected</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Confirmed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No events match the current filters
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const isConfirmed = confirmed[event.id] ?? event.confirmed
                  const typeCfg = EVENT_TYPE_CONFIG[event.event_type] ?? EVENT_TYPE_CONFIG.rumor
                  let timeAgo = ''
                  try {
                    timeAgo = formatDistanceToNow(new Date(event.detected_at), { addSuffix: true })
                  } catch {
                    timeAgo = 'unknown'
                  }

                  return (
                    <tr key={event.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-sm">{event.coach_name}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: event.institution_color }}
                          />
                          <span className="text-xs">{event.institution_name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{event.sport}</td>
                      <td className="px-3 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-5 px-1.5 font-semibold ${typeCfg.className}`}
                        >
                          {typeCfg.label}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <ConfidenceBar score={event.confidence_score} />
                      </td>
                      <td className="px-3 py-2.5">
                        <SourcesCell urls={event.source_urls} />
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo}
                      </td>
                      <td className="px-3 py-2.5">
                        {isConfirmed ? (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Confirmed</span>
                          </div>
                        ) : role === 'admin' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[11px] px-2"
                            onClick={() => handleConfirm(event.id)}
                          >
                            Confirm
                          </Button>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 px-1.5 bg-amber-50 text-amber-700 border-amber-200"
                          >
                            Unconfirmed
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

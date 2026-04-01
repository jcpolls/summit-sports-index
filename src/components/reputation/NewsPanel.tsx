'use client'

import { useEffect, useState, useCallback } from 'react'
import { Newspaper, RefreshCw, ExternalLink, Flag, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import newspapers from '@/config/newspapers.json'
import type { NewsItem } from '@/scrapers/college-newspaper'

interface Props {
  institutionSlug?: string // undefined = all schools
  demo?: boolean
}

const PAPER_COLORS: Record<string, string> = {
  michigan: '#00274C',
  alabama: '#9E1B32',
  oregon: '#154733',
  duke: '#003087',
  kansas: '#0051A5',
}

function SentimentBadge({ score, label }: { score: number; label: string }) {
  if (label === 'positive')
    return <Badge className="text-[10px] h-4 px-1.5 bg-green-100 text-green-700 hover:bg-green-100 border-green-200">+{score}</Badge>
  if (label === 'negative')
    return <Badge className="text-[10px] h-4 px-1.5 bg-red-100 text-red-700 hover:bg-red-100 border-red-200">{score}</Badge>
  return <Badge className="text-[10px] h-4 px-1.5 bg-gray-100 text-gray-600 hover:bg-gray-100">{score > 0 ? '+' : ''}{score}</Badge>
}

export function NewsPanel({ institutionSlug, demo = true }: Props) {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterSlug, setFilterSlug] = useState<string>(institutionSlug ?? 'all')
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all')

  const fetchNews = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const params = new URLSearchParams({ demo: demo ? 'true' : 'false' })
      if (institutionSlug) params.set('slug', institutionSlug)
      const res = await fetch(`/api/reputation/news?${params}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items ?? [])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [institutionSlug, demo])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const filtered = items.filter((item) => {
    if (filterSlug !== 'all' && item.institution_id !== filterSlug) return false
    if (flaggedOnly && !item.flagged) return false
    if (sentimentFilter !== 'all' && item.sentiment_label !== sentimentFilter) return false
    return true
  })

  const flagCount = items.filter((i) => i.flagged).length

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-orange-500" />
          <span className="font-semibold text-sm">Campus Press Tracker</span>
          {flagCount > 0 && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1.5">{flagCount} flagged</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => fetchNews(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {/* School filter (only shown when displaying all schools) */}
        {!institutionSlug && (
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilterSlug('all')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                filterSlug === 'all' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {newspapers.map((paper) => (
              <button
                key={paper.slug}
                onClick={() => setFilterSlug(paper.slug)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors border ${
                  filterSlug === paper.slug ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                style={filterSlug === paper.slug ? { backgroundColor: PAPER_COLORS[paper.slug] ?? '#6b7280', borderColor: PAPER_COLORS[paper.slug] ?? '#6b7280' } : undefined}
              >
                {paper.slug.charAt(0).toUpperCase() + paper.slug.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Sentiment filter */}
        <div className="flex gap-1 ml-auto">
          {(['all', 'positive', 'neutral', 'negative'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSentimentFilter(s)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                sentimentFilter === s
                  ? s === 'positive' ? 'bg-green-500 text-white'
                    : s === 'negative' ? 'bg-red-500 text-white'
                    : s === 'neutral' ? 'bg-yellow-400 text-white'
                    : 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Flagged toggle */}
        <button
          onClick={() => setFlaggedOnly(!flaggedOnly)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
            flaggedOnly ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Flag className="h-2.5 w-2.5" />
          Flagged
        </button>
      </div>

      {/* News stream */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
          No articles match the current filters
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto max-h-[540px] pr-1">
          {filtered.map((item, i) => {
            const color = PAPER_COLORS[item.institution_id] ?? '#6b7280'
            let timeAgo = ''
            try {
              timeAgo = formatDistanceToNow(new Date(item.published_at), { addSuffix: true })
            } catch {
              timeAgo = 'recently'
            }

            return (
              <div
                key={i}
                className={`rounded-lg border p-3 text-xs space-y-1.5 transition-colors hover:bg-muted/30 ${
                  item.flagged ? 'border-red-200 bg-red-50/50 dark:bg-red-950/10' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium text-muted-foreground text-[10px]">
                        {item.publication}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.flagged && (
                          <Badge variant="destructive" className="text-[10px] h-4 px-1 gap-0.5">
                            <Flag className="h-2 w-2" />
                            Flagged
                          </Badge>
                        )}
                        <SentimentBadge score={item.sentiment_score} label={item.sentiment_label} />
                        <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
                      </div>
                    </div>
                    <p className="font-semibold leading-snug mt-0.5 text-[12px]">{item.headline}</p>
                    <p className="text-muted-foreground leading-snug line-clamp-2 mt-0.5">{item.summary}</p>
                    {item.keywords.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {item.keywords.slice(0, 4).map((kw) => (
                          <span key={kw} className="bg-muted px-1 py-0.5 rounded text-[10px] text-muted-foreground">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.url && item.url !== '#' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[10px] text-muted-foreground text-center">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} · Sentiment scored by Claude Haiku
        </p>
      )}
    </div>
  )
}

/**
 * College Newspaper RSS Scraper
 *
 * Fetches RSS feeds from student newspapers, extracts sports articles,
 * and uses Claude Haiku for batch sentiment scoring.
 *
 * Usage:
 *   const items = await scrapeNewspaper('michigan')
 */

import Anthropic from '@anthropic-ai/sdk'
import { XMLParser } from 'fast-xml-parser'
import newspapers from '@/config/newspapers.json'

export interface NewsItem {
  institution_id: string
  headline: string
  summary: string
  url: string
  published_at: string
  sentiment_score: number // -100 to +100
  sentiment_label: 'positive' | 'neutral' | 'negative'
  keywords: string[]
  flagged: boolean
  publication: string
}

interface RssItem {
  title?: string
  link?: string
  description?: string
  pubDate?: string
  'content:encoded'?: string
  guid?: string | { '#text': string }
}

const SPORTS_KEYWORDS = [
  'football', 'basketball', 'soccer', 'baseball', 'softball', 'volleyball',
  'swimming', 'track', 'tennis', 'gymnastics', 'lacrosse', 'wrestling',
  'athlete', 'coach', 'recruiting', 'ncaa', 'big ten', 'sec', 'acc', 'big 12',
  'championship', 'tournament', 'season', 'game', 'match', 'roster', 'transfer',
  'nil', 'portal', 'athletic', 'stadium', 'arena', 'facility',
]

function isSportsArticle(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase()
  return SPORTS_KEYWORDS.some((kw) => text.includes(kw))
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
}

async function fetchRss(url: string): Promise<RssItem[]> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SummitSportsIndex/1.0 (RSS reader; educational research)' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const xml = await res.text()

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
  const parsed = parser.parse(xml)

  const channel = parsed?.rss?.channel ?? parsed?.feed
  if (!channel) return []

  const items: RssItem[] = Array.isArray(channel.item)
    ? channel.item
    : channel.item
    ? [channel.item]
    : Array.isArray(channel.entry)
    ? channel.entry
    : []

  return items.slice(0, 30) // cap at 30 per feed
}

async function batchScoreSentiment(
  articles: Array<{ title: string; summary: string }>,
  apiKey: string
): Promise<Array<{ score: number; keywords: string[]; flag: boolean }>> {
  const client = new Anthropic({ apiKey })

  const numbered = articles
    .map(
      (a, i) =>
        `[${i + 1}] TITLE: ${a.title}\nSUMMARY: ${a.summary.slice(0, 200)}`
    )
    .join('\n\n')

  const prompt = `Score each of these college athletics news articles for sentiment.

${numbered}

Return a JSON array with one object per article in the same order:
[{"score": <-100 to 100>, "keywords": ["kw1","kw2","kw3"], "flag": <true if scandal/controversy/violation>}]

Only return the JSON array, no explanation.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
  return JSON.parse(text)
}

export async function scrapeNewspaper(slug: string): Promise<NewsItem[]> {
  const paper = newspapers.find((n) => n.slug === slug)
  if (!paper) throw new Error(`No newspaper config for slug: ${slug}`)

  const rawItems = await fetchRss(paper.rss)
  const sportsItems = rawItems.filter((item) =>
    isSportsArticle(item.title ?? '', stripHtml(item.description ?? item['content:encoded'] ?? ''))
  )

  if (!sportsItems.length) return []

  const articles = sportsItems.map((item) => ({
    title: item.title ?? 'Untitled',
    summary: stripHtml(item.description ?? item['content:encoded'] ?? ''),
    url:
      typeof item.link === 'string'
        ? item.link
        : typeof item.guid === 'string'
        ? item.guid
        : (item.guid as { '#text': string })?.['#text'] ?? '',
    published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
  }))

  const apiKey = process.env.ANTHROPIC_API_KEY
  let scores: Array<{ score: number; keywords: string[]; flag: boolean }>

  if (apiKey) {
    // Batch score in chunks of 10 to stay within token limits
    scores = []
    for (let i = 0; i < articles.length; i += 10) {
      const chunk = articles.slice(i, i + 10)
      const chunkScores = await batchScoreSentiment(chunk, apiKey)
      scores.push(...chunkScores)
    }
  } else {
    // Fallback: keyword-based heuristic
    scores = articles.map((a) => {
      const text = `${a.title} ${a.summary}`.toLowerCase()
      const negative = ['violation', 'scandal', 'loss', 'fired', 'suspended', 'ncaa', 'probe'].filter(
        (w) => text.includes(w)
      ).length
      const positive = ['win', 'champion', 'record', 'ranked', 'commit', 'award', 'honor'].filter(
        (w) => text.includes(w)
      ).length
      const score = Math.min(100, Math.max(-100, (positive - negative) * 20))
      return {
        score,
        keywords: [],
        flag: negative > 0,
      }
    })
  }

  return articles.map((a, i) => {
    const s = scores[i] ?? { score: 0, keywords: [], flag: false }
    return {
      institution_id: slug,
      headline: a.title,
      summary: a.summary,
      url: a.url,
      published_at: a.published_at,
      sentiment_score: s.score,
      sentiment_label: s.score >= 20 ? 'positive' : s.score <= -20 ? 'negative' : 'neutral',
      keywords: s.keywords ?? [],
      flagged: s.flag ?? false,
      publication: paper.publication,
    }
  })
}

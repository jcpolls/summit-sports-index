import { NextRequest, NextResponse } from 'next/server'
import newspapers from '@/config/newspapers.json'
import type { NewsItem } from '@/scrapers/college-newspaper'

// Demo news data
const DEMO_NEWS: NewsItem[] = [
  // Michigan
  { institution_id: 'michigan', headline: 'Wolverines Offense Shines in Spring Game Preview', summary: 'Michigan\'s offensive unit showed significant improvement during their open spring practice session, impressing coaches and fans alike.', url: '#', published_at: '2025-03-28T14:00:00Z', sentiment_score: 72, sentiment_label: 'positive', keywords: ['football', 'offense', 'spring'], flagged: false, publication: 'The Michigan Daily' },
  { institution_id: 'michigan', headline: 'Michigan Basketball Adds Two Portal Transfers', summary: 'Head coach Dusty May has secured commitments from two high-impact transfer portal entries, bolstering the Wolverines\' backcourt depth.', url: '#', published_at: '2025-03-26T10:30:00Z', sentiment_score: 65, sentiment_label: 'positive', keywords: ['basketball', 'transfer portal', 'recruiting'], flagged: false, publication: 'The Michigan Daily' },
  { institution_id: 'michigan', headline: 'U-M Athletics Reports Record $87M in Donations for FY2024', summary: 'The Michigan Athletic Department announced a record-breaking fundraising year, with major gifts to the football complex renovation leading the way.', url: '#', published_at: '2025-03-24T09:00:00Z', sentiment_score: 88, sentiment_label: 'positive', keywords: ['donations', 'fundraising', 'facilities'], flagged: false, publication: 'The Michigan Daily' },
  { institution_id: 'michigan', headline: 'Title IX Review Finds Michigan Athletics in Full Compliance', summary: 'An independent Title IX audit commissioned by the university found Michigan Athletics in full compliance across all measured categories.', url: '#', published_at: '2025-03-20T11:00:00Z', sentiment_score: 55, sentiment_label: 'positive', keywords: ['title ix', 'compliance', 'equity'], flagged: false, publication: 'The Michigan Daily' },
  // Alabama
  { institution_id: 'alabama', headline: 'DeBoer Era Begins: Crimson Tide Opens Spring Camp', summary: 'New head coach Kalen DeBoer officially opened Alabama football spring practices, emphasizing continuity with a new offensive identity.', url: '#', published_at: '2025-03-27T13:00:00Z', sentiment_score: 48, sentiment_label: 'positive', keywords: ['football', 'deboer', 'spring camp'], flagged: false, publication: 'The Crimson White' },
  { institution_id: 'alabama', headline: 'Alabama Gymnastics Claims SEC Championship Title', summary: 'The Alabama gymnastics team captured its 10th SEC championship, with three gymnasts earning All-American honors.', url: '#', published_at: '2025-03-25T16:00:00Z', sentiment_score: 91, sentiment_label: 'positive', keywords: ['gymnastics', 'sec', 'championship'], flagged: false, publication: 'The Crimson White' },
  { institution_id: 'alabama', headline: 'Transfer Portal Concerns Grow as Tide Loses Fifth Starter', summary: 'Alabama football has now lost five projected starters to the transfer portal since January, raising questions about DeBoer\'s roster management approach.', url: '#', published_at: '2025-03-22T08:30:00Z', sentiment_score: -38, sentiment_label: 'negative', keywords: ['transfer portal', 'football', 'roster'], flagged: false, publication: 'The Crimson White' },
  { institution_id: 'alabama', headline: 'Bryant-Denny Renovation Enters Final Phase', summary: 'The $95M Bryant-Denny Stadium renovation project is entering its final construction phase, with premium club spaces expected to open for the 2025 season.', url: '#', published_at: '2025-03-19T10:00:00Z', sentiment_score: 70, sentiment_label: 'positive', keywords: ['facilities', 'stadium', 'renovation'], flagged: false, publication: 'The Crimson White' },
  // Oregon
  { institution_id: 'oregon', headline: 'Ducks Ranked No. 3 in Preseason Football Polls', summary: 'Oregon football enters the 2025 season ranked third nationally, the program\'s highest preseason ranking since joining the Big Ten.', url: '#', published_at: '2025-03-28T09:00:00Z', sentiment_score: 85, sentiment_label: 'positive', keywords: ['football', 'rankings', 'big ten'], flagged: false, publication: 'The Daily Emerald' },
  { institution_id: 'oregon', headline: 'Phil Knight Announces Additional $50M Athletics Commitment', summary: 'Nike co-founder Phil Knight has pledged an additional $50 million to Oregon Athletics, focused on Olympic sport facilities and NIL collective funding.', url: '#', published_at: '2025-03-25T12:00:00Z', sentiment_score: 95, sentiment_label: 'positive', keywords: ['phil knight', 'donation', 'facilities'], flagged: false, publication: 'The Daily Emerald' },
  { institution_id: 'oregon', headline: 'Oregon Women\'s Basketball Reaches Elite Eight', summary: 'The Ducks women\'s basketball team advanced to the Elite Eight for the second time in three years, defeating Tennessee in a thrilling overtime contest.', url: '#', published_at: '2025-03-23T22:00:00Z', sentiment_score: 90, sentiment_label: 'positive', keywords: ['basketball', 'women', 'tournament'], flagged: false, publication: 'The Daily Emerald' },
  // Duke
  { institution_id: 'duke', headline: 'Scheyer Lands Top-5 Recruiting Class for 2025', summary: 'Jon Scheyer secured commitments from two top-10 prospects, giving Duke its fourth consecutive top-5 recruiting class.', url: '#', published_at: '2025-03-27T11:00:00Z', sentiment_score: 80, sentiment_label: 'positive', keywords: ['basketball', 'recruiting', 'scheyer'], flagged: false, publication: 'The Duke Chronicle' },
  { institution_id: 'duke', headline: 'Blue Devils Football Seeks First Winning Season Since 2018', summary: 'Duke football spring practice is underway with new coordinators and a strong transfer portal class aimed at ending a multi-year bowl drought.', url: '#', published_at: '2025-03-25T10:00:00Z', sentiment_score: 30, sentiment_label: 'positive', keywords: ['football', 'bowl', 'recruiting'], flagged: false, publication: 'The Duke Chronicle' },
  { institution_id: 'duke', headline: 'Duke Athletics NIL Collective Falls Short of ACC Peers', summary: 'An analysis of ACC NIL collective activity reveals Duke\'s collective ranks 10th in the conference by total committed capital, raising concerns among boosters.', url: '#', published_at: '2025-03-21T09:00:00Z', sentiment_score: -42, sentiment_label: 'negative', keywords: ['nil', 'collective', 'acc'], flagged: false, publication: 'The Duke Chronicle' },
  // Kansas
  { institution_id: 'kansas', headline: 'Self\'s Jayhawks Enter March Ranked No. 8 Nationally', summary: 'Bill Self\'s Kansas basketball team enters the Big 12 tournament as the No. 2 seed and ranked 8th nationally despite a rocky non-conference schedule.', url: '#', published_at: '2025-03-28T08:00:00Z', sentiment_score: 62, sentiment_label: 'positive', keywords: ['basketball', 'big 12', 'rankings'], flagged: false, publication: 'University Daily Kansan' },
  { institution_id: 'kansas', headline: 'NCAA Compliance Report Details Corrective Measures at KU', summary: 'Kansas Athletics released its NCAA compliance enhancement plan, detailing 14 corrective actions following last year\'s Level I findings in basketball.', url: '#', published_at: '2025-03-26T14:00:00Z', sentiment_score: -55, sentiment_label: 'negative', keywords: ['ncaa', 'compliance', 'violations'], flagged: true, publication: 'University Daily Kansan' },
  { institution_id: 'kansas', headline: 'Football Spring Game Draws 22,000 to Memorial Stadium', summary: 'Despite a challenging recent season, Kansas football\'s spring game attracted 22,000 fans — the program\'s highest spring attendance since 2010.', url: '#', published_at: '2025-03-24T19:00:00Z', sentiment_score: 55, sentiment_label: 'positive', keywords: ['football', 'spring game', 'attendance'], flagged: false, publication: 'University Daily Kansan' },
  { institution_id: 'kansas', headline: 'KU Athletic Director Faces Faculty Senate Questions on Buyout Costs', summary: 'Kansas Athletic Director Travis Goff appeared before the Faculty Senate to address concerns over $14M in football coaching buyout costs over the past two years.', url: '#', published_at: '2025-03-20T15:00:00Z', sentiment_score: -48, sentiment_label: 'negative', keywords: ['buyout', 'football', 'faculty senate'], flagged: true, publication: 'University Daily Kansan' },
]

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const demo = req.nextUrl.searchParams.get('demo') === 'true'

  if (demo || !process.env.ANTHROPIC_API_KEY) {
    const items = slug ? DEMO_NEWS.filter((n) => n.institution_id === slug) : DEMO_NEWS
    return NextResponse.json({ items })
  }

  // Live scraping
  if (!slug) {
    return NextResponse.json({ error: 'slug required for live scraping' }, { status: 400 })
  }

  const paper = newspapers.find((n) => n.slug === slug)
  if (!paper) {
    return NextResponse.json({ error: `No newspaper config for slug: ${slug}` }, { status: 404 })
  }

  try {
    const { scrapeNewspaper } = await import('@/scrapers/college-newspaper')
    const items = await scrapeNewspaper(slug)
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

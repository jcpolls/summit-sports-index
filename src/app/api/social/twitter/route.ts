import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Seed social signals for demo mode (slug → records)
const DEMO_SIGNALS: Record<string, Array<{ text: string; sentiment: number; keywords: string[]; flag: boolean }>> = {
  michigan: [
    { text: 'Incredible atmosphere at the Big House today! Michigan football is BACK! #GoBlue', sentiment: 85, keywords: ['football', 'Big House', 'GoBlue'], flag: false },
    { text: 'Dusty May has Michigan basketball playing with so much energy. Final Four vibes.', sentiment: 78, keywords: ['basketball', 'Dusty May', 'Final Four'], flag: false },
    { text: 'Disappointed in Michigan\'s handling of the recruiting investigation. Need full transparency.', sentiment: -45, keywords: ['investigation', 'recruiting', 'transparency'], flag: true },
    { text: 'Michigan transfer portal strategy this off-season has been impressive.', sentiment: 70, keywords: ['transfer portal', 'recruiting', 'depth'], flag: false },
    { text: 'Three straight losses. The offensive line has not been fixed. Fire the OL coach.', sentiment: -70, keywords: ['football', 'losses', 'offensive line'], flag: false },
    { text: 'Michigan Athletics reports record $220M revenue. Strong financial position.', sentiment: 82, keywords: ['revenue', 'finances', 'athletics'], flag: false },
    { text: 'New disparate impact complaint filed at Michigan athletics. Follow the process carefully.', sentiment: -30, keywords: ['Title IX', 'complaint', 'compliance'], flag: true },
    { text: 'Michigan women\'s hockey wins Big Ten championship! #GoBlue #WomensHockey', sentiment: 88, keywords: ['womens hockey', 'Big Ten', 'championship'], flag: false },
    { text: 'Michigan donor gift of $45M for new training facility. Big Ten arms race continues.', sentiment: 60, keywords: ['donor', 'facility', 'investment'], flag: false },
    { text: 'Sign stealing scandal fallout still affecting team culture. Players transferring out.', sentiment: -60, keywords: ['scandal', 'sign stealing', 'transfer'], flag: true },
    { text: 'Michigan APR scores among the best in the country. Winning on and off the field.', sentiment: 75, keywords: ['APR', 'academics', 'compliance'], flag: false },
    { text: 'Michigan basketball transfer additions look like great fits. Excited for the season.', sentiment: 72, keywords: ['basketball', 'transfer', 'roster'], flag: false },
    { text: 'Michigan Athletics launching new NIL collective. Top 5 for name-image-likeness deals.', sentiment: 65, keywords: ['NIL', 'athletics', 'collective'], flag: false },
    { text: 'Michigan vs Ohio State ticket prices at all-time high. Demand is incredible.', sentiment: 40, keywords: ['Michigan', 'Ohio State', 'tickets'], flag: false },
    { text: 'New athlete dorms are fantastic. Michigan investing seriously in student athlete experience.', sentiment: 72, keywords: ['facilities', 'student athletes', 'dorms'], flag: false },
    { text: 'Sherrone Moore addresses media on upcoming schedule. Confident and composed.', sentiment: 55, keywords: ['Sherrone Moore', 'football', 'media'], flag: false },
    { text: 'Title IX training expanded across all Michigan athletic programs this semester.', sentiment: 58, keywords: ['Title IX', 'training', 'compliance'], flag: false },
    { text: 'Michigan football secures top-5 recruiting class for 2025. Blue Chip ratio climbing.', sentiment: 80, keywords: ['recruiting', 'football', 'class'], flag: false },
    { text: 'Athletic department staff turnover concerns me. Third AD departure this year.', sentiment: -35, keywords: ['administration', 'staff', 'turnover'], flag: false },
    { text: 'Michigan-Oregon Big Ten opener is going to be electric. Can\'t wait.', sentiment: 76, keywords: ['football', 'Big Ten', 'Oregon'], flag: false },
  ],
  alabama: [
    { text: 'Bryant-Denny rocking tonight! Alabama football is what college sports is all about. #RollTide', sentiment: 90, keywords: ['football', 'Bryant-Denny', 'RollTide'], flag: false },
    { text: 'Nate Oats has transformed Alabama basketball. Sweet 16 here we come!', sentiment: 82, keywords: ['basketball', 'Nate Oats', 'Sweet 16'], flag: false },
    { text: 'Kalen DeBoer\'s first season solid but not Saban-level. Adjustment period expected.', sentiment: 35, keywords: ['football', 'Kalen DeBoer', 'coaching'], flag: false },
    { text: 'Alabama facilities are the gold standard. New athletic complex is stunning.', sentiment: 88, keywords: ['facilities', 'SEC', 'complex'], flag: false },
    { text: 'Alabama lost to Georgia again. Secondary needs to be fixed or this season is a disaster.', sentiment: -55, keywords: ['football', 'Georgia', 'secondary'], flag: false },
    { text: 'Alabama women\'s gymnastics wins SEC championship for third straight year. Dominant.', sentiment: 85, keywords: ['gymnastics', 'SEC', 'championship'], flag: false },
    { text: 'Paul Bryant Jr. commits $10M to new womens sports facility. Strong equity commitment.', sentiment: 75, keywords: ['donor', 'womens sports', 'facilities'], flag: false },
    { text: 'Alabama football\'s recruiting class ranked #1 in SEC for third consecutive year.', sentiment: 88, keywords: ['recruiting', 'football', 'SEC'], flag: false },
    { text: 'Title IX training following the 2023 complaint getting positive reviews from athletes.', sentiment: 50, keywords: ['Title IX', 'training', 'compliance'], flag: false },
    { text: 'Alabama APR numbers improving but still below other top programs. Concerning.', sentiment: -25, keywords: ['APR', 'academics', 'compliance'], flag: false },
    { text: 'Alabama Athletics reports $280M in revenue, leading SEC for fifth consecutive year.', sentiment: 77, keywords: ['revenue', 'SEC', 'finances'], flag: false },
    { text: 'Inexcusable penalty in fourth quarter cost Alabama the game. Discipline is lacking.', sentiment: -65, keywords: ['football', 'penalties', 'discipline'], flag: false },
    { text: 'Alabama women\'s soccer making a run in NCAA tournament. So proud of these athletes!', sentiment: 80, keywords: ['soccer', 'NCAA tournament', 'womens sports'], flag: false },
    { text: 'Transfer portal has Alabama getting better players than before. DeBoer knows rosters.', sentiment: 68, keywords: ['transfer portal', 'DeBoer', 'roster'], flag: false },
    { text: 'Alabama hostile environment complaint still under review. Administration needs to act.', sentiment: -40, keywords: ['complaint', 'hostile environment', 'investigation'], flag: true },
    { text: 'Alabama NIL structure recruiting top players from everywhere. Smart adaptation.', sentiment: 70, keywords: ['NIL', 'recruiting', 'football'], flag: false },
    { text: 'Alabama $95M football budget raises questions about resource equity across programs.', sentiment: -15, keywords: ['budget', 'football', 'equity'], flag: false },
    { text: 'Alabama hosting SEC Championship in 2025 is huge for program and Tuscaloosa economy.', sentiment: 72, keywords: ['SEC Championship', 'football', 'hosting'], flag: false },
    { text: 'Alabama compliance office recognized for excellence. Strong internal controls noted.', sentiment: 65, keywords: ['compliance', 'athletics', 'recognition'], flag: false },
    { text: 'Alabama hoops pulls off the upset! Oats\' team is for real this year. #MarchMadness', sentiment: 86, keywords: ['basketball', 'upset', 'March Madness'], flag: false },
  ],
  oregon: [
    { text: 'Autzen Stadium electric tonight! Dan Lanning has Oregon playing championship football. #GoDucks', sentiment: 86, keywords: ['football', 'Autzen', 'GoDucks'], flag: false },
    { text: 'Dana Altman is a genius. Oregon basketball doing it again with a retooled roster.', sentiment: 80, keywords: ['basketball', 'Dana Altman', 'Oregon'], flag: false },
    { text: 'Phil Knight\'s latest gift will transform Oregon athletic facilities. Can\'t wait.', sentiment: 78, keywords: ['Phil Knight', 'donor', 'facilities'], flag: false },
    { text: 'Oregon equity score improving each year. Strong trend for Ducks athletics.', sentiment: 55, keywords: ['Title IX', 'equity', 'compliance'], flag: false },
    { text: 'Oregon adapting well to Big Ten. Conference realignment seamless for the Ducks.', sentiment: 68, keywords: ['Big Ten', 'realignment', 'adaptation'], flag: false },
    { text: 'Oregon coaching salary gap for womens sports is embarrassing. Title IX needs real work.', sentiment: -50, keywords: ['coaching salaries', 'womens sports', 'Title IX'], flag: true },
    { text: 'Lanning recruiting in the Big Ten has exceeded all expectations. Massive wins.', sentiment: 83, keywords: ['recruiting', 'Big Ten', 'Dan Lanning'], flag: false },
    { text: 'Oregon facilities envy every school in the country. Nike money shows everywhere.', sentiment: 82, keywords: ['facilities', 'Nike', 'Oregon'], flag: false },
    { text: 'Big Ten schedule is brutal. Oregon needs depth they don\'t have yet. Concerned.', sentiment: -30, keywords: ['Big Ten', 'schedule', 'depth'], flag: false },
    { text: 'Oregon women\'s basketball heading into NCAA tournament as a 3 seed. Incredible season.', sentiment: 84, keywords: ['basketball', 'NCAA tournament', 'womens'], flag: false },
    { text: 'Oregon track and field program continues to win national championships quietly.', sentiment: 76, keywords: ['track', 'national championship', 'Oregon'], flag: false },
    { text: 'Retaliation complaint from 2022 dismissed. Oregon handled it appropriately per OCR.', sentiment: 30, keywords: ['complaint', 'retaliation', 'OCR'], flag: false },
    { text: 'Oregon football unbeaten in non-conference. Real test comes Saturday at Penn State.', sentiment: 70, keywords: ['football', 'non-conference', 'Big Ten'], flag: false },
    { text: 'Oregon NIL collective GoDucks Elite paying competitively. Retention improving.', sentiment: 65, keywords: ['NIL', 'Oregon', 'retention'], flag: false },
    { text: 'Oregon survey scores for athlete experience jumped 5 points this year. Great sign.', sentiment: 74, keywords: ['survey', 'athlete experience', 'Oregon'], flag: false },
    { text: 'Disappointed that Oregon hasn\'t fully addressed the coaching equity gap yet.', sentiment: -42, keywords: ['equity', 'coaching', 'gap'], flag: true },
    { text: 'Oregon men\'s basketball crushing it in Big Ten play. Altman is remarkable.', sentiment: 80, keywords: ['basketball', 'Big Ten', 'Dana Altman'], flag: false },
    { text: 'Oregon academic support rated among top 10 in the country. Proud of our school.', sentiment: 78, keywords: ['academics', 'support', 'Oregon'], flag: false },
    { text: 'New performance center opens in Eugene. State of the art in every category.', sentiment: 75, keywords: ['facilities', 'performance center', 'Eugene'], flag: false },
    { text: 'Oregon football loss at Michigan stings. Need more depth on the offensive line.', sentiment: -38, keywords: ['football', 'Michigan', 'loss'], flag: false },
  ],
  duke: [
    { text: 'Cameron Indoor is the greatest venue in college basketball. Duke is special. #GoDuke', sentiment: 90, keywords: ['basketball', 'Cameron', 'GoDuke'], flag: false },
    { text: 'Jon Scheyer is building something special. Different from Coach K but just as elite.', sentiment: 80, keywords: ['basketball', 'Jon Scheyer', 'Duke'], flag: false },
    { text: 'Duke football is embarrassing. We can\'t keep losing like this. Investment needed.', sentiment: -65, keywords: ['football', 'losses', 'investment'], flag: false },
    { text: 'Duke EADA compliance watch flags are concerning. Participation and coaching gaps real.', sentiment: -40, keywords: ['EADA', 'compliance', 'watch'], flag: true },
    { text: 'Student athletes protest practice schedule changes. Admin needs to listen.', sentiment: -35, keywords: ['protest', 'practice', 'student athletes'], flag: true },
    { text: 'Duke women\'s soccer wins ACC title for third straight year. Phenomenal program.', sentiment: 87, keywords: ['soccer', 'ACC', 'championship'], flag: false },
    { text: 'Rubenstein gift to Duke basketball facility will keep us elite for a generation.', sentiment: 82, keywords: ['donor', 'facility', 'basketball'], flag: false },
    { text: 'Duke APR is the highest in our cohort. Academics first, always. #Duke', sentiment: 78, keywords: ['APR', 'academics', 'Duke'], flag: false },
    { text: 'Title IX unequal treatment complaint still under investigation. Troubling situation.', sentiment: -45, keywords: ['Title IX', 'complaint', 'investigation'], flag: true },
    { text: 'Duke basketball recruiting class is ridiculous. Three top-10 players in one class.', sentiment: 88, keywords: ['recruiting', 'basketball', 'Duke'], flag: false },
    { text: 'Manny Diaz\'s offense is actually improving. Football isn\'t hopeless after all.', sentiment: 45, keywords: ['football', 'Manny Diaz', 'offense'], flag: false },
    { text: 'Duke men\'s tennis national championship. Overlooked but elite program.', sentiment: 80, keywords: ['tennis', 'national championship', 'Duke'], flag: false },
    { text: 'Duke athlete experience scores are highest in Summit cohort. We care about our players.', sentiment: 84, keywords: ['athlete experience', 'survey', 'Duke'], flag: false },
    { text: 'Cameron Indoor sellout streak continues. Best home court advantage in the country.', sentiment: 86, keywords: ['basketball', 'Cameron', 'sellout'], flag: false },
    { text: 'Duke financial giving down compared to Alabama and Oregon. Need major donors engaged.', sentiment: -28, keywords: ['financial', 'donors', 'giving'], flag: false },
    { text: 'ACC schedule perfectly suited to Duke basketball strengths. Another top seed incoming.', sentiment: 82, keywords: ['basketball', 'ACC', 'schedule'], flag: false },
    { text: 'Duke NIL budget needs to increase. Losing recruits to schools with bigger collectives.', sentiment: -32, keywords: ['NIL', 'recruiting', 'budget'], flag: false },
    { text: 'Duke women\'s basketball headed to Elite Eight. Coach Moore is a genius tactician.', sentiment: 85, keywords: ['basketball', 'Elite Eight', 'Duke'], flag: false },
    { text: 'Duke academic support services rated #1 in ACC. This is what excellence looks like.', sentiment: 88, keywords: ['academics', 'support', 'ACC'], flag: false },
    { text: 'Duke staff culture survey score highest in our group. Retention of great coaches shows.', sentiment: 80, keywords: ['staff', 'culture', 'survey'], flag: false },
  ],
  kansas: [
    { text: 'Allen Fieldhouse is the best basketball arena in the country. Rock Chalk Jayhawk! #RCJH', sentiment: 92, keywords: ['basketball', 'Allen Fieldhouse', 'RCJH'], flag: false },
    { text: 'Bill Self is back and Kansas basketball is back. Best coach in the sport, period.', sentiment: 88, keywords: ['basketball', 'Bill Self', 'Kansas'], flag: false },
    { text: 'Kansas football is terrible. Lance Leipold has some progress but not enough yet.', sentiment: -48, keywords: ['football', 'Lance Leipold', 'Kansas'], flag: false },
    { text: 'EADA publicity gap at -59% is alarming. Kansas needs serious equity investment now.', sentiment: -70, keywords: ['EADA', 'publicity', 'equity'], flag: true },
    { text: 'Athletic director responds to misconduct allegations in football staff. Investigating.', sentiment: -55, keywords: ['misconduct', 'investigation', 'football'], flag: true },
    { text: 'Kansas basketball\'s recruiting class is elite. Blue chip players choosing Lawrence.', sentiment: 86, keywords: ['recruiting', 'basketball', 'Lawrence'], flag: false },
    { text: 'David Booth\'s $2.5M gift keeps Kansas basketball at elite level. Fieldhouse upgrade next?', sentiment: 78, keywords: ['donor', 'David Booth', 'basketball'], flag: false },
    { text: 'Kansas coaching salary gap is one of the worst in Big 12. Women deserve better.', sentiment: -60, keywords: ['coaching salary', 'equity', 'Big 12'], flag: true },
    { text: 'Brandon Schneider departure is a real loss for Kansas women\'s basketball program.', sentiment: -35, keywords: ['women\'s basketball', 'coach departure', 'Kansas'], flag: false },
    { text: 'Kansas survey scores lowest in cohort. Administration needs to hear this feedback.', sentiment: -42, keywords: ['survey', 'administration', 'feedback'], flag: false },
    { text: 'Rock Chalk atmosphere at Fieldhouse is unmatched. Best fans in college basketball.', sentiment: 88, keywords: ['basketball', 'atmosphere', 'fans'], flag: false },
    { text: 'Kansas football snaps losing streak! Leipold showing real progress in year three.', sentiment: 72, keywords: ['football', 'Leipold', 'winning'], flag: false },
    { text: 'Kansas APR improving but football program still the weak link. Need more resources.', sentiment: -22, keywords: ['APR', 'football', 'academics'], flag: false },
    { text: 'Big 12 is the best conference for basketball. Kansas always at the top. Rock Chalk.', sentiment: 83, keywords: ['basketball', 'Big 12', 'conference'], flag: false },
    { text: 'Kansas unequal treatment Title IX complaint still unresolved after 6 months. Unacceptable.', sentiment: -58, keywords: ['Title IX', 'complaint', 'unequal treatment'], flag: true },
    { text: 'Kansas men\'s basketball in top 4 nationally again. Self is truly one of a kind.', sentiment: 87, keywords: ['basketball', 'top 4', 'Bill Self'], flag: false },
    { text: 'Kansas women\'s volleyball having best season in program history. Give them more support!', sentiment: 76, keywords: ['volleyball', 'womens sports', 'Kansas'], flag: false },
    { text: 'Kansas donor base is almost entirely men\'s basketball focused. Need diversification.', sentiment: -30, keywords: ['donors', 'basketball', 'diversification'], flag: false },
    { text: 'Kansas track and field program quietly excellent. National qualifiers across events.', sentiment: 72, keywords: ['track', 'national', 'Kansas'], flag: false },
    { text: 'Kansas athletics budget cuts to non-revenue sports are short-sighted. Shame on admin.', sentiment: -52, keywords: ['budget', 'cuts', 'non-revenue sports'], flag: false },
  ],
}

const SCHOOL_QUERIES: Record<string, { name: string; mascot: string }> = {
  michigan: { name: 'Michigan', mascot: 'Wolverines' },
  alabama: { name: 'Alabama', mascot: 'Crimson Tide' },
  oregon: { name: 'Oregon', mascot: 'Ducks' },
  duke: { name: 'Duke', mascot: 'Blue Devils' },
  kansas: { name: 'Kansas', mascot: 'Jayhawks' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const institutionSlug = searchParams.get('institutionSlug') ?? 'michigan'
  const demoMode = searchParams.get('demo') === 'true'

  if (demoMode || !process.env.TWITTER_BEARER_TOKEN) {
    const signals = (DEMO_SIGNALS[institutionSlug] ?? DEMO_SIGNALS.michigan).map((s, i) => ({
      id: `demo-${institutionSlug}-${i}`,
      platform: 'twitter',
      post_text: s.text,
      sentiment_score: s.sentiment + (Math.random() * 6 - 3), // ±3 jitter
      keywords: s.keywords,
      flag: s.flag,
      scraped_at: new Date(Date.now() - i * 18 * 60_000).toISOString(),
    }))
    return NextResponse.json({ signals, source: 'demo' })
  }

  const school = SCHOOL_QUERIES[institutionSlug]
  if (!school) return NextResponse.json({ error: 'Unknown slug' }, { status: 400 })

  // Fetch from Twitter API v2
  const query = encodeURIComponent(`(${school.name} athletics OR ${school.mascot}) -is:retweet lang:en`)
  const twitterRes = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=20&tweet.fields=created_at,public_metrics`,
    { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } }
  )

  if (!twitterRes.ok) {
    return NextResponse.json({ error: 'Twitter API error', status: twitterRes.status }, { status: 502 })
  }

  const { data: tweets } = await twitterRes.json()
  if (!tweets?.length) return NextResponse.json({ signals: [], source: 'live' })

  // Score sentiment with Claude
  const client = new Anthropic()
  const signals = await Promise.all(
    tweets.map(async (tweet: { id: string; text: string; created_at: string }) => {
      let parsed = { score: 0, keywords: [] as string[], flag: false }
      try {
        const msg = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 100,
          system: 'Return only JSON: {"score": number from -100 to 100, "keywords": string[], "flag": boolean}',
          messages: [{ role: 'user', content: `Score this tweet's sentiment about the university athletics program: ${tweet.text}` }],
        })
        const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
        parsed = JSON.parse(text.trim())
      } catch { /* keep defaults */ }

      return {
        id: tweet.id,
        platform: 'twitter',
        post_text: tweet.text,
        sentiment_score: parsed.score,
        keywords: parsed.keywords,
        flag: parsed.flag,
        scraped_at: tweet.created_at,
      }
    })
  )

  // Upsert to Supabase
  const supabase = createServerSupabaseClient()
  await supabase.from('social_signals').upsert(
    signals.map((s) => ({
      institution_id: institutionSlug,
      platform: s.platform,
      post_text: s.post_text,
      sentiment_score: s.sentiment_score,
      keywords: s.keywords,
      scraped_at: s.scraped_at,
    }))
  )

  return NextResponse.json({ signals, source: 'live' })
}

/**
 * donor-scraper.ts
 *
 * Playwright-based scraper for university athletics foundation donor pages.
 * Each institution has unique DOM structure — customize selectors per school below.
 *
 * Prerequisites:
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   const events = await scrapeDonorPage('michigan')
 */

// import { chromium } from 'playwright'   // Uncomment when Playwright is installed

export interface DonorEvent {
  institution_id: string
  donor_name: string
  amount_usd: number
  gift_date: string       // YYYY-MM-DD
  designated_sport: string | null
  facility_name: string | null
  source_url: string
}

const INSTITUTION_URLS: Record<string, string> = {
  michigan: 'https://mgoblue.com/giving',
  alabama:  'https://rolltide.com/giving',
  oregon:   'https://goducks.com/giving',
  duke:     'https://goduke.com/giving',
  kansas:   'https://kuathletics.com/giving',
}

/**
 * Parses a string like "$2.5M", "$250K", "$1,200,000" into a number.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, '').toUpperCase()
  if (cleaned.endsWith('M')) return parseFloat(cleaned) * 1_000_000
  if (cleaned.endsWith('K')) return parseFloat(cleaned) * 1_000
  return parseFloat(cleaned) || 0
}

export async function scrapeDonorPage(institutionSlug: string): Promise<DonorEvent[]> {
  const baseUrl = INSTITUTION_URLS[institutionSlug]
  if (!baseUrl) throw new Error(`Unknown institution slug: ${institutionSlug}`)

  // TODO: Uncomment and configure Playwright when dependencies are installed:
  //
  // const browser = await chromium.launch({ headless: true })
  // const page = await browser.newPage()
  // await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30_000 })
  //
  // // === Common pattern A: Named gift tables ===
  // // Seen on: many Big Ten/ACC schools using Sidearm Sports CMS
  // //
  // // const rows = await page.$$eval('.named-gift-table tr', (trs) =>
  // //   trs.map((tr) => ({
  // //     name:   tr.querySelector('.donor-name')?.textContent?.trim() ?? '',
  // //     amount: tr.querySelector('.gift-amount')?.textContent?.trim() ?? '',
  // //     sport:  tr.querySelector('.designated-sport')?.textContent?.trim() ?? null,
  // //     date:   tr.querySelector('.gift-date')?.textContent?.trim() ?? '',
  // //   }))
  // // )
  //
  // // === Common pattern B: Foundation honor roll (PDF-rendered HTML) ===
  // // Seen on: SEC schools using collegiate foundation software
  // //
  // // const rows = await page.$$eval('.honor-roll-entry', (els) =>
  // //   els.map((el) => ({
  // //     name:   el.querySelector('[data-field="contributor"]')?.textContent?.trim() ?? '',
  // //     amount: el.querySelector('[data-field="amount"]')?.textContent?.trim() ?? '',
  // //     sport:  el.querySelector('[data-field="fund-name"]')?.textContent?.trim() ?? null,
  // //     date:   el.querySelector('[data-field="date"]')?.textContent?.trim() ?? '',
  // //   }))
  // // )
  //
  // // === Common pattern C: JavaScript-rendered donor list (React/Vue SPA) ===
  // // Seen on: modern athletics sites using Donors.com or GiveCampus embeds
  // //
  // // await page.waitForSelector('.donor-wall-item', { timeout: 10_000 })
  // // const rows = await page.$$eval('.donor-wall-item', (els) =>
  // //   els.map((el) => ({
  // //     name:   el.querySelector('.donor-display-name')?.textContent?.trim() ?? '',
  // //     amount: el.querySelector('.gift-total')?.textContent?.trim() ?? '',
  // //     sport:  el.querySelector('.fund-label')?.textContent?.trim() ?? null,
  // //     date:   new Date().toISOString().split('T')[0], // often not exposed
  // //   }))
  // // )
  //
  // await browser.close()
  //
  // return rows.map((r) => ({
  //   institution_id: institutionSlug,
  //   donor_name:     r.name,
  //   amount_usd:     parseAmount(r.amount),
  //   gift_date:      r.date || new Date().toISOString().split('T')[0],
  //   designated_sport: r.sport || null,
  //   facility_name:  null,
  //   source_url:     baseUrl,
  // })).filter((e) => e.donor_name && e.amount_usd > 0)

  // ── Stub return (remove once Playwright is wired up) ──────────────────────
  console.log(`[donor-scraper] Stub: would scrape ${baseUrl}`)
  return [
    {
      institution_id: institutionSlug,
      donor_name: 'Sample Foundation',
      amount_usd: 100_000,
      gift_date: new Date().toISOString().split('T')[0],
      designated_sport: 'Athletic Fund',
      facility_name: null,
      source_url: baseUrl,
    },
  ]
}

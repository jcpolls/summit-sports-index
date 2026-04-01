// Hardcoded donor events matching the structure of scripts/seed.ts
// 25 events per school = 125 total, spread over 2023-09-01 to 2025-02-28

export interface SeedDonorEvent {
  id: string
  institution_id: string // slug used as id
  donor_name: string
  amount_usd: number
  gift_date: string // YYYY-MM-DD
  designated_sport: string | null
  facility_name: string | null
}

const SPORTS_M = ['Football', "Men's Basketball", 'Baseball', "Men's Tennis", "Men's Track & Field"]
const SPORTS_W = ["Women's Basketball", "Women's Soccer", "Women's Volleyball", "Women's Swimming & Diving"]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SPORTS_G = ['Athletic Fund', 'Facilities', 'General Athletics']

export function sportColor(sport: string | null): string {
  if (!sport) return '#6B7280'
  if (SPORTS_M.includes(sport)) return '#3B82F6'
  if (SPORTS_W.includes(sport)) return '#F43F5E'
  return '#6B7280'
}

export function sportCategory(sport: string | null): 'men' | 'women' | 'general' {
  if (!sport) return 'general'
  if (SPORTS_M.includes(sport)) return 'men'
  if (SPORTS_W.includes(sport)) return 'women'
  return 'general'
}

export const SEED_DONOR_EVENTS: SeedDonorEvent[] = [
  // ─── MICHIGAN (25) ───────────────────────────────────────────────────────────
  { id: 'de-m01', institution_id: 'michigan', donor_name: 'William Harbaugh', amount_usd: 5_000_000, gift_date: '2024-09-15', designated_sport: 'Football', facility_name: 'Harbaugh Football Complex' },
  { id: 'de-m02', institution_id: 'michigan', donor_name: 'Robert Ufer Foundation', amount_usd: 2_500_000, gift_date: '2024-01-10', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-m03', institution_id: 'michigan', donor_name: 'Sarah Canham', amount_usd: 500_000, gift_date: '2024-03-22', designated_sport: "Women's Swimming & Diving", facility_name: null },
  { id: 'de-m04', institution_id: 'michigan', donor_name: 'Richard Whitmore', amount_usd: 250_000, gift_date: '2024-11-05', designated_sport: 'Football', facility_name: null },
  { id: 'de-m05', institution_id: 'michigan', donor_name: 'Patricia Chen', amount_usd: 200_000, gift_date: '2024-06-30', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-m06', institution_id: 'michigan', donor_name: 'James O\'Brien', amount_usd: 150_000, gift_date: '2023-12-01', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-m07', institution_id: 'michigan', donor_name: 'Susan Patel', amount_usd: 125_000, gift_date: '2024-07-14', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-m08', institution_id: 'michigan', donor_name: 'Thomas Garcia', amount_usd: 100_000, gift_date: '2023-09-20', designated_sport: 'Football', facility_name: null },
  { id: 'de-m09', institution_id: 'michigan', donor_name: 'Nancy Kim', amount_usd: 75_000, gift_date: '2024-02-28', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-m10', institution_id: 'michigan', donor_name: 'Robert Thompson', amount_usd: 50_000, gift_date: '2025-01-08', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-m11', institution_id: 'michigan', donor_name: 'Linda Nakamura', amount_usd: 45_000, gift_date: '2024-10-15', designated_sport: "Men's Track & Field", facility_name: null },
  { id: 'de-m12', institution_id: 'michigan', donor_name: 'David Martinez', amount_usd: 38_000, gift_date: '2024-05-22', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-m13', institution_id: 'michigan', donor_name: 'Emily Johansson', amount_usd: 30_000, gift_date: '2023-11-11', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-m14', institution_id: 'michigan', donor_name: 'Alan Bergstrom', amount_usd: 25_000, gift_date: '2024-08-03', designated_sport: 'Football', facility_name: null },
  { id: 'de-m15', institution_id: 'michigan', donor_name: 'Carol Reed', amount_usd: 20_000, gift_date: '2024-04-19', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-m16', institution_id: 'michigan', donor_name: 'Michael Flynn', amount_usd: 18_000, gift_date: '2023-10-07', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-m17', institution_id: 'michigan', donor_name: 'Janet Osei', amount_usd: 15_000, gift_date: '2024-12-20', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-m18', institution_id: 'michigan', donor_name: 'Kevin Walsh', amount_usd: 12_000, gift_date: '2024-09-01', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-m19', institution_id: 'michigan', donor_name: 'Diane Horton', amount_usd: 10_000, gift_date: '2025-02-14', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-m20', institution_id: 'michigan', donor_name: 'Paul Sterling', amount_usd: 9_000, gift_date: '2024-01-30', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-m21', institution_id: 'michigan', donor_name: 'Maria Kopecky', amount_usd: 8_000, gift_date: '2024-06-11', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-m22', institution_id: 'michigan', donor_name: 'Andrew Foss', amount_usd: 7_500, gift_date: '2023-09-05', designated_sport: "Men's Tennis", facility_name: null },
  { id: 'de-m23', institution_id: 'michigan', donor_name: 'Lisa Takahashi', amount_usd: 7_000, gift_date: '2024-03-01', designated_sport: "Women's Swimming & Diving", facility_name: null },
  { id: 'de-m24', institution_id: 'michigan', donor_name: 'Brian Hollander', amount_usd: 6_000, gift_date: '2024-11-22', designated_sport: 'Football', facility_name: null },
  { id: 'de-m25', institution_id: 'michigan', donor_name: 'Rachel Odom', amount_usd: 5_000, gift_date: '2025-01-25', designated_sport: "Women's Basketball", facility_name: null },

  // ─── ALABAMA (25) ────────────────────────────────────────────────────────────
  { id: 'de-a01', institution_id: 'alabama', donor_name: 'Paul Bryant Jr.', amount_usd: 4_000_000, gift_date: '2024-08-01', designated_sport: 'Football', facility_name: 'Bryant-Denny Expansion' },
  { id: 'de-a02', institution_id: 'alabama', donor_name: 'Mal Moore Foundation', amount_usd: 3_000_000, gift_date: '2023-10-15', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-a03', institution_id: 'alabama', donor_name: 'Nick Saban Charitable Trust', amount_usd: 1_000_000, gift_date: '2024-05-10', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-a04', institution_id: 'alabama', donor_name: 'William Hargrove', amount_usd: 500_000, gift_date: '2024-11-20', designated_sport: 'Football', facility_name: null },
  { id: 'de-a05', institution_id: 'alabama', donor_name: 'Barbara Tillman', amount_usd: 250_000, gift_date: '2024-02-14', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-a06', institution_id: 'alabama', donor_name: 'Charles Redding', amount_usd: 200_000, gift_date: '2023-12-05', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-a07', institution_id: 'alabama', donor_name: 'Dorothy Faircloth', amount_usd: 175_000, gift_date: '2024-07-22', designated_sport: 'Football', facility_name: null },
  { id: 'de-a08', institution_id: 'alabama', donor_name: 'George Pickens', amount_usd: 125_000, gift_date: '2024-04-08', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-a09', institution_id: 'alabama', donor_name: 'Margaret Bankston', amount_usd: 100_000, gift_date: '2025-01-12', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-a10', institution_id: 'alabama', donor_name: 'Frank Sizemore', amount_usd: 75_000, gift_date: '2024-09-30', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-a11', institution_id: 'alabama', donor_name: 'Helen Crowley', amount_usd: 50_000, gift_date: '2023-09-12', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-a12', institution_id: 'alabama', donor_name: 'Edward Poole', amount_usd: 42_000, gift_date: '2024-06-18', designated_sport: 'Football', facility_name: null },
  { id: 'de-a13', institution_id: 'alabama', donor_name: 'Ruth Calloway', amount_usd: 35_000, gift_date: '2024-01-25', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-a14', institution_id: 'alabama', donor_name: 'James Lockhart', amount_usd: 28_000, gift_date: '2024-10-10', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-a15', institution_id: 'alabama', donor_name: 'Susan Whitfield', amount_usd: 22_000, gift_date: '2023-11-08', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-a16', institution_id: 'alabama', donor_name: 'Thomas Beasley', amount_usd: 18_000, gift_date: '2024-03-17', designated_sport: 'Football', facility_name: null },
  { id: 'de-a17', institution_id: 'alabama', donor_name: 'Patricia Dunlap', amount_usd: 16_000, gift_date: '2024-12-01', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-a18', institution_id: 'alabama', donor_name: 'Robert Ingram', amount_usd: 14_000, gift_date: '2025-02-01', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-a19', institution_id: 'alabama', donor_name: 'Carol Shelton', amount_usd: 12_000, gift_date: '2024-08-22', designated_sport: "Men's Track & Field", facility_name: null },
  { id: 'de-a20', institution_id: 'alabama', donor_name: 'Mark Benson', amount_usd: 10_000, gift_date: '2024-05-30', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-a21', institution_id: 'alabama', donor_name: 'Nancy Pruitt', amount_usd: 9_000, gift_date: '2023-10-20', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-a22', institution_id: 'alabama', donor_name: 'Kevin Ashford', amount_usd: 8_000, gift_date: '2024-02-08', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-a23', institution_id: 'alabama', donor_name: 'Diane Pittman', amount_usd: 7_000, gift_date: '2024-09-05', designated_sport: 'Football', facility_name: null },
  { id: 'de-a24', institution_id: 'alabama', donor_name: 'Andrew Greer', amount_usd: 6_000, gift_date: '2025-01-28', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-a25', institution_id: 'alabama', donor_name: 'Lisa Holbrook', amount_usd: 5_000, gift_date: '2024-07-07', designated_sport: "Men's Basketball", facility_name: null },

  // ─── OREGON (25) ─────────────────────────────────────────────────────────────
  { id: 'de-o01', institution_id: 'oregon', donor_name: 'Phil Knight', amount_usd: 5_000_000, gift_date: '2024-06-01', designated_sport: 'Athletic Fund', facility_name: 'Knight Campus' },
  { id: 'de-o02', institution_id: 'oregon', donor_name: 'Phil Knight', amount_usd: 5_000_000, gift_date: '2023-09-15', designated_sport: 'Football', facility_name: null },
  { id: 'de-o03', institution_id: 'oregon', donor_name: 'Mark Johnson Family Foundation', amount_usd: 1_500_000, gift_date: '2024-10-22', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-o04', institution_id: 'oregon', donor_name: 'Lisa Hatfield', amount_usd: 750_000, gift_date: '2024-03-05', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-o05', institution_id: 'oregon', donor_name: 'Philip Knighton', amount_usd: 500_000, gift_date: '2024-01-20', designated_sport: 'Football', facility_name: null },
  { id: 'de-o06', institution_id: 'oregon', donor_name: 'Sandra Wu', amount_usd: 300_000, gift_date: '2024-08-14', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-o07', institution_id: 'oregon', donor_name: 'Kenneth Bridges', amount_usd: 200_000, gift_date: '2023-11-30', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-o08', institution_id: 'oregon', donor_name: 'Carol Lindgren', amount_usd: 150_000, gift_date: '2024-05-18', designated_sport: 'Football', facility_name: null },
  { id: 'de-o09', institution_id: 'oregon', donor_name: 'Steven Park', amount_usd: 125_000, gift_date: '2024-11-11', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-o10', institution_id: 'oregon', donor_name: 'Diane Foster', amount_usd: 100_000, gift_date: '2025-02-10', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-o11', institution_id: 'oregon', donor_name: 'Mark Jeffries', amount_usd: 75_000, gift_date: '2024-07-25', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-o12', institution_id: 'oregon', donor_name: 'Lisa Yamamoto', amount_usd: 50_000, gift_date: '2024-02-02', designated_sport: "Women's Swimming & Diving", facility_name: null },
  { id: 'de-o13', institution_id: 'oregon', donor_name: 'Andrew Collins', amount_usd: 40_000, gift_date: '2024-09-09', designated_sport: 'Football', facility_name: null },
  { id: 'de-o14', institution_id: 'oregon', donor_name: 'Michelle Rivera', amount_usd: 32_000, gift_date: '2023-10-01', designated_sport: "Men's Track & Field", facility_name: null },
  { id: 'de-o15', institution_id: 'oregon', donor_name: 'Jason Holloway', amount_usd: 25_000, gift_date: '2024-04-15', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-o16', institution_id: 'oregon', donor_name: 'Brenda Castillo', amount_usd: 20_000, gift_date: '2024-12-18', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-o17', institution_id: 'oregon', donor_name: 'Scott Nguyen', amount_usd: 18_000, gift_date: '2025-01-05', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-o18', institution_id: 'oregon', donor_name: 'Wendy Osborn', amount_usd: 15_000, gift_date: '2024-06-22', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-o19', institution_id: 'oregon', donor_name: 'Gary Pearce', amount_usd: 12_000, gift_date: '2024-10-30', designated_sport: 'Football', facility_name: null },
  { id: 'de-o20', institution_id: 'oregon', donor_name: 'Tina Romero', amount_usd: 10_000, gift_date: '2024-03-28', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-o21', institution_id: 'oregon', donor_name: 'Patrick Doyle', amount_usd: 9_000, gift_date: '2023-12-12', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-o22', institution_id: 'oregon', donor_name: 'Cynthia Berg', amount_usd: 8_000, gift_date: '2024-08-08', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-o23', institution_id: 'oregon', donor_name: 'Douglas Price', amount_usd: 7_000, gift_date: '2025-02-20', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-o24', institution_id: 'oregon', donor_name: 'Angela Steele', amount_usd: 6_500, gift_date: '2024-01-08', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-o25', institution_id: 'oregon', donor_name: 'Raymond Torres', amount_usd: 5_500, gift_date: '2024-07-01', designated_sport: "Men's Tennis", facility_name: null },

  // ─── DUKE (25) ───────────────────────────────────────────────────────────────
  { id: 'de-d01', institution_id: 'duke', donor_name: 'David Rubenstein', amount_usd: 3_500_000, gift_date: '2024-04-12', designated_sport: "Men's Basketball", facility_name: 'Rubenstein Arena' },
  { id: 'de-d02', institution_id: 'duke', donor_name: 'John Gerngross', amount_usd: 1_200_000, gift_date: '2023-11-01', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-d03', institution_id: 'duke', donor_name: 'Anne Ford', amount_usd: 800_000, gift_date: '2024-07-30', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-d04', institution_id: 'duke', donor_name: 'Gregory Wainwright', amount_usd: 400_000, gift_date: '2024-01-15', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-d05', institution_id: 'duke', donor_name: 'Virginia Blackwell', amount_usd: 250_000, gift_date: '2024-09-25', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-d06', institution_id: 'duke', donor_name: 'Harold Pennington', amount_usd: 175_000, gift_date: '2024-03-10', designated_sport: 'Football', facility_name: null },
  { id: 'de-d07', institution_id: 'duke', donor_name: 'Janet Worthington', amount_usd: 150_000, gift_date: '2023-09-28', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-d08', institution_id: 'duke', donor_name: 'Raymond Sutton', amount_usd: 100_000, gift_date: '2024-06-05', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-d09', institution_id: 'duke', donor_name: 'Catherine Aldridge', amount_usd: 85_000, gift_date: '2024-11-15', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-d10', institution_id: 'duke', donor_name: 'Paul Fitzgerald', amount_usd: 75_000, gift_date: '2025-01-20', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-d11', institution_id: 'duke', donor_name: 'Alice Moreau', amount_usd: 50_000, gift_date: '2024-02-22', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-d12', institution_id: 'duke', donor_name: 'Bruce Ellison', amount_usd: 42_000, gift_date: '2024-08-19', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-d13', institution_id: 'duke', donor_name: 'Diana Hoffman', amount_usd: 35_000, gift_date: '2023-12-22', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-d14', institution_id: 'duke', donor_name: 'Eric Montgomery', amount_usd: 28_000, gift_date: '2024-05-05', designated_sport: 'Football', facility_name: null },
  { id: 'de-d15', institution_id: 'duke', donor_name: 'Frances Lawson', amount_usd: 22_000, gift_date: '2024-10-02', designated_sport: "Men's Tennis", facility_name: null },
  { id: 'de-d16', institution_id: 'duke', donor_name: 'Gary Underhill', amount_usd: 18_000, gift_date: '2024-04-28', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-d17', institution_id: 'duke', donor_name: 'Helen Prescott', amount_usd: 15_000, gift_date: '2025-02-05', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-d18', institution_id: 'duke', donor_name: 'Ivan Stanton', amount_usd: 12_000, gift_date: '2024-07-11', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-d19', institution_id: 'duke', donor_name: 'Julia Crane', amount_usd: 10_000, gift_date: '2023-10-14', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-d20', institution_id: 'duke', donor_name: 'Kyle Barker', amount_usd: 9_000, gift_date: '2024-12-10', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-d21', institution_id: 'duke', donor_name: 'Laura Simmons', amount_usd: 8_000, gift_date: '2024-02-05', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-d22', institution_id: 'duke', donor_name: 'Morris Finley', amount_usd: 7_000, gift_date: '2024-09-17', designated_sport: 'Football', facility_name: null },
  { id: 'de-d23', institution_id: 'duke', donor_name: 'Nicole Graves', amount_usd: 6_000, gift_date: '2025-01-03', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-d24', institution_id: 'duke', donor_name: 'Oscar Flemming', amount_usd: 5_500, gift_date: '2024-06-27', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-d25', institution_id: 'duke', donor_name: 'Penelope Ashe', amount_usd: 5_000, gift_date: '2024-03-30', designated_sport: "Women's Soccer", facility_name: null },

  // ─── KANSAS (25) ─────────────────────────────────────────────────────────────
  { id: 'de-k01', institution_id: 'kansas', donor_name: 'David Booth', amount_usd: 2_500_000, gift_date: '2024-05-14', designated_sport: "Men's Basketball", facility_name: 'Booth Family Hall' },
  { id: 'de-k02', institution_id: 'kansas', donor_name: 'Dolph Simons Jr.', amount_usd: 1_000_000, gift_date: '2023-09-30', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-k03', institution_id: 'kansas', donor_name: 'Bill Self Foundation', amount_usd: 500_000, gift_date: '2024-02-18', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-k04', institution_id: 'kansas', donor_name: 'Carl Bolander', amount_usd: 250_000, gift_date: '2024-10-05', designated_sport: 'Football', facility_name: null },
  { id: 'de-k05', institution_id: 'kansas', donor_name: 'Martha Phipps', amount_usd: 150_000, gift_date: '2024-07-19', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-k06', institution_id: 'kansas', donor_name: 'Roy Williams Trust', amount_usd: 125_000, gift_date: '2023-12-15', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-k07', institution_id: 'kansas', donor_name: 'Sharon Ballard', amount_usd: 100_000, gift_date: '2024-04-02', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-k08', institution_id: 'kansas', donor_name: 'Timothy Hawkins', amount_usd: 75_000, gift_date: '2025-01-30', designated_sport: 'Football', facility_name: null },
  { id: 'de-k09', institution_id: 'kansas', donor_name: 'Catherine Spence', amount_usd: 50_000, gift_date: '2024-08-28', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-k10', institution_id: 'kansas', donor_name: 'Douglas Mercer', amount_usd: 42_000, gift_date: '2024-11-30', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-k11', institution_id: 'kansas', donor_name: 'Elizabeth Thorn', amount_usd: 35_000, gift_date: '2024-01-22', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-k12', institution_id: 'kansas', donor_name: 'Franklin Holt', amount_usd: 28_000, gift_date: '2024-06-14', designated_sport: 'Football', facility_name: null },
  { id: 'de-k13', institution_id: 'kansas', donor_name: 'Grace Weston', amount_usd: 22_000, gift_date: '2023-10-25', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-k14', institution_id: 'kansas', donor_name: 'Howard Crane', amount_usd: 18_000, gift_date: '2024-03-15', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-k15', institution_id: 'kansas', donor_name: 'Irene Stafford', amount_usd: 15_000, gift_date: '2024-09-20', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-k16', institution_id: 'kansas', donor_name: 'Jack Dalton', amount_usd: 12_000, gift_date: '2024-12-28', designated_sport: 'Football', facility_name: null },
  { id: 'de-k17', institution_id: 'kansas', donor_name: 'Karen Sheffield', amount_usd: 10_000, gift_date: '2025-02-07', designated_sport: "Women's Basketball", facility_name: null },
  { id: 'de-k18', institution_id: 'kansas', donor_name: 'Leonard Quinn', amount_usd: 9_000, gift_date: '2024-05-08', designated_sport: 'Baseball', facility_name: null },
  { id: 'de-k19', institution_id: 'kansas', donor_name: 'Mildred Owens', amount_usd: 8_000, gift_date: '2024-10-17', designated_sport: 'General Athletics', facility_name: null },
  { id: 'de-k20', institution_id: 'kansas', donor_name: 'Norman Eaton', amount_usd: 7_000, gift_date: '2023-11-20', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-k21', institution_id: 'kansas', donor_name: 'Olivia Marsh', amount_usd: 7_000, gift_date: '2024-02-28', designated_sport: "Women's Soccer", facility_name: null },
  { id: 'de-k22', institution_id: 'kansas', donor_name: 'Peter Caldwell', amount_usd: 6_000, gift_date: '2024-07-23', designated_sport: 'Athletic Fund', facility_name: null },
  { id: 'de-k23', institution_id: 'kansas', donor_name: 'Quentin Nash', amount_usd: 6_000, gift_date: '2025-01-10', designated_sport: "Men's Basketball", facility_name: null },
  { id: 'de-k24', institution_id: 'kansas', donor_name: 'Rita Barlow', amount_usd: 5_500, gift_date: '2024-04-20', designated_sport: "Women's Volleyball", facility_name: null },
  { id: 'de-k25', institution_id: 'kansas', donor_name: 'Samuel Vance', amount_usd: 5_000, gift_date: '2024-09-03', designated_sport: "Men's Track & Field", facility_name: null },
]

// ─── Computed helpers ─────────────────────────────────────────────────────────

export function formatAmount(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`
  if (usd >= 1_000) return `$${Math.round(usd / 1_000)}K`
  return `$${usd.toLocaleString()}`
}

export function ytdBySport(institutionId: string, year = new Date().getFullYear()) {
  const events = SEED_DONOR_EVENTS.filter(
    (e) => e.institution_id === institutionId && new Date(e.gift_date).getFullYear() === year
  )
  const map: Record<string, { total: number; count: number; max: number }> = {}
  for (const e of events) {
    const sport = e.designated_sport ?? 'General Athletics'
    if (!map[sport]) map[sport] = { total: 0, count: 0, max: 0 }
    map[sport].total += e.amount_usd
    map[sport].count += 1
    map[sport].max = Math.max(map[sport].max, e.amount_usd)
  }
  return Object.entries(map)
    .map(([sport, d]) => ({ sport, ...d, avg: Math.round(d.total / d.count), color: sportColor(sport) }))
    .sort((a, b) => b.total - a.total)
}

export function monthlyTrend(institutionId: string) {
  const now = new Date()
  const months: string[] = []
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const events = SEED_DONOR_EVENTS.filter((e) => e.institution_id === institutionId)

  return months.map((ym) => {
    const [y, m] = ym.split('-').map(Number)
    const monthEvents = events.filter((e) => {
      const d = new Date(e.gift_date)
      return d.getFullYear() === y && d.getMonth() + 1 === m
    })
    const total = monthEvents.reduce((s, e) => s + e.amount_usd, 0)
    const major = monthEvents.filter((e) => e.amount_usd > 100_000).reduce((s, e) => s + e.amount_usd, 0)
    const annual = monthEvents.filter((e) => e.amount_usd < 10_000).reduce((s, e) => s + e.amount_usd, 0)
    const megaGift = monthEvents.find((e) => e.amount_usd >= 1_000_000)

    const date = new Date(y, m - 1, 1)
    const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    return { month: ym, label, total, major, annual, megaGift: megaGift ?? null }
  })
}

export function peerComparison(institutionId: string) {
  const schools = ['michigan', 'alabama', 'oregon', 'duke', 'kansas']
  const getStats = (id: string) => {
    const events = SEED_DONOR_EVENTS.filter((e) => e.institution_id === id)
    const total = events.reduce((s, e) => s + e.amount_usd, 0)
    const avg = events.length ? Math.round(total / events.length) : 0
    return { totalDonors: events.length, avgGift: avg, totalRaised: total }
  }
  const myStats = getStats(institutionId)
  const peerStats = schools.filter((s) => s !== institutionId).map(getStats)
  const avgDonors = Math.round(peerStats.reduce((s, p) => s + p.totalDonors, 0) / peerStats.length)
  const avgGift = Math.round(peerStats.reduce((s, p) => s + p.avgGift, 0) / peerStats.length)
  const avgRaised = Math.round(peerStats.reduce((s, p) => s + p.totalRaised, 0) / peerStats.length)
  return { mine: myStats, peerAvg: { totalDonors: avgDonors, avgGift, totalRaised: avgRaised } }
}

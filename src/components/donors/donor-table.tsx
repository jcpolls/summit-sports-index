'use client'

import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SchoolLogo } from '@/components/shared/school-logo'
import { useRole } from '@/lib/providers/role-provider'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { anonymizeDonor } from '@/lib/utils/permissions'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { SCHOOLS } from '@/lib/constants/schools'
import { Donor, DonorTier } from '@/types/database'
import { DonorDetailDialog } from '@/components/donors/donor-detail-dialog'
import { CheckCircle, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TIER_STYLES: Record<DonorTier, string> = {
  platinum: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  silver: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
}

// 50 donors, 10 per school
const SEED_DONORS: Donor[] = [
  // Michigan (10)
  { id: 'd1', school_id: 'michigan', first_name: 'Richard', last_name: 'Whitmore', email: 'rwhitmore@umich.edu', donor_tier: 'platinum', lifetime_total: 2500000000, first_gift_date: '2005-09-15', last_gift_date: '2025-01-20', is_board_member: true, affiliation: 'Alumni - Class of 1982', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd2', school_id: 'michigan', first_name: 'Patricia', last_name: 'Chen', email: 'pchen@gmail.com', donor_tier: 'platinum', lifetime_total: 1800000000, first_gift_date: '2010-03-22', last_gift_date: '2024-11-15', is_board_member: true, affiliation: 'Alumni - Class of 1990', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd3', school_id: 'michigan', first_name: 'James', last_name: 'O\'Brien', email: 'jobrien@whitmorecap.com', donor_tier: 'gold', lifetime_total: 750000000, first_gift_date: '2012-06-01', last_gift_date: '2025-02-28', is_board_member: false, affiliation: 'Alumni - Class of 1995', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd4', school_id: 'michigan', first_name: 'Susan', last_name: 'Patel', email: 'spatel@patelventures.com', donor_tier: 'gold', lifetime_total: 520000000, first_gift_date: '2015-01-10', last_gift_date: '2024-09-05', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd5', school_id: 'michigan', first_name: 'Thomas', last_name: 'Garcia', email: 'tgarcia@email.com', donor_tier: 'silver', lifetime_total: 250000000, first_gift_date: '2016-08-20', last_gift_date: '2024-12-01', is_board_member: false, affiliation: 'Alumni - Class of 2001', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd6', school_id: 'michigan', first_name: 'Nancy', last_name: 'Kim', email: 'nkim@techfirm.io', donor_tier: 'silver', lifetime_total: 180000000, first_gift_date: '2018-02-14', last_gift_date: '2025-01-05', is_board_member: false, affiliation: 'Alumni - Class of 2005', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd7', school_id: 'michigan', first_name: 'Robert', last_name: 'Thompson', email: 'rthompson@email.com', donor_tier: 'silver', lifetime_total: 120000000, first_gift_date: '2019-04-30', last_gift_date: '2024-08-22', is_board_member: false, affiliation: 'Community Supporter', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd8', school_id: 'michigan', first_name: 'Linda', last_name: 'Nakamura', email: 'lnakamura@email.com', donor_tier: 'bronze', lifetime_total: 45000000, first_gift_date: '2020-11-11', last_gift_date: '2024-11-11', is_board_member: false, affiliation: 'Alumni - Class of 2010', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd9', school_id: 'michigan', first_name: 'David', last_name: 'Martinez', email: 'dmartinez@email.com', donor_tier: 'bronze', lifetime_total: 28000000, first_gift_date: '2021-06-15', last_gift_date: '2024-06-15', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd10', school_id: 'michigan', first_name: 'Emily', last_name: 'Johansson', email: 'ejohansson@email.com', donor_tier: 'bronze', lifetime_total: 15000000, first_gift_date: '2022-01-20', last_gift_date: '2025-01-20', is_board_member: false, affiliation: 'Alumni - Class of 2015', notes: null, is_demo: true, created_at: '2024-01-01' },
  // Alabama (10)
  { id: 'd11', school_id: 'alabama', first_name: 'William', last_name: 'Hargrove', email: 'whargrove@hargrovellc.com', donor_tier: 'platinum', lifetime_total: 3200000000, first_gift_date: '2002-01-15', last_gift_date: '2025-03-01', is_board_member: true, affiliation: 'Alumni - Class of 1978', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd12', school_id: 'alabama', first_name: 'Barbara', last_name: 'Tillman', email: 'btillman@email.com', donor_tier: 'platinum', lifetime_total: 2100000000, first_gift_date: '2006-09-01', last_gift_date: '2024-12-20', is_board_member: true, affiliation: 'Alumni - Class of 1985', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd13', school_id: 'alabama', first_name: 'Charles', last_name: 'Redding', email: 'credding@email.com', donor_tier: 'gold', lifetime_total: 680000000, first_gift_date: '2011-03-10', last_gift_date: '2025-01-30', is_board_member: false, affiliation: 'Alumni - Class of 1992', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd14', school_id: 'alabama', first_name: 'Dorothy', last_name: 'Faircloth', email: 'dfaircloth@email.com', donor_tier: 'gold', lifetime_total: 490000000, first_gift_date: '2013-07-22', last_gift_date: '2024-10-15', is_board_member: false, affiliation: 'Corporate - Faircloth Industries', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd15', school_id: 'alabama', first_name: 'George', last_name: 'Pickens', email: 'gpickens@email.com', donor_tier: 'silver', lifetime_total: 310000000, first_gift_date: '2015-05-05', last_gift_date: '2024-11-30', is_board_member: false, affiliation: 'Alumni - Class of 1998', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd16', school_id: 'alabama', first_name: 'Margaret', last_name: 'Bankston', email: 'mbankston@email.com', donor_tier: 'silver', lifetime_total: 195000000, first_gift_date: '2017-09-12', last_gift_date: '2024-09-12', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd17', school_id: 'alabama', first_name: 'Frank', last_name: 'Sizemore', email: 'fsizemore@email.com', donor_tier: 'silver', lifetime_total: 140000000, first_gift_date: '2018-11-20', last_gift_date: '2025-02-14', is_board_member: false, affiliation: 'Alumni - Class of 2003', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd18', school_id: 'alabama', first_name: 'Helen', last_name: 'Crowley', email: 'hcrowley@email.com', donor_tier: 'bronze', lifetime_total: 52000000, first_gift_date: '2020-03-01', last_gift_date: '2024-07-20', is_board_member: false, affiliation: 'Community Supporter', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd19', school_id: 'alabama', first_name: 'Edward', last_name: 'Poole', email: 'epoole@email.com', donor_tier: 'bronze', lifetime_total: 32000000, first_gift_date: '2021-01-10', last_gift_date: '2024-12-10', is_board_member: false, affiliation: 'Alumni - Class of 2008', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd20', school_id: 'alabama', first_name: 'Ruth', last_name: 'Calloway', email: 'rcalloway@email.com', donor_tier: 'bronze', lifetime_total: 18000000, first_gift_date: '2022-06-30', last_gift_date: '2025-01-15', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  // Oregon (10)
  { id: 'd21', school_id: 'oregon', first_name: 'Philip', last_name: 'Knighton', email: 'pknighton@knightonvc.com', donor_tier: 'platinum', lifetime_total: 5500000000, first_gift_date: '2000-06-01', last_gift_date: '2025-02-15', is_board_member: true, affiliation: 'Alumni - Class of 1975', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd22', school_id: 'oregon', first_name: 'Sandra', last_name: 'Wu', email: 'swu@techfund.com', donor_tier: 'platinum', lifetime_total: 1600000000, first_gift_date: '2008-02-20', last_gift_date: '2024-12-01', is_board_member: true, affiliation: 'Corporate - Wu Tech Holdings', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd23', school_id: 'oregon', first_name: 'Kenneth', last_name: 'Bridges', email: 'kbridges@email.com', donor_tier: 'gold', lifetime_total: 620000000, first_gift_date: '2012-04-18', last_gift_date: '2025-01-10', is_board_member: false, affiliation: 'Alumni - Class of 1988', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd24', school_id: 'oregon', first_name: 'Carol', last_name: 'Lindgren', email: 'clindgren@email.com', donor_tier: 'gold', lifetime_total: 440000000, first_gift_date: '2014-08-05', last_gift_date: '2024-08-05', is_board_member: false, affiliation: 'Alumni - Class of 1993', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd25', school_id: 'oregon', first_name: 'Steven', last_name: 'Park', email: 'spark@email.com', donor_tier: 'silver', lifetime_total: 275000000, first_gift_date: '2016-10-30', last_gift_date: '2024-10-30', is_board_member: false, affiliation: 'Alumni - Class of 2000', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd26', school_id: 'oregon', first_name: 'Diane', last_name: 'Foster', email: 'dfoster@email.com', donor_tier: 'silver', lifetime_total: 165000000, first_gift_date: '2018-05-25', last_gift_date: '2025-02-01', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd27', school_id: 'oregon', first_name: 'Mark', last_name: 'Jeffries', email: 'mjeffries@email.com', donor_tier: 'silver', lifetime_total: 110000000, first_gift_date: '2019-07-14', last_gift_date: '2024-07-14', is_board_member: false, affiliation: 'Alumni - Class of 2006', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd28', school_id: 'oregon', first_name: 'Lisa', last_name: 'Yamamoto', email: 'lyamamoto@email.com', donor_tier: 'bronze', lifetime_total: 48000000, first_gift_date: '2020-09-08', last_gift_date: '2024-09-08', is_board_member: false, affiliation: 'Community Supporter', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd29', school_id: 'oregon', first_name: 'Andrew', last_name: 'Collins', email: 'acollins@email.com', donor_tier: 'bronze', lifetime_total: 25000000, first_gift_date: '2021-11-22', last_gift_date: '2024-11-22', is_board_member: false, affiliation: 'Alumni - Class of 2012', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd30', school_id: 'oregon', first_name: 'Michelle', last_name: 'Rivera', email: 'mrivera@email.com', donor_tier: 'bronze', lifetime_total: 12000000, first_gift_date: '2023-03-15', last_gift_date: '2025-03-01', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  // Duke (10)
  { id: 'd31', school_id: 'duke', first_name: 'Gregory', last_name: 'Wainwright', email: 'gwainwright@wainwrightcap.com', donor_tier: 'platinum', lifetime_total: 4200000000, first_gift_date: '2001-10-01', last_gift_date: '2025-01-25', is_board_member: true, affiliation: 'Alumni - Class of 1980', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd32', school_id: 'duke', first_name: 'Virginia', last_name: 'Blackwell', email: 'vblackwell@email.com', donor_tier: 'platinum', lifetime_total: 2800000000, first_gift_date: '2004-05-12', last_gift_date: '2024-11-30', is_board_member: true, affiliation: 'Alumni - Class of 1983', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd33', school_id: 'duke', first_name: 'Harold', last_name: 'Pennington', email: 'hpennington@email.com', donor_tier: 'gold', lifetime_total: 880000000, first_gift_date: '2009-08-20', last_gift_date: '2025-02-10', is_board_member: false, affiliation: 'Alumni - Class of 1991', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd34', school_id: 'duke', first_name: 'Janet', last_name: 'Worthington', email: 'jworthington@email.com', donor_tier: 'gold', lifetime_total: 560000000, first_gift_date: '2011-12-01', last_gift_date: '2024-12-01', is_board_member: false, affiliation: 'Corporate - Worthington Group', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd35', school_id: 'duke', first_name: 'Raymond', last_name: 'Sutton', email: 'rsutton@email.com', donor_tier: 'silver', lifetime_total: 295000000, first_gift_date: '2014-04-15', last_gift_date: '2024-10-20', is_board_member: false, affiliation: 'Alumni - Class of 1997', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd36', school_id: 'duke', first_name: 'Catherine', last_name: 'Aldridge', email: 'caldridge@email.com', donor_tier: 'silver', lifetime_total: 210000000, first_gift_date: '2016-07-08', last_gift_date: '2025-01-08', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd37', school_id: 'duke', first_name: 'Paul', last_name: 'Fitzgerald', email: 'pfitzgerald@email.com', donor_tier: 'silver', lifetime_total: 135000000, first_gift_date: '2018-10-22', last_gift_date: '2024-10-22', is_board_member: false, affiliation: 'Alumni - Class of 2004', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd38', school_id: 'duke', first_name: 'Deborah', last_name: 'Langston', email: 'dlangston@email.com', donor_tier: 'bronze', lifetime_total: 58000000, first_gift_date: '2020-02-14', last_gift_date: '2024-08-14', is_board_member: false, affiliation: 'Community Supporter', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd39', school_id: 'duke', first_name: 'Kevin', last_name: 'Drummond', email: 'kdrummond@email.com', donor_tier: 'bronze', lifetime_total: 36000000, first_gift_date: '2021-04-20', last_gift_date: '2024-12-20', is_board_member: false, affiliation: 'Alumni - Class of 2009', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd40', school_id: 'duke', first_name: 'Stephanie', last_name: 'Cho', email: 'scho@email.com', donor_tier: 'bronze', lifetime_total: 19000000, first_gift_date: '2022-09-01', last_gift_date: '2025-02-28', is_board_member: false, affiliation: 'Alumni - Class of 2014', notes: null, is_demo: true, created_at: '2024-01-01' },
  // Kansas (10)
  { id: 'd41', school_id: 'kansas', first_name: 'Lawrence', last_name: 'Hadley', email: 'lhadley@hadleygroup.com', donor_tier: 'platinum', lifetime_total: 1950000000, first_gift_date: '2003-11-20', last_gift_date: '2025-03-05', is_board_member: true, affiliation: 'Alumni - Class of 1976', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd42', school_id: 'kansas', first_name: 'Marilyn', last_name: 'Pendleton', email: 'mpendleton@email.com', donor_tier: 'platinum', lifetime_total: 1400000000, first_gift_date: '2007-04-01', last_gift_date: '2024-10-25', is_board_member: true, affiliation: 'Alumni - Class of 1984', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd43', school_id: 'kansas', first_name: 'Douglas', last_name: 'Ashford', email: 'dashford@email.com', donor_tier: 'gold', lifetime_total: 590000000, first_gift_date: '2010-07-15', last_gift_date: '2025-01-15', is_board_member: false, affiliation: 'Alumni - Class of 1989', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd44', school_id: 'kansas', first_name: 'Sharon', last_name: 'Mc Allister', email: 'smcallister@email.com', donor_tier: 'gold', lifetime_total: 420000000, first_gift_date: '2013-01-28', last_gift_date: '2024-07-30', is_board_member: false, affiliation: 'Corporate - McAllister Farms', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd45', school_id: 'kansas', first_name: 'Jerry', last_name: 'Newcomb', email: 'jnewcomb@email.com', donor_tier: 'silver', lifetime_total: 260000000, first_gift_date: '2015-06-10', last_gift_date: '2024-12-15', is_board_member: false, affiliation: 'Alumni - Class of 1999', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd46', school_id: 'kansas', first_name: 'Brenda', last_name: 'Ostrowski', email: 'bostrowski@email.com', donor_tier: 'silver', lifetime_total: 175000000, first_gift_date: '2017-03-05', last_gift_date: '2025-02-05', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd47', school_id: 'kansas', first_name: 'Alan', last_name: 'Chambers', email: 'achambers@email.com', donor_tier: 'silver', lifetime_total: 105000000, first_gift_date: '2019-08-18', last_gift_date: '2024-08-18', is_board_member: false, affiliation: 'Alumni - Class of 2007', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd48', school_id: 'kansas', first_name: 'Pamela', last_name: 'Whitfield', email: 'pwhitfield@email.com', donor_tier: 'bronze', lifetime_total: 42000000, first_gift_date: '2020-12-25', last_gift_date: '2024-12-25', is_board_member: false, affiliation: 'Community Supporter', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd49', school_id: 'kansas', first_name: 'Carl', last_name: 'Benton', email: 'cbenton@email.com', donor_tier: 'bronze', lifetime_total: 22000000, first_gift_date: '2021-10-10', last_gift_date: '2024-10-10', is_board_member: false, affiliation: 'Alumni - Class of 2011', notes: null, is_demo: true, created_at: '2024-01-01' },
  { id: 'd50', school_id: 'kansas', first_name: 'Valerie', last_name: 'Stokes', email: 'vstokes@email.com', donor_tier: 'bronze', lifetime_total: 14000000, first_gift_date: '2023-05-20', last_gift_date: '2025-02-20', is_board_member: false, affiliation: 'Parent', notes: null, is_demo: true, created_at: '2024-01-01' },
]

type SortField = 'lifetime_total' | 'last_gift_date'
type SortDir = 'asc' | 'desc'

export function DonorTable() {
  const { role } = useRole()
  const { selectedSchool } = useSchoolFilter()
  const [tierFilter, setTierFilter] = useState<DonorTier | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('lifetime_total')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const donors = useMemo(() => {
    let list = SEED_DONORS.map((d) => anonymizeDonor(d, role))

    if (selectedSchool !== 'all') {
      list = list.filter((d) => d.school_id === selectedSchool)
    }
    if (tierFilter !== 'all') {
      list = list.filter((d) => d.donor_tier === tierFilter)
    }

    list.sort((a, b) => {
      let cmp: number
      if (sortField === 'lifetime_total') {
        cmp = a.lifetime_total - b.lifetime_total
      } else {
        cmp = new Date(a.last_gift_date ?? '').getTime() - new Date(b.last_gift_date ?? '').getTime()
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [role, selectedSchool, tierFilter, sortField, sortDir])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          value={tierFilter}
          onValueChange={(val) => setTierFilter(val as DonorTier | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8"
                onClick={() => toggleSort('lifetime_total')}
              >
                Lifetime Total
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8"
                onClick={() => toggleSort('last_gift_date')}
              >
                Last Gift
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Affiliation</TableHead>
            <TableHead className="text-center">Board</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => {
            const school = SCHOOLS.find((s) => s.slug === donor.school_id)
            const canClick = role === 'admin' || role === 'donor'

            return (
              <TableRow
                key={donor.id}
                className={canClick ? 'cursor-pointer' : ''}
                onClick={() => {
                  if (canClick) setSelectedDonor(donor)
                }}
              >
                <TableCell className="font-medium">
                  {donor.first_name} {donor.last_name}
                </TableCell>
                <TableCell>
                  {school && (
                    <div className="flex items-center gap-2">
                      <SchoolLogo name={school.name} primaryColor={school.primaryColor} size="sm" />
                      <span className="text-xs">{school.shortName}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={TIER_STYLES[donor.donor_tier]}>
                    {donor.donor_tier.charAt(0).toUpperCase() + donor.donor_tier.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(donor.lifetime_total)}</TableCell>
                <TableCell>
                  {donor.last_gift_date ? formatDate(donor.last_gift_date) : '-'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {donor.affiliation}
                </TableCell>
                <TableCell className="text-center">
                  {donor.is_board_member && (
                    <CheckCircle className="mx-auto h-4 w-4 text-green-600" />
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {selectedDonor && role !== 'researcher' && (
        <DonorDetailDialog
          donor={selectedDonor}
          open={!!selectedDonor}
          onOpenChange={(open) => {
            if (!open) setSelectedDonor(null)
          }}
        />
      )}
    </div>
  )
}

export { SEED_DONORS }

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SchoolLogo } from '@/components/shared/school-logo'
import { ComplianceIndicator } from '@/components/title-ix/compliance-indicator'
import { formatPercent, formatNumber } from '@/lib/utils/format'
import { SCHOOLS } from '@/lib/constants/schools'
import { TitleIXData } from '@/types/database'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'

const SEED_TITLE_IX: TitleIXData[] = [
  // Michigan
  { id: 't1', school_id: 'michigan', reporting_year: 2024, male_athletes: 456, female_athletes: 398, male_participation_pct: 53.4, female_participation_pct: 46.6, male_undergrad_pct: 50.8, female_undergrad_pct: 49.2, compliance_status: 'compliant', proportionality_gap: 2.6, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2024-10-01' },
  { id: 't2', school_id: 'michigan', reporting_year: 2023, male_athletes: 462, female_athletes: 385, male_participation_pct: 54.5, female_participation_pct: 45.5, male_undergrad_pct: 50.9, female_undergrad_pct: 49.1, compliance_status: 'compliant', proportionality_gap: 3.6, sports_added: ["Women's Lacrosse"], sports_cut: [], notes: null, is_demo: true, created_at: '2023-10-01' },
  { id: 't3', school_id: 'michigan', reporting_year: 2022, male_athletes: 470, female_athletes: 372, male_participation_pct: 55.8, female_participation_pct: 44.2, male_undergrad_pct: 51.0, female_undergrad_pct: 49.0, compliance_status: 'under-review', proportionality_gap: 4.8, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2022-10-01' },
  // Alabama
  { id: 't4', school_id: 'alabama', reporting_year: 2024, male_athletes: 382, female_athletes: 310, male_participation_pct: 55.2, female_participation_pct: 44.8, male_undergrad_pct: 44.5, female_undergrad_pct: 55.5, compliance_status: 'under-review', proportionality_gap: 10.7, sports_added: [], sports_cut: [], notes: 'Proportionality gap exceeds safe harbor threshold', is_demo: true, created_at: '2024-10-01' },
  { id: 't5', school_id: 'alabama', reporting_year: 2023, male_athletes: 390, female_athletes: 298, male_participation_pct: 56.7, female_participation_pct: 43.3, male_undergrad_pct: 44.3, female_undergrad_pct: 55.7, compliance_status: 'non-compliant', proportionality_gap: 12.4, sports_added: [], sports_cut: ["Men's Tennis"], notes: null, is_demo: true, created_at: '2023-10-01' },
  { id: 't6', school_id: 'alabama', reporting_year: 2022, male_athletes: 398, female_athletes: 290, male_participation_pct: 57.8, female_participation_pct: 42.2, male_undergrad_pct: 44.1, female_undergrad_pct: 55.9, compliance_status: 'non-compliant', proportionality_gap: 13.7, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2022-10-01' },
  // Oregon
  { id: 't7', school_id: 'oregon', reporting_year: 2024, male_athletes: 298, female_athletes: 276, male_participation_pct: 51.9, female_participation_pct: 48.1, male_undergrad_pct: 48.2, female_undergrad_pct: 51.8, compliance_status: 'compliant', proportionality_gap: 3.7, sports_added: ["Women's Triathlon"], sports_cut: [], notes: null, is_demo: true, created_at: '2024-10-01' },
  { id: 't8', school_id: 'oregon', reporting_year: 2023, male_athletes: 302, female_athletes: 268, male_participation_pct: 53.0, female_participation_pct: 47.0, male_undergrad_pct: 48.0, female_undergrad_pct: 52.0, compliance_status: 'compliant', proportionality_gap: 5.0, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2023-10-01' },
  { id: 't9', school_id: 'oregon', reporting_year: 2022, male_athletes: 310, female_athletes: 260, male_participation_pct: 54.4, female_participation_pct: 45.6, male_undergrad_pct: 47.8, female_undergrad_pct: 52.2, compliance_status: 'under-review', proportionality_gap: 6.6, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2022-10-01' },
  // Duke
  { id: 't10', school_id: 'duke', reporting_year: 2024, male_athletes: 340, female_athletes: 328, male_participation_pct: 50.9, female_participation_pct: 49.1, male_undergrad_pct: 49.5, female_undergrad_pct: 50.5, compliance_status: 'compliant', proportionality_gap: 1.4, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2024-10-01' },
  { id: 't11', school_id: 'duke', reporting_year: 2023, male_athletes: 344, female_athletes: 322, male_participation_pct: 51.7, female_participation_pct: 48.3, male_undergrad_pct: 49.6, female_undergrad_pct: 50.4, compliance_status: 'compliant', proportionality_gap: 2.1, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2023-10-01' },
  { id: 't12', school_id: 'duke', reporting_year: 2022, male_athletes: 350, female_athletes: 315, male_participation_pct: 52.6, female_participation_pct: 47.4, male_undergrad_pct: 49.7, female_undergrad_pct: 50.3, compliance_status: 'compliant', proportionality_gap: 2.9, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2022-10-01' },
  // Kansas
  { id: 't13', school_id: 'kansas', reporting_year: 2024, male_athletes: 310, female_athletes: 265, male_participation_pct: 53.9, female_participation_pct: 46.1, male_undergrad_pct: 49.0, female_undergrad_pct: 51.0, compliance_status: 'under-review', proportionality_gap: 4.9, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2024-10-01' },
  { id: 't14', school_id: 'kansas', reporting_year: 2023, male_athletes: 315, female_athletes: 258, male_participation_pct: 55.0, female_participation_pct: 45.0, male_undergrad_pct: 48.8, female_undergrad_pct: 51.2, compliance_status: 'under-review', proportionality_gap: 6.2, sports_added: [], sports_cut: ["Men's Swimming"], notes: null, is_demo: true, created_at: '2023-10-01' },
  { id: 't15', school_id: 'kansas', reporting_year: 2022, male_athletes: 328, female_athletes: 250, male_participation_pct: 56.7, female_participation_pct: 43.3, male_undergrad_pct: 48.5, female_undergrad_pct: 51.5, compliance_status: 'non-compliant', proportionality_gap: 8.2, sports_added: [], sports_cut: [], notes: null, is_demo: true, created_at: '2022-10-01' },
]

interface TitleIXSummaryProps {
  selectedYear: number
}

export function TitleIXSummary({ selectedYear }: TitleIXSummaryProps) {
  const { selectedSchool } = useSchoolFilter()

  const filteredData = useMemo(() => {
    let data = SEED_TITLE_IX.filter((d) => d.reporting_year === selectedYear)
    if (selectedSchool !== 'all') {
      data = data.filter((d) => d.school_id === selectedSchool)
    }
    return data
  }, [selectedYear, selectedSchool])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredData.map((record) => {
        const school = SCHOOLS.find((s) => s.slug === record.school_id)
        if (!school) return null
        const totalAthletes = record.male_athletes + record.female_athletes
        const maleBarWidth = (record.male_athletes / totalAthletes) * 100
        const femaleBarWidth = (record.female_athletes / totalAthletes) * 100

        return (
          <Card key={record.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SchoolLogo name={school.name} primaryColor={school.primaryColor} size="sm" />
                  <CardTitle className="text-sm font-semibold">{school.shortName}</CardTitle>
                </div>
                <ComplianceIndicator status={record.compliance_status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Athlete counts horizontal bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Male: {formatNumber(record.male_athletes)}</span>
                  <span>Female: {formatNumber(record.female_athletes)}</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-blue-500 transition-all"
                    style={{ width: `${maleBarWidth}%` }}
                  />
                  <div
                    className="bg-pink-500 transition-all"
                    style={{ width: `${femaleBarWidth}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatPercent(record.male_participation_pct)}</span>
                  <span>{formatPercent(record.female_participation_pct)}</span>
                </div>
              </div>

              {/* Participation vs Enrollment gap */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Participation vs Enrollment Gap
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Female Participation</span>
                      <span>{formatPercent(record.female_participation_pct)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Female Enrollment</span>
                      <span>{formatPercent(record.female_undergrad_pct)}</span>
                    </div>
                  </div>
                  <div
                    className={`rounded px-2 py-1 text-xs font-bold ${
                      record.proportionality_gap <= 3
                        ? 'bg-green-100 text-green-800'
                        : record.proportionality_gap <= 6
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.proportionality_gap.toFixed(1)}pp
                  </div>
                </div>
              </div>

              {/* Sports added / cut */}
              {(record.sports_added.length > 0 || record.sports_cut.length > 0) && (
                <div className="space-y-1 border-t pt-2">
                  {record.sports_added.length > 0 && (
                    <p className="text-xs text-green-700">
                      + Added: {record.sports_added.join(', ')}
                    </p>
                  )}
                  {record.sports_cut.length > 0 && (
                    <p className="text-xs text-red-700">
                      - Cut: {record.sports_cut.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { SEED_TITLE_IX }

'use client'

import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { SCHOOLS } from '@/lib/constants/schools'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SchoolSelector() {
  const { selectedSchool, setSelectedSchool } = useSchoolFilter()

  return (
    <Select value={selectedSchool} onValueChange={(v) => setSelectedSchool(v as typeof selectedSchool)}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="All Schools" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Schools</SelectItem>
        {SCHOOLS.map((s) => (
          <SelectItem key={s.slug} value={s.slug}>
            {s.shortName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

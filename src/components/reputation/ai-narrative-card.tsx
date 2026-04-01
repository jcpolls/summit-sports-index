'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSchoolFilter } from '@/lib/providers/school-filter-provider'
import { SCHOOLS } from '@/lib/constants/schools'
import { SEED_AI_NARRATIVES } from '@/lib/seed-data/reputation-events'
import { Sparkles, Loader2 } from 'lucide-react'

export function AiNarrativeCard() {
  const { selectedSchool } = useSchoolFilter()
  const [localSchool, setLocalSchool] = useState<string>(
    selectedSchool !== 'all' ? selectedSchool : SCHOOLS[0].slug
  )
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const effectiveSchool = selectedSchool !== 'all' ? selectedSchool : localSchool
  const school = SCHOOLS.find((s) => s.slug === effectiveSchool)

  function handleGenerate() {
    setLoading(true)
    setNarrative(null)
    setTimeout(() => {
      setNarrative(SEED_AI_NARRATIVES[effectiveSchool] ?? 'No narrative available for this school.')
      setLoading(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI Reputation Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {selectedSchool === 'all' && (
            <Select value={localSchool} onValueChange={setLocalSchool}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHOOLS.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
                    {s.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleGenerate} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Generate Narrative
              </>
            )}
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-sm text-muted-foreground">
                Analyzing reputation data for {school?.shortName}...
              </p>
            </div>
          </div>
        )}

        {narrative && !loading && (
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: school?.primaryColor }}
              />
              <span className="text-sm font-medium">{school?.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {narrative}
            </p>
          </div>
        )}

        {!narrative && !loading && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Select a school and click &quot;Generate Narrative&quot; to see an AI-powered reputation analysis.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

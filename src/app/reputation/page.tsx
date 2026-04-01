'use client'

import { useSelectedSchool, useDemoMode } from '@/lib/contexts/app-contexts'
import { SocialPanel } from '@/components/reputation/SocialPanel'
import { AIPanel } from '@/components/reputation/AIPanel'
import { NewsPanel } from '@/components/reputation/NewsPanel'

const SCHOOL_META: Record<string, { name: string; primaryColor: string }> = {
  michigan: { name: 'Michigan', primaryColor: '#00274C' },
  alabama: { name: 'Alabama', primaryColor: '#9E1B32' },
  oregon: { name: 'Oregon', primaryColor: '#154733' },
  duke: { name: 'Duke', primaryColor: '#003087' },
  kansas: { name: 'Kansas', primaryColor: '#0051A5' },
}

export default function ReputationPage() {
  const { selectedSchool } = useSelectedSchool()
  const { demoMode } = useDemoMode()

  const slug = selectedSchool === 'all' ? 'michigan' : selectedSchool
  const meta = SCHOOL_META[slug] ?? SCHOOL_META.michigan

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reputation Watch</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Social sentiment, AI analysis, and campus press coverage for{' '}
          <span className="font-medium text-foreground">{meta.name}</span>.
          {selectedSchool === 'all' && (
            <span className="ml-1 text-yellow-600">Select a school above to filter.</span>
          )}
        </p>
      </div>

      {/* Three-panel layout: equal-width on desktop, stacked on tablet/mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <SocialPanel
          institutionSlug={slug}
          institutionName={meta.name}
          primaryColor={meta.primaryColor}
          demo={demoMode}
        />
        <AIPanel
          institutionSlug={slug}
          institutionName={meta.name}
          demo={demoMode}
        />
        <NewsPanel
          institutionSlug={slug}
          demo={demoMode}
        />
      </div>
    </div>
  )
}

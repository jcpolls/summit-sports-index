import { TableSkeleton } from '@/components/shared/loading-skeleton'

export default function RankingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
      </div>
      <TableSkeleton rows={10} />
    </div>
  )
}

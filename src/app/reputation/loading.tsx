import { ChartSkeleton, FeedSkeleton } from '@/components/shared/loading-skeleton'

export default function ReputationLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-80 bg-muted animate-pulse rounded mt-2" />
      </div>
      <ChartSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <FeedSkeleton items={3} />
      </div>
      <FeedSkeleton items={6} />
    </div>
  )
}

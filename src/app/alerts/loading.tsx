import { FeedSkeleton } from '@/components/shared/loading-skeleton'

export default function AlertsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-24 bg-muted animate-pulse rounded" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded mt-2" />
      </div>
      <FeedSkeleton items={8} />
    </div>
  )
}

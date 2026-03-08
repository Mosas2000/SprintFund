import { Skeleton } from './Skeleton';

/**
 * Skeleton placeholder for a single proposal card.
 * Mirrors the layout of the ProposalCard component.
 */
export function ProposalCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Header row: title + status badge */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Description lines */}
      <div className="mb-4 space-y-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>

      {/* Vote bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>

      {/* Footer: address + amount */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

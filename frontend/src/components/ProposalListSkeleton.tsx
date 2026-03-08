import { Skeleton } from './Skeleton';
import { ProposalCardSkeleton } from './ProposalCardSkeleton';

/**
 * Full-page skeleton for the Proposals list loading state.
 * Mirrors the ProposalsPage layout: header, filters, and card grid.
 */
export function ProposalListSkeleton() {
  return (
    <div
      className="mx-auto max-w-5xl px-4 sm:px-6 py-8"
      role="status"
      aria-label="Loading proposals"
    >
      <span className="sr-only">Loading proposals…</span>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-28 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-8 w-14 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      {/* Proposal cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
      </div>
    </div>
  );
}

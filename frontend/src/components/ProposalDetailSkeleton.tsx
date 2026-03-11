import { memo } from 'react';
import { Skeleton } from './Skeleton';

/**
 * Skeleton placeholder for the full proposal detail page.
 * Mirrors the three-column layout of ProposalDetailPage.
 */
export const ProposalDetailSkeleton = memo(function ProposalDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-5xl px-4 sm:px-6 py-8"
      role="status"
      aria-label="Loading proposal details"
    >
      <span className="sr-only">Loading proposal details…</span>
      {/* Breadcrumb */}
      <Skeleton className="mb-6 h-4 w-28" />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Title card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Vote bar card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <Skeleton className="mb-4 h-4 w-12" />
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="mt-2 h-3 w-36" />
          </div>

          {/* Vote actions card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <Skeleton className="mb-4 h-4 w-28" />
            <Skeleton className="mb-4 h-10 w-full rounded-lg" />
            <Skeleton className="mb-1 h-3 w-40" />
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div>
              <Skeleton className="h-3 w-28 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div>
              <Skeleton className="h-3 w-28 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
});
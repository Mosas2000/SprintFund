import { Skeleton } from './Skeleton';

/**
 * Skeleton placeholder for the CreateProposal form loading state.
 * Mirrors the form layout: title input, description textarea,
 * amount input, and submit button.
 */
export function CreateProposalSkeleton() {
  return (
    <div
      className="mx-auto max-w-lg px-4 sm:px-6 py-8"
      role="status"
      aria-label="Loading proposal form"
    >
      <span className="sr-only">Loading proposal form…</span>

      <Skeleton className="mb-6 h-7 w-40" />

      <div className="space-y-5 rounded-xl border border-border bg-card p-6">
        {/* Title field */}
        <div>
          <Skeleton className="mb-1 h-3 w-10" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="mt-1 h-2.5 w-14" />
        </div>

        {/* Description field */}
        <div>
          <Skeleton className="mb-1 h-3 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="mt-1 h-2.5 w-14" />
        </div>

        {/* Amount field */}
        <div>
          <Skeleton className="mb-1 h-3 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

import { Skeleton } from './Skeleton';

/**
 * Skeleton placeholder for a single stat card on the Dashboard.
 * Mirrors the layout of the StatCard component.
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-6 w-28" />
    </div>
  );
}

import { memo } from 'react';

/**
 * Skeleton placeholder displayed while comments are loading from storage.
 */
export const CommentSkeleton = memo(function CommentSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse" aria-hidden="true">
      {/* Author row skeleton */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-surface" />
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-24 rounded bg-surface" />
          <div className="h-3 w-12 rounded bg-surface" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-3 w-full rounded bg-surface" />
        <div className="h-3 w-4/5 rounded bg-surface" />
        <div className="h-3 w-3/5 rounded bg-surface" />
      </div>
      {/* Actions skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-3 w-8 rounded bg-surface" />
        <div className="h-3 w-8 rounded bg-surface" />
        <div className="h-3 w-12 rounded bg-surface" />
      </div>
    </div>
  );
});

/**
 * Multiple comment skeletons for a loading comment section.
 */
export const CommentListSkeleton = memo(function CommentListSkeleton({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading comments">
      {Array.from({ length: count }, (_, i) => (
        <CommentSkeleton key={i} />
      ))}
      <span className="sr-only">Loading comments</span>
    </div>
  );
});

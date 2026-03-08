interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

/**
 * Base skeleton primitive with a shimmer animation.
 * Used as a building block for page-specific skeleton layouts.
 *
 * Usage:
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton width="100%" height="1.5rem" />
 */
export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

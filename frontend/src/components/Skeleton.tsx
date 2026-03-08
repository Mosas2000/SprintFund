interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

/**
 * Base skeleton primitive with a pulsing animation.
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
      className={`animate-pulse rounded-md bg-border ${className}`}
      style={{ width, height }}
    />
  );
}

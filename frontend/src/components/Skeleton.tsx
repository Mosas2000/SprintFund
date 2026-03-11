import { memo, useMemo } from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

/**
 * Base skeleton primitive with a shimmer animation.
 * Used as a building block for page-specific skeleton layouts.
 *
 * Wrapped in React.memo because it is used dozens of times across
 * skeleton pages, preventing cascading re-renders when parent state changes.
 *
 * Usage:
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton width="100%" height="1.5rem" />
 */
export const Skeleton = memo(function Skeleton({ className = '', width, height }: SkeletonProps) {
  // Only allocate a style object when width or height is provided.
  // When both are undefined (className-only usage) we skip the allocation entirely.
  const style = useMemo(
    () => (width || height ? { width, height } : undefined),
    [width, height],
  );

  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-md ${className}`}
      style={style}
    />
  );
});

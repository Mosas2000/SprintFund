import { memo, useMemo } from 'react';

interface VoteProgressBarProps {
  /** Percentage of votes in favor (0-100) */
  forPct: number;
  /** Height class for the progress bar track, e.g. "h-1.5" or "h-2" */
  heightClass?: string;
}

/**
 * Memoized vote progress bar that avoids creating a new inline style
 * object on every render unless the percentage actually changes.
 */
export const VoteProgressBar = memo(function VoteProgressBar({
  forPct,
  heightClass = 'h-1.5',
}: VoteProgressBarProps) {
  const barStyle = useMemo(() => ({ width: `${forPct}%` }), [forPct]);

  return (
    <div
      className={`${heightClass} w-full rounded-full bg-border overflow-hidden`}
      role="progressbar"
      aria-valuenow={forPct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${forPct}% of votes in favor`}
    >
      <div
        className="h-full rounded-full bg-green transition-all"
        style={barStyle}
      />
    </div>
  );
});

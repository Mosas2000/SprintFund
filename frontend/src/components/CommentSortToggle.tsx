import { memo, useCallback } from 'react';
import type { CommentSortToggleProps } from '../types/comment';

/**
 * Toggle button to switch between newest-first and oldest-first comment sorting.
 */
export const CommentSortToggle = memo(function CommentSortToggle({
  value,
  onChange,
}: CommentSortToggleProps) {
  const handleToggle = useCallback(() => {
    onChange(value === 'newest' ? 'oldest' : 'newest');
  }, [value, onChange]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Sort comments: currently ${value} first. Click to switch.`}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors rounded-md px-2 py-1 min-h-[28px]"
    >
      <svg
        className={`w-3.5 h-3.5 transition-transform ${value === 'oldest' ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      <span>{value === 'newest' ? 'Newest first' : 'Oldest first'}</span>
    </button>
  );
});

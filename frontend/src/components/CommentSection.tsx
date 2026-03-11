import { useEffect, memo } from 'react';
import { useLoadComments, useCommentSortOrder, useSetCommentSortOrder, useCommentCount } from '../store/comment-selectors';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { CommentSortToggle } from './CommentSortToggle';
import type { CommentSectionProps } from '../types/comment';

/**
 * Top-level comment section that composes form, list, and sort toggle.
 * Designed to be dropped into ProposalDetail as a self-contained region.
 */
export const CommentSection = memo(function CommentSection({
  proposalId,
}: CommentSectionProps) {
  const loadComments = useLoadComments();
  const sortOrder = useCommentSortOrder();
  const setSortOrder = useSetCommentSortOrder();
  const commentCount = useCommentCount(proposalId);

  // Hydrate comments from localStorage on mount
  useEffect(() => {
    loadComments(proposalId);
  }, [proposalId, loadComments]);

  return (
    <section
      className="rounded-xl border border-border bg-card p-4 sm:p-6"
      aria-label="Discussion"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <h2 className="text-sm font-semibold text-text">
            Discussion
            {commentCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-green/10 px-2 py-0.5 text-xs font-medium text-green tabular-nums">
                {commentCount}
              </span>
            )}
          </h2>
        </div>

        {commentCount > 1 && (
          <CommentSortToggle value={sortOrder} onChange={setSortOrder} />
        )}
      </div>

      {/* Comment form */}
      <div className="mb-6">
        <CommentForm proposalId={proposalId} />
      </div>

      {/* Comment list */}
      <CommentList proposalId={proposalId} />
    </section>
  );
});

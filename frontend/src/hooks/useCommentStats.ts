import { useMemo } from 'react';
import { useProposalComments } from '../store/comment-selectors';

/**
 * Computed statistics about comments on a specific proposal.
 * Values are memoized to prevent unnecessary downstream re-renders.
 */
export interface CommentStats {
  /** Total number of non-deleted comments */
  total: number;
  /** Number of top-level comments (no parent) */
  topLevel: number;
  /** Number of replies (has a parent) */
  replies: number;
  /** Number of unique participants (by address) */
  uniqueAuthors: number;
  /** Total upvotes across all comments */
  totalUpvotes: number;
  /** Total downvotes across all comments */
  totalDownvotes: number;
  /** Average content length of non-deleted comments */
  avgContentLength: number;
  /** Whether there are any comments at all */
  hasComments: boolean;
}

/**
 * Hook that computes memoized statistics about comments on a proposal.
 * Useful for analytics displays, badges, and dashboard summaries.
 */
export function useCommentStats(proposalId: number): CommentStats {
  const comments = useProposalComments(proposalId);

  return useMemo(() => {
    const active = comments.filter((c) => !c.deleted);
    const topLevel = active.filter((c) => c.parentId === null);
    const repliesArr = active.filter((c) => c.parentId !== null);

    const uniqueAuthors = new Set(active.map((c) => c.author)).size;

    let totalUpvotes = 0;
    let totalDownvotes = 0;
    let totalContentLength = 0;

    for (const c of active) {
      totalUpvotes += c.reactions.filter((r) => r.type === 'upvote').length;
      totalDownvotes += c.reactions.filter((r) => r.type === 'downvote').length;
      totalContentLength += c.content.length;
    }

    const avgContentLength = active.length > 0
      ? Math.round(totalContentLength / active.length)
      : 0;

    return {
      total: active.length,
      topLevel: topLevel.length,
      replies: repliesArr.length,
      uniqueAuthors,
      totalUpvotes,
      totalDownvotes,
      avgContentLength,
      hasComments: active.length > 0,
    };
  }, [comments]);
}

import { useCommentsStore } from './comments';
import type { CommentSortOrder } from '../types/comment';

/* ── Granular selectors ───────────────────────── */

/**
 * Select comments for a specific proposal.
 * Returns the raw comment array (unsorted).
 */
export function useProposalComments(proposalId: number) {
  return useCommentsStore((s) => s.commentsByProposal[proposalId] ?? []);
}

/**
 * Select the current sort order.
 */
export function useCommentSortOrder(): CommentSortOrder {
  return useCommentsStore((s) => s.sortOrder);
}

/**
 * Select the setSortOrder action.
 */
export function useSetCommentSortOrder() {
  return useCommentsStore((s) => s.setSortOrder);
}

/**
 * Select the loadComments action.
 */
export function useLoadComments() {
  return useCommentsStore((s) => s.loadComments);
}

/**
 * Select the addComment action.
 */
export function useAddComment() {
  return useCommentsStore((s) => s.addComment);
}

/**
 * Select the editComment action.
 */
export function useEditComment() {
  return useCommentsStore((s) => s.editComment);
}

/**
 * Select the deleteComment action.
 */
export function useDeleteComment() {
  return useCommentsStore((s) => s.deleteComment);
}

/**
 * Select the toggleReaction action.
 */
export function useToggleReaction() {
  return useCommentsStore((s) => s.toggleReaction);
}

/**
 * Get the total non-deleted comment count for a proposal.
 */
export function useCommentCount(proposalId: number): number {
  return useCommentsStore((s) => {
    const comments = s.commentsByProposal[proposalId] ?? [];
    return comments.filter((c) => !c.deleted).length;
  });
}

/**
 * Get the count of comments by a specific user on a proposal.
 */
export function useUserCommentCount(proposalId: number, author: string): number {
  return useCommentsStore((s) => {
    const comments = s.commentsByProposal[proposalId] ?? [];
    return comments.filter((c) => c.author === author && !c.deleted).length;
  });
}

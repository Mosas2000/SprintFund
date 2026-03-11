import { useCallback, useMemo } from 'react';
import { useCommentsStore } from '../store/comments';
import { useWalletAddress, useWalletConnected } from '../store/wallet-selectors';
import { sanitizeText } from '../lib/sanitize';
import { validateCommentContent, validateUserCommentLimit, validateReplyDepth } from '../lib/comment-validation';
import type { Comment, CommentSortOrder } from '../types/comment';

/**
 * Convenience hook for managing comments on a specific proposal.
 * Composes store selectors and validation into a simple interface.
 */
export function useComments(proposalId: number) {
  const store = useCommentsStore();
  const connected = useWalletConnected();
  const address = useWalletAddress();

  const comments = store.commentsByProposal[proposalId] ?? [];
  const sortOrder = store.sortOrder;

  const commentCount = useMemo(
    () => comments.filter((c) => !c.deleted).length,
    [comments],
  );

  const userCommentCount = useMemo(
    () => (address ? comments.filter((c) => c.author === address && !c.deleted).length : 0),
    [comments, address],
  );

  const load = useCallback(() => {
    store.loadComments(proposalId);
  }, [proposalId, store]);

  const post = useCallback((content: string, parentId?: string | null): Comment | null => {
    if (!address) return null;

    const contentErrors = validateCommentContent(content);
    if (contentErrors.length > 0) return null;

    const limitErrors = validateUserCommentLimit(userCommentCount);
    if (limitErrors.length > 0) return null;

    if (parentId) {
      const depth = store.getReplyDepth(parentId, proposalId);
      const depthErrors = validateReplyDepth(depth);
      if (depthErrors.length > 0) return null;
    }

    const sanitized = sanitizeText(content.trim());
    return store.addComment({ proposalId, author: address, content: sanitized, parentId });
  }, [address, proposalId, userCommentCount, store]);

  const edit = useCallback((commentId: string, content: string): boolean => {
    if (!address) return false;
    const sanitized = sanitizeText(content.trim());
    return store.editComment({ commentId, content: sanitized, author: address });
  }, [address, store]);

  const remove = useCallback((commentId: string): boolean => {
    if (!address) return false;
    return store.deleteComment(commentId, proposalId, address);
  }, [address, proposalId, store]);

  const upvote = useCallback((commentId: string) => {
    if (!address) return;
    store.toggleReaction(commentId, proposalId, address, 'upvote');
  }, [address, proposalId, store]);

  const downvote = useCallback((commentId: string) => {
    if (!address) return;
    store.toggleReaction(commentId, proposalId, address, 'downvote');
  }, [address, proposalId, store]);

  const setSortOrder = useCallback((order: CommentSortOrder) => {
    store.setSortOrder(order);
  }, [store]);

  return useMemo(() => ({
    comments,
    commentCount,
    userCommentCount,
    sortOrder,
    connected,
    address,
    load,
    post,
    edit,
    remove,
    upvote,
    downvote,
    setSortOrder,
  }), [
    comments,
    commentCount,
    userCommentCount,
    sortOrder,
    connected,
    address,
    load,
    post,
    edit,
    remove,
    upvote,
    downvote,
    setSortOrder,
  ]);
}

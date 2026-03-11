import { useState, useCallback, memo } from 'react';
import { useWalletAddress, useWalletConnected } from '../store/wallet-selectors';
import { useToggleReaction, useDeleteComment, useEditComment } from '../store/comment-selectors';
import { formatRelativeTime, formatFullDateTime, shortenAddress, getAddressInitials } from '../lib/comment-formatting';
import { sanitizeText } from '../lib/sanitize';
import { COMMENT_RULES } from '../types/comment';
import type { CommentItemProps } from '../types/comment';

export const CommentItem = memo(function CommentItem({
  comment,
  proposalId,
  depth = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const connected = useWalletConnected();
  const address = useWalletAddress();
  const toggleReaction = useToggleReaction();
  const deleteComment = useDeleteComment();
  const editComment = useEditComment();

  const isAuthor = connected && address === comment.author;

  const upvotes = comment.reactions.filter((r) => r.type === 'upvote').length;
  const downvotes = comment.reactions.filter((r) => r.type === 'downvote').length;
  const userReaction = address
    ? comment.reactions.find((r) => r.address === address)?.type ?? null
    : null;

  const handleUpvote = useCallback(() => {
    if (!address) return;
    toggleReaction(comment.id, proposalId, address, 'upvote');
  }, [address, comment.id, proposalId, toggleReaction]);

  const handleDownvote = useCallback(() => {
    if (!address) return;
    toggleReaction(comment.id, proposalId, address, 'downvote');
  }, [address, comment.id, proposalId, toggleReaction]);

  const handleEditSubmit = useCallback(() => {
    if (!address) return;
    const sanitized = sanitizeText(editContent.trim());
    if (sanitized.length < COMMENT_RULES.minLength) return;

    const success = editComment({
      commentId: comment.id,
      content: sanitized,
      author: address,
    });

    if (success) {
      setIsEditing(false);
    }
  }, [address, editContent, comment.id, editComment]);

  const handleEditCancel = useCallback(() => {
    setEditContent(comment.content);
    setIsEditing(false);
  }, [comment.content]);

  const handleDelete = useCallback(() => {
    if (!address) return;
    deleteComment(comment.id, proposalId, address);
    setShowDeleteConfirm(false);
  }, [address, comment.id, proposalId, deleteComment]);

  // Deleted comment placeholder
  if (comment.deleted) {
    return (
      <div
        className="rounded-lg border border-border/50 bg-surface/30 px-4 py-3"
        role="article"
        aria-label="Deleted comment"
      >
        <p className="text-xs text-muted italic">This comment has been removed by the author.</p>
      </div>
    );
  }

  const maxDepthReached = depth >= COMMENT_RULES.maxReplyDepth;

  return (
    <div
      className="group"
      role="article"
      aria-label={`Comment by ${shortenAddress(comment.author)}`}
    >
      <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-xs font-bold text-green shrink-0"
            aria-hidden="true"
          >
            {getAddressInitials(comment.author)}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-text truncate">
              {shortenAddress(comment.author)}
            </span>
            {isAuthor && (
              <span className="shrink-0 rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-medium text-green">
                You
              </span>
            )}
            <span className="text-xs text-muted shrink-0" title={formatFullDateTime(comment.createdAt)}>
              {formatRelativeTime(comment.createdAt)}
            </span>
            {comment.editedAt && (
              <span className="text-xs text-muted italic shrink-0" title={formatFullDateTime(comment.editedAt)}>
                (edited)
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-2 mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={COMMENT_RULES.maxLength + 50}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none resize-none focus:border-green/40 min-h-[44px]"
              aria-label="Edit comment"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted tabular-nums">
                {editContent.trim().length}/{COMMENT_RULES.maxLength}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-3 py-1.5 text-xs text-muted hover:text-text transition-colors rounded-md min-h-[32px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={editContent.trim().length < COMMENT_RULES.minLength}
                  className="px-3 py-1.5 rounded-md bg-green text-dark text-xs font-medium transition-all hover:bg-green-dim disabled:opacity-40 min-h-[32px]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text/90 leading-relaxed whitespace-pre-wrap mb-3">
            {comment.content}
          </p>
        )}

        {/* Actions row */}
        <div className="flex items-center gap-4 text-xs">
          {/* Reactions */}
          {connected && (
            <>
              <button
                type="button"
                onClick={handleUpvote}
                aria-label={`Upvote (${upvotes})`}
                aria-pressed={userReaction === 'upvote'}
                className={`flex items-center gap-1 transition-colors min-h-[28px] px-1 rounded ${
                  userReaction === 'upvote' ? 'text-green font-semibold' : 'text-muted hover:text-green'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                {upvotes > 0 && <span className="tabular-nums">{upvotes}</span>}
              </button>
              <button
                type="button"
                onClick={handleDownvote}
                aria-label={`Downvote (${downvotes})`}
                aria-pressed={userReaction === 'downvote'}
                className={`flex items-center gap-1 transition-colors min-h-[28px] px-1 rounded ${
                  userReaction === 'downvote' ? 'text-red font-semibold' : 'text-muted hover:text-red'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {downvotes > 0 && <span className="tabular-nums">{downvotes}</span>}
              </button>
            </>
          )}

          {/* Reply button */}
          {connected && !maxDepthReached && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-muted hover:text-text transition-colors min-h-[28px] px-1"
              aria-expanded={showReplyForm}
            >
              Reply
            </button>
          )}

          {/* Author actions */}
          {isAuthor && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(true);
                }}
                className="text-muted hover:text-text transition-colors min-h-[28px] px-1 opacity-0 group-hover:opacity-100"
              >
                Edit
              </button>
              {showDeleteConfirm ? (
                <span className="flex items-center gap-2">
                  <span className="text-muted">Delete?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-red font-medium hover:text-red/80 transition-colors min-h-[28px] px-1"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-muted hover:text-text transition-colors min-h-[28px] px-1"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-muted hover:text-red transition-colors min-h-[28px] px-1 opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reply form slot (rendered by CommentList) */}
      {showReplyForm && (
        <div className="mt-2 ml-4" data-reply-slot={comment.id} />
      )}
    </div>
  );
});

export { CommentItem as default };

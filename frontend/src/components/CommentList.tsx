import { useMemo, memo } from 'react';
import { useProposalComments, useCommentSortOrder } from '../store/comment-selectors';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import type { CommentListProps, Comment } from '../types/comment';
import { COMMENT_RULES } from '../types/comment';

/**
 * Build a tree of comments from a flat array.
 * Returns top-level comments with nested replies accessible via a lookup map.
 */
function buildCommentTree(
  comments: Comment[],
  sortOrder: 'newest' | 'oldest',
): { topLevel: Comment[]; repliesByParent: Record<string, Comment[]> } {
  const repliesByParent: Record<string, Comment[]> = {};
  const topLevel: Comment[] = [];

  for (const comment of comments) {
    if (comment.parentId) {
      if (!repliesByParent[comment.parentId]) {
        repliesByParent[comment.parentId] = [];
      }
      repliesByParent[comment.parentId].push(comment);
    } else {
      topLevel.push(comment);
    }
  }

  // Sort top-level comments
  const sortFn = sortOrder === 'newest'
    ? (a: Comment, b: Comment) => b.createdAt - a.createdAt
    : (a: Comment, b: Comment) => a.createdAt - b.createdAt;

  topLevel.sort(sortFn);

  // Sort replies always chronologically (oldest first for natural reading order)
  for (const parentId of Object.keys(repliesByParent)) {
    repliesByParent[parentId].sort((a, b) => a.createdAt - b.createdAt);
  }

  return { topLevel, repliesByParent };
}

/**
 * Recursive comment thread renderer.
 */
function CommentThread({
  comment,
  proposalId,
  repliesByParent,
  depth,
}: {
  comment: Comment;
  proposalId: number;
  repliesByParent: Record<string, Comment[]>;
  depth: number;
}) {
  const replies = repliesByParent[comment.id] ?? [];
  const canReply = depth < COMMENT_RULES.maxReplyDepth;

  return (
    <div>
      <CommentItem
        comment={comment}
        proposalId={proposalId}
        depth={depth}
      />

      {/* Nested replies */}
      {replies.length > 0 && (
        <div
          className="ml-4 sm:ml-6 mt-2 space-y-2 border-l-2 border-border/50 pl-3 sm:pl-4"
          role="group"
          aria-label={`Replies to comment by ${comment.author.slice(0, 6)}`}
        >
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              proposalId={proposalId}
              repliesByParent={repliesByParent}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Inline reply form */}
      {canReply && (
        <div data-reply-target={comment.id} />
      )}
    </div>
  );
}

/**
 * Empty state shown when there are no comments on a proposal.
 */
function CommentEmptyState() {
  return (
    <div className="py-12 text-center" role="status">
      <svg
        className="mx-auto mb-3 h-10 w-10 text-muted/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
      <p className="text-sm text-muted">No comments yet. Be the first to share your thoughts.</p>
    </div>
  );
}

/**
 * Renders all comments for a proposal with threading support.
 */
export const CommentList = memo(function CommentList({ proposalId }: CommentListProps) {
  const comments = useProposalComments(proposalId);
  const sortOrder = useCommentSortOrder();

  const { topLevel, repliesByParent } = useMemo(
    () => buildCommentTree(comments, sortOrder),
    [comments, sortOrder],
  );

  const visibleCount = comments.filter((c) => !c.deleted).length;

  if (visibleCount === 0) {
    return <CommentEmptyState />;
  }

  return (
    <div className="space-y-3" role="feed" aria-label="Comments">
      {topLevel.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          proposalId={proposalId}
          repliesByParent={repliesByParent}
          depth={0}
        />
      ))}
    </div>
  );
});

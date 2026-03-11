import type { Comment } from '../types/comment';

/**
 * Filter criteria for searching comments.
 */
export interface CommentFilterCriteria {
  /** Search query to match against comment content */
  query?: string;
  /** Filter to only comments by a specific author */
  author?: string;
  /** Include deleted comments in results */
  includeDeleted?: boolean;
  /** Filter to only top-level comments (no replies) */
  topLevelOnly?: boolean;
  /** Filter to comments created after this timestamp */
  afterTimestamp?: number;
  /** Filter to comments created before this timestamp */
  beforeTimestamp?: number;
}

/**
 * Filter comments based on the given criteria.
 */
export function filterComments(
  comments: Comment[],
  criteria: CommentFilterCriteria,
): Comment[] {
  let filtered = [...comments];

  // Exclude deleted unless explicitly included
  if (!criteria.includeDeleted) {
    filtered = filtered.filter((c) => !c.deleted);
  }

  // Filter by author
  if (criteria.author) {
    const authorLower = criteria.author.toLowerCase();
    filtered = filtered.filter((c) => c.author.toLowerCase() === authorLower);
  }

  // Filter by search query (case-insensitive substring match)
  if (criteria.query && criteria.query.trim().length > 0) {
    const queryLower = criteria.query.toLowerCase().trim();
    filtered = filtered.filter((c) =>
      c.content.toLowerCase().includes(queryLower),
    );
  }

  // Filter to top-level only
  if (criteria.topLevelOnly) {
    filtered = filtered.filter((c) => c.parentId === null);
  }

  // Filter by timestamp range
  if (criteria.afterTimestamp !== undefined) {
    filtered = filtered.filter((c) => c.createdAt > criteria.afterTimestamp!);
  }
  if (criteria.beforeTimestamp !== undefined) {
    filtered = filtered.filter((c) => c.createdAt < criteria.beforeTimestamp!);
  }

  return filtered;
}

/**
 * Get comment statistics for a proposal.
 */
export function getCommentStats(comments: Comment[]): {
  total: number;
  active: number;
  deleted: number;
  topLevel: number;
  replies: number;
  uniqueAuthors: number;
  totalReactions: number;
} {
  const active = comments.filter((c) => !c.deleted);
  const deleted = comments.filter((c) => c.deleted);
  const topLevel = active.filter((c) => c.parentId === null);
  const replies = active.filter((c) => c.parentId !== null);
  const uniqueAuthors = new Set(active.map((c) => c.author)).size;
  const totalReactions = active.reduce((sum, c) => sum + c.reactions.length, 0);

  return {
    total: comments.length,
    active: active.length,
    deleted: deleted.length,
    topLevel: topLevel.length,
    replies: replies.length,
    uniqueAuthors,
    totalReactions,
  };
}

/**
 * Export comments as a formatted text string for copying to clipboard.
 */
export function exportCommentsAsText(
  comments: Comment[],
  proposalTitle?: string,
): string {
  const lines: string[] = [];

  if (proposalTitle) {
    lines.push(`Discussion: ${proposalTitle}`);
    lines.push('='.repeat(40));
    lines.push('');
  }

  const active = comments.filter((c) => !c.deleted);
  const sorted = [...active].sort((a, b) => a.createdAt - b.createdAt);

  for (const comment of sorted) {
    const date = new Date(comment.createdAt).toISOString();
    const prefix = comment.parentId ? '  > ' : '';
    const edited = comment.editedAt ? ' (edited)' : '';
    lines.push(`${prefix}[${date}] ${comment.author}${edited}:`);
    lines.push(`${prefix}${comment.content}`);
    lines.push('');
  }

  if (active.length === 0) {
    lines.push('No comments.');
  }

  return lines.join('\n');
}

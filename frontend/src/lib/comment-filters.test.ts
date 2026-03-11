import { describe, it, expect } from 'vitest';
import {
  filterComments,
  getCommentStats,
  exportCommentsAsText,
} from '../lib/comment-filters';
import type { Comment } from '../types/comment';

const AUTHOR_1 = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
const AUTHOR_2 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: `comment-${Date.now()}-${Math.random()}`,
    proposalId: 1,
    author: AUTHOR_1,
    content: 'Default comment content',
    createdAt: Date.now(),
    editedAt: null,
    parentId: null,
    deleted: false,
    reactions: [],
    ...overrides,
  };
}

describe('Comment filters', () => {
  describe('filterComments', () => {
    it('excludes deleted comments by default', () => {
      const comments = [
        makeComment({ content: 'Active' }),
        makeComment({ content: 'Deleted', deleted: true }),
      ];

      const result = filterComments(comments, {});
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Active');
    });

    it('includes deleted comments when requested', () => {
      const comments = [
        makeComment({ content: 'Active' }),
        makeComment({ content: 'Deleted', deleted: true }),
      ];

      const result = filterComments(comments, { includeDeleted: true });
      expect(result).toHaveLength(2);
    });

    it('filters by author', () => {
      const comments = [
        makeComment({ author: AUTHOR_1, content: 'By author 1' }),
        makeComment({ author: AUTHOR_2, content: 'By author 2' }),
      ];

      const result = filterComments(comments, { author: AUTHOR_1 });
      expect(result).toHaveLength(1);
      expect(result[0].author).toBe(AUTHOR_1);
    });

    it('filters by author case-insensitively', () => {
      const comments = [
        makeComment({ author: AUTHOR_1, content: 'Match' }),
      ];

      const result = filterComments(comments, { author: AUTHOR_1.toLowerCase() });
      expect(result).toHaveLength(1);
    });

    it('filters by search query', () => {
      const comments = [
        makeComment({ content: 'This proposal is excellent' }),
        makeComment({ content: 'I disagree with the budget' }),
        makeComment({ content: 'Excellent work on the roadmap' }),
      ];

      const result = filterComments(comments, { query: 'excellent' });
      expect(result).toHaveLength(2);
    });

    it('handles empty search query', () => {
      const comments = [makeComment(), makeComment()];
      const result = filterComments(comments, { query: '' });
      expect(result).toHaveLength(2);
    });

    it('handles whitespace-only search query', () => {
      const comments = [makeComment(), makeComment()];
      const result = filterComments(comments, { query: '   ' });
      expect(result).toHaveLength(2);
    });

    it('filters to top-level only', () => {
      const comments = [
        makeComment({ parentId: null, content: 'Top level' }),
        makeComment({ parentId: 'some-parent', content: 'Reply' }),
      ];

      const result = filterComments(comments, { topLevelOnly: true });
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Top level');
    });

    it('filters by timestamp range', () => {
      const now = Date.now();
      const comments = [
        makeComment({ createdAt: now - 5000, content: 'Old' }),
        makeComment({ createdAt: now - 1000, content: 'Recent' }),
        makeComment({ createdAt: now + 5000, content: 'Future' }),
      ];

      const result = filterComments(comments, {
        afterTimestamp: now - 2000,
        beforeTimestamp: now,
      });
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Recent');
    });

    it('combines multiple filter criteria', () => {
      const comments = [
        makeComment({ author: AUTHOR_1, content: 'Excellent proposal', parentId: null }),
        makeComment({ author: AUTHOR_2, content: 'Excellent reply', parentId: 'parent-1' }),
        makeComment({ author: AUTHOR_1, content: 'Budget concerns', parentId: null }),
      ];

      const result = filterComments(comments, {
        author: AUTHOR_1,
        query: 'excellent',
        topLevelOnly: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Excellent proposal');
    });

    it('returns empty array when no comments match', () => {
      const comments = [makeComment({ content: 'Hello' })];
      const result = filterComments(comments, { query: 'nonexistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('getCommentStats', () => {
    it('computes stats for empty array', () => {
      const stats = getCommentStats([]);
      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.deleted).toBe(0);
      expect(stats.topLevel).toBe(0);
      expect(stats.replies).toBe(0);
      expect(stats.uniqueAuthors).toBe(0);
      expect(stats.totalReactions).toBe(0);
    });

    it('counts active and deleted separately', () => {
      const comments = [
        makeComment({ deleted: false }),
        makeComment({ deleted: false }),
        makeComment({ deleted: true }),
      ];

      const stats = getCommentStats(comments);
      expect(stats.total).toBe(3);
      expect(stats.active).toBe(2);
      expect(stats.deleted).toBe(1);
    });

    it('separates top-level and replies', () => {
      const comments = [
        makeComment({ parentId: null }),
        makeComment({ parentId: null }),
        makeComment({ parentId: 'c1' }),
      ];

      const stats = getCommentStats(comments);
      expect(stats.topLevel).toBe(2);
      expect(stats.replies).toBe(1);
    });

    it('counts unique authors', () => {
      const comments = [
        makeComment({ author: AUTHOR_1 }),
        makeComment({ author: AUTHOR_1 }),
        makeComment({ author: AUTHOR_2 }),
      ];

      const stats = getCommentStats(comments);
      expect(stats.uniqueAuthors).toBe(2);
    });

    it('counts total reactions', () => {
      const comments = [
        makeComment({
          reactions: [
            { address: AUTHOR_1, type: 'upvote', createdAt: Date.now() },
            { address: AUTHOR_2, type: 'downvote', createdAt: Date.now() },
          ],
        }),
        makeComment({
          reactions: [
            { address: AUTHOR_1, type: 'upvote', createdAt: Date.now() },
          ],
        }),
      ];

      const stats = getCommentStats(comments);
      expect(stats.totalReactions).toBe(3);
    });
  });

  describe('exportCommentsAsText', () => {
    it('exports empty comment list', () => {
      const result = exportCommentsAsText([]);
      expect(result).toContain('No comments.');
    });

    it('includes proposal title when provided', () => {
      const result = exportCommentsAsText([], 'Test Proposal');
      expect(result).toContain('Discussion: Test Proposal');
      expect(result).toContain('='.repeat(40));
    });

    it('formats comments with timestamps and authors', () => {
      const comments = [
        makeComment({
          author: AUTHOR_1,
          content: 'Great proposal',
          createdAt: new Date('2025-06-15T12:00:00Z').getTime(),
        }),
      ];

      const result = exportCommentsAsText(comments);
      expect(result).toContain(AUTHOR_1);
      expect(result).toContain('Great proposal');
      expect(result).toContain('2025-06-15');
    });

    it('excludes deleted comments', () => {
      const comments = [
        makeComment({ content: 'Visible', deleted: false }),
        makeComment({ content: 'Deleted', deleted: true }),
      ];

      const result = exportCommentsAsText(comments);
      expect(result).toContain('Visible');
      expect(result).not.toContain('Deleted');
    });

    it('indents replies with > prefix', () => {
      const comments = [
        makeComment({ parentId: null, content: 'Parent' }),
        makeComment({ parentId: 'parent-1', content: 'Reply text' }),
      ];

      const result = exportCommentsAsText(comments);
      expect(result).toContain('  > Reply text');
    });

    it('shows edited indicator', () => {
      const comments = [
        makeComment({
          content: 'Edited comment',
          editedAt: Date.now(),
        }),
      ];

      const result = exportCommentsAsText(comments);
      expect(result).toContain('(edited)');
    });

    it('sorts comments chronologically', () => {
      const now = Date.now();
      const comments = [
        makeComment({ content: 'Second', createdAt: now + 1000 }),
        makeComment({ content: 'First', createdAt: now }),
      ];

      const result = exportCommentsAsText(comments);
      const firstIndex = result.indexOf('First');
      const secondIndex = result.indexOf('Second');
      expect(firstIndex).toBeLessThan(secondIndex);
    });
  });
});

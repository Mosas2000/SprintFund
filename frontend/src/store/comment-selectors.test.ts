import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCommentsStore } from './comments';
import type { Comment, CommentSortOrder } from '../types/comment';

/* ── localStorage mock ────────────────────────── */

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

/* ── Helpers ──────────────────────────────────── */

const PROPOSAL_ID = 42;
const AUTHOR_A = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
const AUTHOR_B = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: `c-${Date.now()}-${Math.random()}`,
    proposalId: PROPOSAL_ID,
    author: AUTHOR_A,
    content: 'Test comment',
    createdAt: Date.now(),
    editedAt: null,
    parentId: null,
    deleted: false,
    reactions: [],
    ...overrides,
  };
}

/* ── Tests ────────────────────────────────────── */

describe('Comment selectors', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    useCommentsStore.setState({
      commentsByProposal: {},
      sortOrder: 'newest',
    });
  });

  describe('getCommentsByProposal (store getter)', () => {
    it('returns empty array for unknown proposal', () => {
      const result = useCommentsStore.getState().getCommentsByProposal(999);
      expect(result).toEqual([]);
    });

    it('returns comments for a known proposal', () => {
      const comment = makeComment({ id: 'c1' });
      useCommentsStore.setState({
        commentsByProposal: { [PROPOSAL_ID]: [comment] },
      });

      const result = useCommentsStore.getState().getCommentsByProposal(PROPOSAL_ID);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('c1');
    });

    it('does not mix comments between proposals', () => {
      const commentA = makeComment({ id: 'a1', proposalId: 1 });
      const commentB = makeComment({ id: 'b1', proposalId: 2 });
      useCommentsStore.setState({
        commentsByProposal: {
          1: [commentA],
          2: [commentB],
        },
      });

      const forOne = useCommentsStore.getState().getCommentsByProposal(1);
      const forTwo = useCommentsStore.getState().getCommentsByProposal(2);
      expect(forOne).toHaveLength(1);
      expect(forTwo).toHaveLength(1);
      expect(forOne[0].id).toBe('a1');
      expect(forTwo[0].id).toBe('b1');
    });
  });

  describe('getCommentCount', () => {
    it('returns 0 for proposal with no comments', () => {
      expect(useCommentsStore.getState().getCommentCount(999)).toBe(0);
    });

    it('counts only non-deleted comments', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'c1', deleted: false }),
            makeComment({ id: 'c2', deleted: true }),
            makeComment({ id: 'c3', deleted: false }),
          ],
        },
      });

      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(2);
    });

    it('returns 0 when all comments are deleted', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'c1', deleted: true }),
            makeComment({ id: 'c2', deleted: true }),
          ],
        },
      });

      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(0);
    });
  });

  describe('getReplyCount', () => {
    it('returns 0 when comment has no replies', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [makeComment({ id: 'parent' })],
        },
      });

      expect(useCommentsStore.getState().getReplyCount('parent', PROPOSAL_ID)).toBe(0);
    });

    it('counts direct replies to a comment', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'parent' }),
            makeComment({ id: 'reply1', parentId: 'parent' }),
            makeComment({ id: 'reply2', parentId: 'parent' }),
            makeComment({ id: 'other', parentId: null }),
          ],
        },
      });

      expect(useCommentsStore.getState().getReplyCount('parent', PROPOSAL_ID)).toBe(2);
    });
  });

  describe('getReplyDepth', () => {
    it('returns 0 for top-level comment', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [makeComment({ id: 'top', parentId: null })],
        },
      });

      expect(useCommentsStore.getState().getReplyDepth('top', PROPOSAL_ID)).toBe(0);
    });

    it('returns 1 for a direct reply', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'root', parentId: null }),
            makeComment({ id: 'reply', parentId: 'root' }),
          ],
        },
      });

      expect(useCommentsStore.getState().getReplyDepth('reply', PROPOSAL_ID)).toBe(1);
    });

    it('returns correct depth for nested replies', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'level0', parentId: null }),
            makeComment({ id: 'level1', parentId: 'level0' }),
            makeComment({ id: 'level2', parentId: 'level1' }),
            makeComment({ id: 'level3', parentId: 'level2' }),
          ],
        },
      });

      expect(useCommentsStore.getState().getReplyDepth('level0', PROPOSAL_ID)).toBe(0);
      expect(useCommentsStore.getState().getReplyDepth('level1', PROPOSAL_ID)).toBe(1);
      expect(useCommentsStore.getState().getReplyDepth('level2', PROPOSAL_ID)).toBe(2);
      expect(useCommentsStore.getState().getReplyDepth('level3', PROPOSAL_ID)).toBe(3);
    });
  });

  describe('getUserCommentCount', () => {
    it('returns 0 when user has no comments', () => {
      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, AUTHOR_A)).toBe(0);
    });

    it('counts only the specified user comments', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'c1', author: AUTHOR_A }),
            makeComment({ id: 'c2', author: AUTHOR_B }),
            makeComment({ id: 'c3', author: AUTHOR_A }),
          ],
        },
      });

      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, AUTHOR_A)).toBe(2);
      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, AUTHOR_B)).toBe(1);
    });

    it('excludes deleted comments from count', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [
            makeComment({ id: 'c1', author: AUTHOR_A, deleted: false }),
            makeComment({ id: 'c2', author: AUTHOR_A, deleted: true }),
          ],
        },
      });

      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, AUTHOR_A)).toBe(1);
    });
  });

  describe('sortOrder', () => {
    it('defaults to newest', () => {
      expect(useCommentsStore.getState().sortOrder).toBe('newest');
    });

    it('updates sort order via setSortOrder', () => {
      useCommentsStore.getState().setSortOrder('oldest');
      expect(useCommentsStore.getState().sortOrder).toBe('oldest');
    });

    it('can toggle back to newest', () => {
      useCommentsStore.getState().setSortOrder('oldest');
      useCommentsStore.getState().setSortOrder('newest');
      expect(useCommentsStore.getState().sortOrder).toBe('newest');
    });
  });

  describe('toggleReaction', () => {
    it('adds a reaction when none exists', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [makeComment({ id: 'c1', reactions: [] })],
        },
      });

      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_A, 'upvote');
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(comments[0].reactions).toHaveLength(1);
      expect(comments[0].reactions[0].type).toBe('upvote');
      expect(comments[0].reactions[0].address).toBe(AUTHOR_A);
    });

    it('removes a reaction when same type is toggled again', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [makeComment({ id: 'c1', reactions: [] })],
        },
      });

      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_A, 'upvote');
      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_A, 'upvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(comments[0].reactions).toHaveLength(0);
    });

    it('switches reaction type when different type is toggled', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [makeComment({ id: 'c1', reactions: [] })],
        },
      });

      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_A, 'upvote');
      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_A, 'downvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(comments[0].reactions).toHaveLength(1);
      expect(comments[0].reactions[0].type).toBe('downvote');
    });

    it('allows multiple users to react to the same comment', () => {
      useCommentsStore.setState({
        commentsByProposal: {
          [PROPOSAL_ID]: [makeComment({ id: 'c1', reactions: [] })],
        },
      });

      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_A, 'upvote');
      useCommentsStore.getState().toggleReaction('c1', PROPOSAL_ID, AUTHOR_B, 'upvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(comments[0].reactions).toHaveLength(2);
    });
  });
});

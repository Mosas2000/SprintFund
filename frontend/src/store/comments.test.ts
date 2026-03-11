import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useCommentsStore } from '../store/comments';
import { COMMENT_RULES } from '../types/comment';

// Mock localStorage
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

const TEST_AUTHOR = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
const TEST_AUTHOR_2 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const PROPOSAL_ID = 1;

describe('Comments store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();

    // Reset store state
    useCommentsStore.setState({
      commentsByProposal: {},
      sortOrder: 'newest',
    });
  });

  describe('loadComments', () => {
    it('loads empty array when no stored comments', () => {
      useCommentsStore.getState().loadComments(PROPOSAL_ID);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments).toEqual([]);
    });

    it('loads comments from localStorage', () => {
      const stored = [
        { id: 'c1', proposalId: PROPOSAL_ID, author: TEST_AUTHOR, content: 'Test', createdAt: 1000, editedAt: null, parentId: null, deleted: false, reactions: [] },
      ];
      localStorageMock.setItem(`sprintfund-comments-${PROPOSAL_ID}`, JSON.stringify(stored));

      useCommentsStore.getState().loadComments(PROPOSAL_ID);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments).toHaveLength(1);
      expect(comments![0].content).toBe('Test');
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorageMock.setItem(`sprintfund-comments-${PROPOSAL_ID}`, 'not json');
      useCommentsStore.getState().loadComments(PROPOSAL_ID);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments).toEqual([]);
    });

    it('handles non-array localStorage value gracefully', () => {
      localStorageMock.setItem(`sprintfund-comments-${PROPOSAL_ID}`, JSON.stringify({ not: 'array' }));
      useCommentsStore.getState().loadComments(PROPOSAL_ID);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments).toEqual([]);
    });
  });

  describe('addComment', () => {
    it('adds a new top-level comment', () => {
      const result = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Hello world',
      });

      expect(result).not.toBeNull();
      expect(result!.content).toBe('Hello world');
      expect(result!.author).toBe(TEST_AUTHOR);
      expect(result!.parentId).toBeNull();

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments).toHaveLength(1);
    });

    it('persists comment to localStorage', () => {
      useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Persisted',
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `sprintfund-comments-${PROPOSAL_ID}`,
        expect.any(String),
      );
    });

    it('trims content whitespace', () => {
      const result = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: '  trimmed  ',
      });

      expect(result!.content).toBe('trimmed');
    });

    it('generates unique IDs for comments', () => {
      const c1 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'First',
      });
      const c2 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Second',
      });

      expect(c1!.id).not.toBe(c2!.id);
    });

    it('adds a reply with parentId', () => {
      const parent = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Parent',
      });

      const reply = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR_2,
        content: 'Reply',
        parentId: parent!.id,
      });

      expect(reply!.parentId).toBe(parent!.id);
    });

    it('rejects comment when user exceeds limit', () => {
      // Add maxCommentsPerUser comments
      for (let i = 0; i < COMMENT_RULES.maxCommentsPerUser; i++) {
        useCommentsStore.getState().addComment({
          proposalId: PROPOSAL_ID,
          author: TEST_AUTHOR,
          content: `Comment ${i}`,
        });
      }

      const result = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Over limit',
      });

      expect(result).toBeNull();
    });

    it('allows different users to comment within individual limits', () => {
      useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Author 1 comment',
      });

      const result = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR_2,
        content: 'Author 2 comment',
      });

      expect(result).not.toBeNull();
    });
  });

  describe('editComment', () => {
    it('edits a comment by the original author', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Original',
      });

      const result = useCommentsStore.getState().editComment({
        commentId: comment!.id,
        content: 'Updated',
        author: TEST_AUTHOR,
      });

      expect(result).toBe(true);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].content).toBe('Updated');
      expect(comments![0].editedAt).not.toBeNull();
    });

    it('rejects edit from different author', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Original',
      });

      const result = useCommentsStore.getState().editComment({
        commentId: comment!.id,
        content: 'Hacked',
        author: TEST_AUTHOR_2,
      });

      expect(result).toBe(false);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].content).toBe('Original');
    });

    it('rejects edit on deleted comment', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Deleted',
      });
      useCommentsStore.getState().deleteComment(comment!.id, PROPOSAL_ID, TEST_AUTHOR);

      const result = useCommentsStore.getState().editComment({
        commentId: comment!.id,
        content: 'Should fail',
        author: TEST_AUTHOR,
      });

      expect(result).toBe(false);
    });

    it('returns false for non-existent comment', () => {
      const result = useCommentsStore.getState().editComment({
        commentId: 'nonexistent',
        content: 'Should fail',
        author: TEST_AUTHOR,
      });

      expect(result).toBe(false);
    });
  });

  describe('deleteComment', () => {
    it('soft-deletes a comment', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'To delete',
      });

      const result = useCommentsStore.getState().deleteComment(comment!.id, PROPOSAL_ID, TEST_AUTHOR);

      expect(result).toBe(true);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].deleted).toBe(true);
      expect(comments![0].content).toBe('');
    });

    it('rejects deletion from different author', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Protected',
      });

      const result = useCommentsStore.getState().deleteComment(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2);

      expect(result).toBe(false);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].deleted).toBe(false);
    });

    it('returns false for already deleted comment', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Deleted',
      });
      useCommentsStore.getState().deleteComment(comment!.id, PROPOSAL_ID, TEST_AUTHOR);

      const result = useCommentsStore.getState().deleteComment(comment!.id, PROPOSAL_ID, TEST_AUTHOR);
      expect(result).toBe(false);
    });

    it('returns false for non-existent comment', () => {
      const result = useCommentsStore.getState().deleteComment('nonexistent', PROPOSAL_ID, TEST_AUTHOR);
      expect(result).toBe(false);
    });
  });

  describe('toggleReaction', () => {
    it('adds an upvote reaction', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'React to this',
      });

      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'upvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].reactions).toHaveLength(1);
      expect(comments![0].reactions[0].type).toBe('upvote');
    });

    it('removes reaction when toggled again', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Toggle reaction',
      });

      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'upvote');
      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'upvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].reactions).toHaveLength(0);
    });

    it('replaces reaction type when switching', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Switch reaction',
      });

      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'upvote');
      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'downvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].reactions).toHaveLength(1);
      expect(comments![0].reactions[0].type).toBe('downvote');
    });

    it('allows multiple users to react', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Multi react',
      });

      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR, 'upvote');
      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'upvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].reactions).toHaveLength(2);
    });

    it('does not react to deleted comments', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Deleted',
      });
      useCommentsStore.getState().deleteComment(comment!.id, PROPOSAL_ID, TEST_AUTHOR);

      useCommentsStore.getState().toggleReaction(comment!.id, PROPOSAL_ID, TEST_AUTHOR_2, 'upvote');

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID];
      expect(comments![0].reactions).toHaveLength(0);
    });
  });

  describe('sortOrder', () => {
    it('defaults to newest', () => {
      expect(useCommentsStore.getState().sortOrder).toBe('newest');
    });

    it('changes sort order', () => {
      useCommentsStore.getState().setSortOrder('oldest');
      expect(useCommentsStore.getState().sortOrder).toBe('oldest');
    });
  });

  describe('getCommentCount', () => {
    it('returns 0 for empty proposal', () => {
      expect(useCommentsStore.getState().getCommentCount(999)).toBe(0);
    });

    it('excludes deleted comments', () => {
      const c1 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Active',
      });
      useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'To delete',
      });
      useCommentsStore.getState().deleteComment(
        useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]![1].id,
        PROPOSAL_ID,
        TEST_AUTHOR,
      );

      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(1);
    });
  });

  describe('getReplyDepth', () => {
    it('returns 0 for top-level comment', () => {
      const comment = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Top level',
      });

      expect(useCommentsStore.getState().getReplyDepth(comment!.id, PROPOSAL_ID)).toBe(0);
    });

    it('returns correct depth for nested replies', () => {
      const c1 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Level 0',
      });
      const c2 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Level 1',
        parentId: c1!.id,
      });
      const c3 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Level 2',
        parentId: c2!.id,
      });

      expect(useCommentsStore.getState().getReplyDepth(c2!.id, PROPOSAL_ID)).toBe(1);
      expect(useCommentsStore.getState().getReplyDepth(c3!.id, PROPOSAL_ID)).toBe(2);
    });
  });

  describe('getUserCommentCount', () => {
    it('returns 0 when user has no comments', () => {
      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, TEST_AUTHOR)).toBe(0);
    });

    it('counts only non-deleted user comments', () => {
      useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Comment 1',
      });
      const c2 = useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'Comment 2',
      });
      useCommentsStore.getState().deleteComment(c2!.id, PROPOSAL_ID, TEST_AUTHOR);

      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, TEST_AUTHOR)).toBe(1);
    });

    it('counts per-user separately', () => {
      useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR,
        content: 'User 1',
      });
      useCommentsStore.getState().addComment({
        proposalId: PROPOSAL_ID,
        author: TEST_AUTHOR_2,
        content: 'User 2',
      });

      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, TEST_AUTHOR)).toBe(1);
      expect(useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, TEST_AUTHOR_2)).toBe(1);
    });
  });
});

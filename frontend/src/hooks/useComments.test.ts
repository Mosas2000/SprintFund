import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCommentsStore } from '../store/comments';
import { validateCommentContent, validateUserCommentLimit, validateReplyDepth } from '../lib/comment-validation';
import { sanitizeText } from '../lib/sanitize';
import { COMMENT_RULES } from '../types/comment';

/**
 * Integration tests for the comment workflow that the useComments hook
 * orchestrates. These tests exercise the store actions composed with
 * validation and sanitization, covering the same behavioral contract
 * as the hook without requiring a React rendering context.
 */

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

/* ── Constants ────────────────────────────────── */

const PROPOSAL_ID = 7;
const AUTHOR = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
const OTHER_AUTHOR = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

/* ── Helpers replicating hook logic ───────────── */

function postComment(
  content: string,
  author: string,
  parentId?: string | null,
) {
  const contentErrors = validateCommentContent(content);
  if (contentErrors.length > 0) return null;

  const userCount = useCommentsStore.getState().getUserCommentCount(PROPOSAL_ID, author);
  const limitErrors = validateUserCommentLimit(userCount);
  if (limitErrors.length > 0) return null;

  if (parentId) {
    const depth = useCommentsStore.getState().getReplyDepth(parentId, PROPOSAL_ID);
    const depthErrors = validateReplyDepth(depth);
    if (depthErrors.length > 0) return null;
  }

  const sanitized = sanitizeText(content.trim());
  return useCommentsStore.getState().addComment({
    proposalId: PROPOSAL_ID,
    author,
    content: sanitized,
    parentId: parentId ?? undefined,
  });
}

function editComment(commentId: string, content: string, author: string) {
  const sanitized = sanitizeText(content.trim());
  return useCommentsStore.getState().editComment({ commentId, content: sanitized, author });
}

function removeComment(commentId: string, author: string) {
  return useCommentsStore.getState().deleteComment(commentId, PROPOSAL_ID, author);
}

function upvoteComment(commentId: string, author: string) {
  useCommentsStore.getState().toggleReaction(commentId, PROPOSAL_ID, author, 'upvote');
}

function downvoteComment(commentId: string, author: string) {
  useCommentsStore.getState().toggleReaction(commentId, PROPOSAL_ID, author, 'downvote');
}

/* ── Tests ────────────────────────────────────── */

describe('useComments integration workflow', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    useCommentsStore.setState({
      commentsByProposal: {},
      sortOrder: 'newest',
    });
  });

  describe('post workflow', () => {
    it('creates a comment with sanitized content', () => {
      const result = postComment('  Hello world  ', AUTHOR);
      expect(result).not.toBeNull();
      expect(result!.content).toBe('Hello world');
      expect(result!.author).toBe(AUTHOR);
    });

    it('rejects content that is too short', () => {
      const result = postComment('a', AUTHOR);
      expect(result).toBeNull();
    });

    it('rejects empty content', () => {
      const result = postComment('', AUTHOR);
      expect(result).toBeNull();
    });

    it('rejects whitespace-only content', () => {
      const result = postComment('   ', AUTHOR);
      expect(result).toBeNull();
    });

    it('rejects content exceeding max length', () => {
      const long = 'a'.repeat(COMMENT_RULES.maxLength + 1);
      const result = postComment(long, AUTHOR);
      expect(result).toBeNull();
    });

    it('enforces user comment limit', () => {
      for (let i = 0; i < COMMENT_RULES.maxCommentsPerUser; i++) {
        const r = postComment(`Comment number ${i + 1}`, AUTHOR);
        expect(r).not.toBeNull();
      }

      const overLimit = postComment('One too many', AUTHOR);
      expect(overLimit).toBeNull();
    });

    it('allows different users to comment independently', () => {
      const r1 = postComment('First user comment', AUTHOR);
      const r2 = postComment('Second user comment', OTHER_AUTHOR);
      expect(r1).not.toBeNull();
      expect(r2).not.toBeNull();

      const count = useCommentsStore.getState().getCommentCount(PROPOSAL_ID);
      expect(count).toBe(2);
    });
  });

  describe('reply workflow', () => {
    it('creates a reply linked to parent', () => {
      const parent = postComment('Parent comment', AUTHOR)!;
      const reply = postComment('Reply to parent', OTHER_AUTHOR, parent.id);

      expect(reply).not.toBeNull();
      expect(reply!.parentId).toBe(parent.id);
    });

    it('enforces max reply depth', () => {
      let currentId: string | null = null;

      // Build chain up to max depth
      for (let i = 0; i <= COMMENT_RULES.maxReplyDepth; i++) {
        const content = `Depth ${i} comment`;
        const result = postComment(content, AUTHOR, currentId);
        expect(result).not.toBeNull();
        currentId = result!.id;
      }

      // One more should fail (exceeds max depth)
      const tooDeep = postComment('Too deep', AUTHOR, currentId);
      expect(tooDeep).toBeNull();
    });
  });

  describe('edit workflow', () => {
    it('edits a comment with sanitized content', () => {
      const comment = postComment('Original text', AUTHOR)!;
      const success = editComment(comment.id, '  Updated text  ', AUTHOR);

      expect(success).toBe(true);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      const edited = comments.find((c) => c.id === comment.id)!;
      expect(edited.content).toBe('Updated text');
      expect(edited.editedAt).not.toBeNull();
    });

    it('prevents editing by a different author', () => {
      const comment = postComment('My comment', AUTHOR)!;
      const success = editComment(comment.id, 'Hijacked', OTHER_AUTHOR);
      expect(success).toBe(false);
    });
  });

  describe('delete workflow', () => {
    it('soft-deletes a comment by its author', () => {
      const comment = postComment('To be deleted', AUTHOR)!;
      const success = removeComment(comment.id, AUTHOR);

      expect(success).toBe(true);
      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(comments[0].deleted).toBe(true);
    });

    it('prevents deletion by a different author', () => {
      const comment = postComment('Protected', AUTHOR)!;
      const success = removeComment(comment.id, OTHER_AUTHOR);
      expect(success).toBe(false);
    });

    it('deleted comments reduce active count', () => {
      const comment = postComment('Counted', AUTHOR)!;
      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(1);

      removeComment(comment.id, AUTHOR);
      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(0);
    });
  });

  describe('reaction workflow', () => {
    it('upvote adds an upvote reaction', () => {
      const comment = postComment('Nice proposal', AUTHOR)!;
      upvoteComment(comment.id, OTHER_AUTHOR);

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      const target = comments.find((c) => c.id === comment.id)!;
      expect(target.reactions).toHaveLength(1);
      expect(target.reactions[0].type).toBe('upvote');
    });

    it('downvote adds a downvote reaction', () => {
      const comment = postComment('Controversial', AUTHOR)!;
      downvoteComment(comment.id, OTHER_AUTHOR);

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      const target = comments.find((c) => c.id === comment.id)!;
      expect(target.reactions[0].type).toBe('downvote');
    });

    it('switching from upvote to downvote replaces the reaction', () => {
      const comment = postComment('Changed mind', AUTHOR)!;
      upvoteComment(comment.id, OTHER_AUTHOR);
      downvoteComment(comment.id, OTHER_AUTHOR);

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      const target = comments.find((c) => c.id === comment.id)!;
      expect(target.reactions).toHaveLength(1);
      expect(target.reactions[0].type).toBe('downvote');
    });

    it('double upvote removes the reaction', () => {
      const comment = postComment('Toggle test', AUTHOR)!;
      upvoteComment(comment.id, OTHER_AUTHOR);
      upvoteComment(comment.id, OTHER_AUTHOR);

      const comments = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      const target = comments.find((c) => c.id === comment.id)!;
      expect(target.reactions).toHaveLength(0);
    });
  });

  describe('sort order', () => {
    it('changes sort order', () => {
      useCommentsStore.getState().setSortOrder('oldest');
      expect(useCommentsStore.getState().sortOrder).toBe('oldest');
    });
  });

  describe('full lifecycle', () => {
    it('supports create, edit, react, and delete in sequence', () => {
      // Create
      const comment = postComment('Initial thought', AUTHOR)!;
      expect(comment).not.toBeNull();
      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(1);

      // Edit
      editComment(comment.id, 'Revised thought', AUTHOR);
      const afterEdit = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(afterEdit[0].content).toBe('Revised thought');

      // React
      upvoteComment(comment.id, OTHER_AUTHOR);
      const afterReact = useCommentsStore.getState().commentsByProposal[PROPOSAL_ID]!;
      expect(afterReact[0].reactions).toHaveLength(1);

      // Delete
      removeComment(comment.id, AUTHOR);
      expect(useCommentsStore.getState().getCommentCount(PROPOSAL_ID)).toBe(0);
    });

    it('persists all operations to localStorage', () => {
      postComment('Persistent comment', AUTHOR);
      expect(localStorageMock.setItem).toHaveBeenCalled();

      const stored = localStorageMock.setItem.mock.calls.find(
        (args: string[]) => args[0] === `sprintfund-comments-${PROPOSAL_ID}`,
      );
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored![1]);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].content).toBe('Persistent comment');
    });
  });
});

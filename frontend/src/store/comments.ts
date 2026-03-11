import { create } from 'zustand';
import type {
  Comment,
  CommentReaction,
  CommentSortOrder,
  NewCommentInput,
  EditCommentInput,
  ReactionType,
} from '../types/comment';
import { COMMENT_RULES } from '../types/comment';

/* ── Constants ────────────────────────────────── */

const STORAGE_KEY_PREFIX = 'sprintfund-comments-';

/* ── Store interface ──────────────────────────── */

interface CommentsStore {
  /** Comments indexed by proposalId */
  commentsByProposal: Record<number, Comment[]>;
  /** Current sort order */
  sortOrder: CommentSortOrder;

  /* ── Actions ─────────────────────────────────── */
  loadComments: (proposalId: number) => void;
  addComment: (input: NewCommentInput) => Comment | null;
  editComment: (input: EditCommentInput) => boolean;
  deleteComment: (commentId: string, proposalId: number, author: string) => boolean;
  toggleReaction: (commentId: string, proposalId: number, address: string, type: ReactionType) => void;
  setSortOrder: (order: CommentSortOrder) => void;
  getCommentsByProposal: (proposalId: number) => Comment[];
  getCommentCount: (proposalId: number) => number;
  getReplyCount: (commentId: string, proposalId: number) => number;
  getReplyDepth: (commentId: string, proposalId: number) => number;
  getUserCommentCount: (proposalId: number, author: string) => number;
}

/* ── ID generator ─────────────────────────────── */

let idCounter = 0;

function generateCommentId(): string {
  idCounter += 1;
  return `comment-${Date.now()}-${idCounter}`;
}

/* ── localStorage helpers ─────────────────────── */

function getStorageKey(proposalId: number): string {
  return `${STORAGE_KEY_PREFIX}${proposalId}`;
}

function loadFromStorage(proposalId: number): Comment[] {
  try {
    const raw = localStorage.getItem(getStorageKey(proposalId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveToStorage(proposalId: number, comments: Comment[]): void {
  try {
    localStorage.setItem(getStorageKey(proposalId), JSON.stringify(comments));
  } catch {
    // Storage full or unavailable - fail silently
  }
}

/* ── Store ────────────────────────────────────── */

export const useCommentsStore = create<CommentsStore>((set, get) => ({
  commentsByProposal: {},
  sortOrder: 'newest',

  loadComments: (proposalId) => {
    const comments = loadFromStorage(proposalId);
    set((state) => ({
      commentsByProposal: {
        ...state.commentsByProposal,
        [proposalId]: comments,
      },
    }));
  },

  addComment: (input) => {
    const { proposalId, author, content, parentId } = input;
    const state = get();
    const existing = state.commentsByProposal[proposalId] ?? [];

    // Check user comment limit
    const userCount = existing.filter((c) => c.author === author && !c.deleted).length;
    if (userCount >= COMMENT_RULES.maxCommentsPerUser) {
      return null;
    }

    // Check reply depth
    if (parentId) {
      const depth = get().getReplyDepth(parentId, proposalId);
      if (depth >= COMMENT_RULES.maxReplyDepth) {
        return null;
      }
    }

    const comment: Comment = {
      id: generateCommentId(),
      proposalId,
      author,
      content: content.trim(),
      createdAt: Date.now(),
      editedAt: null,
      parentId: parentId ?? null,
      deleted: false,
      reactions: [],
    };

    const updated = [...existing, comment];

    set((state) => ({
      commentsByProposal: {
        ...state.commentsByProposal,
        [proposalId]: updated,
      },
    }));

    saveToStorage(proposalId, updated);
    return comment;
  },

  editComment: (input) => {
    const { commentId, content, author } = input;
    const state = get();

    // Find the proposal that contains this comment
    for (const [pidStr, comments] of Object.entries(state.commentsByProposal)) {
      const proposalId = Number(pidStr);
      const index = comments.findIndex((c) => c.id === commentId);
      if (index === -1) continue;

      const comment = comments[index];

      // Only the author can edit
      if (comment.author !== author) return false;
      // Cannot edit deleted comments
      if (comment.deleted) return false;

      const updated = [...comments];
      updated[index] = {
        ...comment,
        content: content.trim(),
        editedAt: Date.now(),
      };

      set((prev) => ({
        commentsByProposal: {
          ...prev.commentsByProposal,
          [proposalId]: updated,
        },
      }));

      saveToStorage(proposalId, updated);
      return true;
    }

    return false;
  },

  deleteComment: (commentId, proposalId, author) => {
    const state = get();
    const comments = state.commentsByProposal[proposalId] ?? [];
    const index = comments.findIndex((c) => c.id === commentId);

    if (index === -1) return false;

    const comment = comments[index];
    if (comment.author !== author) return false;
    if (comment.deleted) return false;

    const updated = [...comments];
    updated[index] = {
      ...comment,
      deleted: true,
      content: '',
    };

    set((prev) => ({
      commentsByProposal: {
        ...prev.commentsByProposal,
        [proposalId]: updated,
      },
    }));

    saveToStorage(proposalId, updated);
    return true;
  },

  toggleReaction: (commentId, proposalId, address, type) => {
    const state = get();
    const comments = state.commentsByProposal[proposalId] ?? [];
    const index = comments.findIndex((c) => c.id === commentId);

    if (index === -1) return;

    const comment = comments[index];
    if (comment.deleted) return;

    const existingReactionIndex = comment.reactions.findIndex(
      (r) => r.address === address && r.type === type,
    );

    let updatedReactions: CommentReaction[];

    if (existingReactionIndex !== -1) {
      // Remove existing reaction (toggle off)
      updatedReactions = comment.reactions.filter(
        (_, i) => i !== existingReactionIndex,
      );
    } else {
      // Remove any other reaction by this user, then add new one
      updatedReactions = comment.reactions.filter(
        (r) => r.address !== address,
      );
      updatedReactions.push({
        address,
        type,
        createdAt: Date.now(),
      });
    }

    const updated = [...comments];
    updated[index] = {
      ...comment,
      reactions: updatedReactions,
    };

    set((prev) => ({
      commentsByProposal: {
        ...prev.commentsByProposal,
        [proposalId]: updated,
      },
    }));

    saveToStorage(proposalId, updated);
  },

  setSortOrder: (order) => {
    set({ sortOrder: order });
  },

  getCommentsByProposal: (proposalId) => {
    return get().commentsByProposal[proposalId] ?? [];
  },

  getCommentCount: (proposalId) => {
    const comments = get().commentsByProposal[proposalId] ?? [];
    return comments.filter((c) => !c.deleted).length;
  },

  getReplyCount: (commentId, proposalId) => {
    const comments = get().commentsByProposal[proposalId] ?? [];
    return comments.filter((c) => c.parentId === commentId && !c.deleted).length;
  },

  getReplyDepth: (commentId, proposalId) => {
    const comments = get().commentsByProposal[proposalId] ?? [];
    let depth = 0;
    let currentId: string | null = commentId;

    while (currentId) {
      const parent = comments.find((c) => c.id === currentId);
      if (!parent || !parent.parentId) break;
      currentId = parent.parentId;
      depth += 1;
    }

    return depth;
  },

  getUserCommentCount: (proposalId, author) => {
    const comments = get().commentsByProposal[proposalId] ?? [];
    return comments.filter((c) => c.author === author && !c.deleted).length;
  },
}));

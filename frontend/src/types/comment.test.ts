import { describe, it, expect } from 'vitest';
import {
  COMMENT_RULES,
} from '../types/comment';
import type {
  Comment,
  CommentReaction,
  CommentSortOrder,
  ReactionType,
  NewCommentInput,
  EditCommentInput,
  CommentValidationError,
} from '../types/comment';

describe('Comment types', () => {
  describe('COMMENT_RULES', () => {
    it('defines minimum content length', () => {
      expect(COMMENT_RULES.minLength).toBe(2);
    });

    it('defines maximum content length', () => {
      expect(COMMENT_RULES.maxLength).toBe(1000);
    });

    it('defines maximum reply depth', () => {
      expect(COMMENT_RULES.maxReplyDepth).toBe(3);
    });

    it('defines maximum comments per user', () => {
      expect(COMMENT_RULES.maxCommentsPerUser).toBe(50);
    });

    it('has all required fields', () => {
      expect(COMMENT_RULES).toHaveProperty('minLength');
      expect(COMMENT_RULES).toHaveProperty('maxLength');
      expect(COMMENT_RULES).toHaveProperty('maxReplyDepth');
      expect(COMMENT_RULES).toHaveProperty('maxCommentsPerUser');
    });

    it('has reasonable limits', () => {
      expect(COMMENT_RULES.minLength).toBeGreaterThan(0);
      expect(COMMENT_RULES.maxLength).toBeGreaterThan(COMMENT_RULES.minLength);
      expect(COMMENT_RULES.maxReplyDepth).toBeGreaterThan(0);
      expect(COMMENT_RULES.maxCommentsPerUser).toBeGreaterThan(0);
    });
  });

  describe('Type structure', () => {
    it('creates a valid Comment object', () => {
      const comment: Comment = {
        id: 'comment-1',
        proposalId: 1,
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        content: 'This is a test comment',
        createdAt: Date.now(),
        editedAt: null,
        parentId: null,
        deleted: false,
        reactions: [],
      };

      expect(comment.id).toBe('comment-1');
      expect(comment.parentId).toBeNull();
      expect(comment.editedAt).toBeNull();
      expect(comment.deleted).toBe(false);
      expect(comment.reactions).toEqual([]);
    });

    it('creates a valid CommentReaction object', () => {
      const reaction: CommentReaction = {
        address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        type: 'upvote',
        createdAt: Date.now(),
      };

      expect(reaction.type).toBe('upvote');
      expect(reaction.address).toBeTruthy();
    });

    it('creates a valid NewCommentInput object', () => {
      const input: NewCommentInput = {
        proposalId: 1,
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        content: 'New comment content',
        parentId: null,
      };

      expect(input.proposalId).toBe(1);
      expect(input.parentId).toBeNull();
    });

    it('creates a valid EditCommentInput object', () => {
      const input: EditCommentInput = {
        commentId: 'comment-1',
        content: 'Updated content',
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
      };

      expect(input.commentId).toBe('comment-1');
      expect(input.content).toBe('Updated content');
    });

    it('handles CommentSortOrder type values', () => {
      const newest: CommentSortOrder = 'newest';
      const oldest: CommentSortOrder = 'oldest';

      expect(newest).toBe('newest');
      expect(oldest).toBe('oldest');
    });

    it('handles ReactionType values', () => {
      const upvote: ReactionType = 'upvote';
      const downvote: ReactionType = 'downvote';

      expect(upvote).toBe('upvote');
      expect(downvote).toBe('downvote');
    });

    it('creates a valid CommentValidationError object', () => {
      const error: CommentValidationError = {
        field: 'content',
        message: 'Too short',
      };

      expect(error.field).toBe('content');
      expect(error.message).toBe('Too short');
    });

    it('creates Comment with reply parentId', () => {
      const reply: Comment = {
        id: 'comment-2',
        proposalId: 1,
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        content: 'This is a reply',
        createdAt: Date.now(),
        editedAt: null,
        parentId: 'comment-1',
        deleted: false,
        reactions: [],
      };

      expect(reply.parentId).toBe('comment-1');
    });

    it('creates Comment with editedAt timestamp', () => {
      const edited: Comment = {
        id: 'comment-3',
        proposalId: 1,
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        content: 'Edited content',
        createdAt: Date.now() - 10000,
        editedAt: Date.now(),
        parentId: null,
        deleted: false,
        reactions: [],
      };

      expect(edited.editedAt).not.toBeNull();
      expect(edited.editedAt!).toBeGreaterThan(edited.createdAt);
    });

    it('creates Comment with reactions', () => {
      const comment: Comment = {
        id: 'comment-4',
        proposalId: 1,
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        content: 'Popular comment',
        createdAt: Date.now(),
        editedAt: null,
        parentId: null,
        deleted: false,
        reactions: [
          { address: 'SPAddr1', type: 'upvote', createdAt: Date.now() },
          { address: 'SPAddr2', type: 'downvote', createdAt: Date.now() },
        ],
      };

      expect(comment.reactions).toHaveLength(2);
      expect(comment.reactions[0].type).toBe('upvote');
      expect(comment.reactions[1].type).toBe('downvote');
    });

    it('creates deleted Comment with empty content', () => {
      const deleted: Comment = {
        id: 'comment-5',
        proposalId: 1,
        author: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
        content: '',
        createdAt: Date.now(),
        editedAt: null,
        parentId: null,
        deleted: true,
        reactions: [],
      };

      expect(deleted.deleted).toBe(true);
      expect(deleted.content).toBe('');
    });
  });
});

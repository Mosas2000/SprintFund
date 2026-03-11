import { describe, it, expect } from 'vitest';
import {
  validateCommentContent,
  isCommentValid,
  validateUserCommentLimit,
  validateReplyDepth,
  validateCommentAuthor,
  validateNewComment,
} from '../lib/comment-validation';
import { COMMENT_RULES } from '../types/comment';

describe('Comment validation', () => {
  describe('validateCommentContent', () => {
    it('returns error for empty content', () => {
      const errors = validateCommentContent('');
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('content');
      expect(errors[0].message).toContain('empty');
    });

    it('returns error for whitespace-only content', () => {
      const errors = validateCommentContent('   ');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('empty');
    });

    it('returns error for content below minimum length', () => {
      const errors = validateCommentContent('a');
      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(errors.some((e) => e.message.includes(`${COMMENT_RULES.minLength}`))).toBe(true);
    });

    it('returns error for content exceeding maximum length', () => {
      const longContent = 'a'.repeat(COMMENT_RULES.maxLength + 1);
      const errors = validateCommentContent(longContent);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(errors.some((e) => e.message.includes(`${COMMENT_RULES.maxLength}`))).toBe(true);
    });

    it('returns no errors for valid content', () => {
      const errors = validateCommentContent('This is a valid comment.');
      expect(errors).toHaveLength(0);
    });

    it('returns no errors for content at minimum length', () => {
      const content = 'ab';
      expect(content.length).toBe(COMMENT_RULES.minLength);
      const errors = validateCommentContent(content);
      expect(errors).toHaveLength(0);
    });

    it('returns no errors for content at maximum length', () => {
      const content = 'a'.repeat(COMMENT_RULES.maxLength);
      const errors = validateCommentContent(content);
      expect(errors).toHaveLength(0);
    });

    it('accepts content with HTML tags since sanitizeText strips tags to text', () => {
      // sanitizeText('<script>alert(1)</script>') -> 'alert(1)' which is valid
      const errors = validateCommentContent('<script>alert(1)</script>');
      expect(errors).toHaveLength(0);
    });

    it('trims whitespace before validation', () => {
      const errors = validateCommentContent('  Valid content  ');
      expect(errors).toHaveLength(0);
    });
  });

  describe('isCommentValid', () => {
    it('returns true for valid content', () => {
      expect(isCommentValid('This is valid.')).toBe(true);
    });

    it('returns false for empty content', () => {
      expect(isCommentValid('')).toBe(false);
    });

    it('returns false for too-short content', () => {
      expect(isCommentValid('a')).toBe(false);
    });

    it('returns false for too-long content', () => {
      expect(isCommentValid('a'.repeat(COMMENT_RULES.maxLength + 1))).toBe(false);
    });
  });

  describe('validateUserCommentLimit', () => {
    it('returns no errors when under limit', () => {
      const errors = validateUserCommentLimit(0);
      expect(errors).toHaveLength(0);
    });

    it('returns no errors when one below limit', () => {
      const errors = validateUserCommentLimit(COMMENT_RULES.maxCommentsPerUser - 1);
      expect(errors).toHaveLength(0);
    });

    it('returns error when at limit', () => {
      const errors = validateUserCommentLimit(COMMENT_RULES.maxCommentsPerUser);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('limit');
      expect(errors[0].message).toContain(`${COMMENT_RULES.maxCommentsPerUser}`);
    });

    it('returns error when over limit', () => {
      const errors = validateUserCommentLimit(COMMENT_RULES.maxCommentsPerUser + 10);
      expect(errors).toHaveLength(1);
    });
  });

  describe('validateReplyDepth', () => {
    it('returns no errors when depth is 0', () => {
      const errors = validateReplyDepth(0);
      expect(errors).toHaveLength(0);
    });

    it('returns no errors when one below max depth', () => {
      const errors = validateReplyDepth(COMMENT_RULES.maxReplyDepth - 1);
      expect(errors).toHaveLength(0);
    });

    it('returns error when at max depth', () => {
      const errors = validateReplyDepth(COMMENT_RULES.maxReplyDepth);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('depth');
      expect(errors[0].message).toContain(`${COMMENT_RULES.maxReplyDepth}`);
    });

    it('returns error when over max depth', () => {
      const errors = validateReplyDepth(COMMENT_RULES.maxReplyDepth + 5);
      expect(errors).toHaveLength(1);
    });
  });

  describe('validateCommentAuthor', () => {
    it('returns no errors for valid address', () => {
      const errors = validateCommentAuthor('SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE');
      expect(errors).toHaveLength(0);
    });

    it('returns error for empty author', () => {
      const errors = validateCommentAuthor('');
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('author');
      expect(errors[0].message).toContain('wallet');
    });

    it('returns error for whitespace-only author', () => {
      const errors = validateCommentAuthor('   ');
      expect(errors).toHaveLength(1);
    });
  });

  describe('validateNewComment', () => {
    const validAuthor = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';

    it('returns no errors for valid new comment', () => {
      const errors = validateNewComment('This is a valid comment.', validAuthor, 0);
      expect(errors).toHaveLength(0);
    });

    it('returns author error for empty author', () => {
      const errors = validateNewComment('Valid content', '', 0);
      expect(errors.some((e) => e.field === 'author')).toBe(true);
    });

    it('returns content error for empty content', () => {
      const errors = validateNewComment('', validAuthor, 0);
      expect(errors.some((e) => e.field === 'content')).toBe(true);
    });

    it('returns limit error when at limit', () => {
      const errors = validateNewComment(
        'Valid content',
        validAuthor,
        COMMENT_RULES.maxCommentsPerUser,
      );
      expect(errors.some((e) => e.field === 'limit')).toBe(true);
    });

    it('returns depth error when reply exceeds depth', () => {
      const errors = validateNewComment(
        'Valid reply',
        validAuthor,
        0,
        COMMENT_RULES.maxReplyDepth,
      );
      expect(errors.some((e) => e.field === 'depth')).toBe(true);
    });

    it('does not check depth when no replyDepth provided', () => {
      const errors = validateNewComment('Valid content', validAuthor, 0);
      expect(errors.some((e) => e.field === 'depth')).toBe(false);
    });

    it('returns multiple errors when multiple validations fail', () => {
      const errors = validateNewComment(
        '',
        '',
        COMMENT_RULES.maxCommentsPerUser,
        COMMENT_RULES.maxReplyDepth,
      );
      expect(errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});

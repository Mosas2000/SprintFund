import { COMMENT_RULES } from '../types/comment';
import type { CommentValidationError } from '../types/comment';
import { sanitizeText } from './sanitize';

/**
 * Validate comment content against the defined rules.
 * Returns an array of validation errors (empty if valid).
 */
export function validateCommentContent(content: string): CommentValidationError[] {
  const errors: CommentValidationError[] = [];
  const trimmed = content.trim();

  if (trimmed.length === 0) {
    errors.push({ field: 'content', message: 'Comment cannot be empty.' });
    return errors;
  }

  if (trimmed.length < COMMENT_RULES.minLength) {
    errors.push({
      field: 'content',
      message: `Comment must be at least ${COMMENT_RULES.minLength} characters.`,
    });
  }

  if (trimmed.length > COMMENT_RULES.maxLength) {
    errors.push({
      field: 'content',
      message: `Comment cannot exceed ${COMMENT_RULES.maxLength} characters.`,
    });
  }

  // Check if content is only whitespace or special characters
  const sanitized = sanitizeText(trimmed);
  if (sanitized.length === 0) {
    errors.push({
      field: 'content',
      message: 'Comment contains no valid text after sanitization.',
    });
  }

  return errors;
}

/**
 * Check if a comment content string is valid.
 */
export function isCommentValid(content: string): boolean {
  return validateCommentContent(content).length === 0;
}

/**
 * Validate that a user has not exceeded the per-proposal comment limit.
 */
export function validateUserCommentLimit(
  currentCount: number,
): CommentValidationError[] {
  const errors: CommentValidationError[] = [];

  if (currentCount >= COMMENT_RULES.maxCommentsPerUser) {
    errors.push({
      field: 'limit',
      message: `You have reached the maximum of ${COMMENT_RULES.maxCommentsPerUser} comments on this proposal.`,
    });
  }

  return errors;
}

/**
 * Validate that a reply does not exceed the maximum nesting depth.
 */
export function validateReplyDepth(
  currentDepth: number,
): CommentValidationError[] {
  const errors: CommentValidationError[] = [];

  if (currentDepth >= COMMENT_RULES.maxReplyDepth) {
    errors.push({
      field: 'depth',
      message: `Replies cannot be nested more than ${COMMENT_RULES.maxReplyDepth} levels deep.`,
    });
  }

  return errors;
}

/**
 * Validate that the author address is a non-empty string.
 */
export function validateCommentAuthor(author: string): CommentValidationError[] {
  const errors: CommentValidationError[] = [];

  if (!author || author.trim().length === 0) {
    errors.push({
      field: 'author',
      message: 'You must be connected with a wallet to comment.',
    });
  }

  return errors;
}

/**
 * Run all validations for creating a new comment.
 * Returns a combined array of all errors.
 */
export function validateNewComment(
  content: string,
  author: string,
  userCommentCount: number,
  replyDepth?: number,
): CommentValidationError[] {
  const errors: CommentValidationError[] = [];

  errors.push(...validateCommentAuthor(author));
  errors.push(...validateCommentContent(content));
  errors.push(...validateUserCommentLimit(userCommentCount));

  if (replyDepth !== undefined) {
    errors.push(...validateReplyDepth(replyDepth));
  }

  return errors;
}

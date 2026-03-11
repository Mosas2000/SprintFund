import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useWalletAddress, useWalletConnected } from '../store/wallet-selectors';
import { useAddComment, useUserCommentCount } from '../store/comment-selectors';
import { validateCommentContent, validateUserCommentLimit } from '../lib/comment-validation';
import { sanitizeText } from '../lib/sanitize';
import { COMMENT_RULES } from '../types/comment';
import type { CommentFormProps } from '../types/comment';

export const CommentForm = memo(function CommentForm({
  proposalId,
  parentId = null,
  onSubmitted,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const connected = useWalletConnected();
  const address = useWalletAddress();
  const addComment = useAddComment();
  const userCount = useUserCommentCount(proposalId, address ?? '');

  const trimmedLength = content.trim().length;
  const remaining = COMMENT_RULES.maxLength - trimmedLength;
  const isOverLimit = remaining < 0;
  const isUnderMin = trimmedLength > 0 && trimmedLength < COMMENT_RULES.minLength;

  // Focus textarea when replying
  useEffect(() => {
    if (parentId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [parentId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
    // Escape to cancel (only for reply forms)
    if (e.key === 'Escape' && onCancel) {
      e.preventDefault();
      onCancel();
    }
  }, [onCancel]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setError('Connect your wallet to comment.');
      return;
    }

    const contentErrors = validateCommentContent(content);
    if (contentErrors.length > 0) {
      setError(contentErrors[0].message);
      return;
    }

    const limitErrors = validateUserCommentLimit(userCount);
    if (limitErrors.length > 0) {
      setError(limitErrors[0].message);
      return;
    }

    setSubmitting(true);
    setError(null);

    const sanitized = sanitizeText(content.trim());
    const result = addComment({
      proposalId,
      author: address,
      content: sanitized,
      parentId,
    });

    if (result) {
      setContent('');
      onSubmitted?.();
    } else {
      setError('Could not add comment. You may have reached the comment limit or reply depth.');
    }

    setSubmitting(false);
  }, [content, address, proposalId, parentId, addComment, userCount, onSubmitted]);

  if (!connected) {
    return (
      <div
        className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center"
        role="status"
      >
        <p className="text-sm text-muted">
          Connect your wallet to join the discussion.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label={parentId ? 'Reply form' : 'Comment form'}>
      <div className="relative">
        <label htmlFor={`comment-input-${parentId ?? 'root'}`} className="sr-only">
          {parentId ? 'Write a reply' : 'Write a comment'}
        </label>
        <textarea
          ref={textareaRef}
          id={`comment-input-${parentId ?? 'root'}`}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={parentId ? 'Write a reply...' : 'Share your thoughts on this proposal...'}
          rows={parentId ? 3 : 4}
          maxLength={COMMENT_RULES.maxLength + 50}
          disabled={submitting}
          aria-invalid={!!error || isOverLimit}
          aria-describedby={`comment-hint-${parentId ?? 'root'}`}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none transition-colors resize-none min-h-[44px] ${
            error || isOverLimit
              ? 'border-red/50 focus:border-red/70'
              : 'border-border focus:border-green/40'
          }`}
        />

        {/* Character count */}
        <div
          id={`comment-hint-${parentId ?? 'root'}`}
          className="flex items-center justify-between mt-1 px-1"
        >
          <span className="text-xs text-muted">
            {isUnderMin && `Minimum ${COMMENT_RULES.minLength} characters`}
          </span>
          <span
            className={`text-xs tabular-nums ${
              isOverLimit ? 'text-red font-semibold' : remaining <= 100 ? 'text-amber' : 'text-muted'
            }`}
          >
            {trimmedLength}/{COMMENT_RULES.maxLength}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-muted hover:text-text transition-colors rounded-lg min-h-[36px]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || trimmedLength === 0 || isOverLimit || isUnderMin}
          className="px-5 py-2 rounded-lg bg-green text-dark text-xs font-semibold transition-all hover:bg-green-dim disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 min-h-[36px]"
        >
          {submitting ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
});

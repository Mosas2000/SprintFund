/**
 * Reusable error/empty state component with optional retry button.
 *
 * Supports two visual variants:
 * - "error" (default): red accent for failures
 * - "empty": neutral/muted accent for empty data sets
 */

import { memo } from 'react';
import { ErrorIcon } from './ErrorIcon';

type ErrorStateVariant = 'error' | 'empty';

interface ErrorStateProps {
  /** Visual variant. Defaults to "error". */
  variant?: ErrorStateVariant;
  /** Short headline shown above the message. */
  title?: string;
  /** Descriptive error message. */
  message: string;
  /** Callback invoked when the user clicks the action button. */
  onRetry?: () => void;
  /** Label for the action button. Defaults to "Try again". */
  retryLabel?: string;
  /** Number of retry attempts so far. Shows a count when > 0. */
  retryCount?: number;
  /** Optional test-id for automated testing. */
  testId?: string;
}

const VARIANT_STYLES: Record<ErrorStateVariant, { container: string; icon: string; heading: string; button: string }> = {
  error: {
    container: 'border-red/20 bg-red/5',
    icon: 'text-red/60',
    heading: 'text-red',
    button: 'border-red/30 text-red hover:bg-red/10',
  },
  empty: {
    container: 'border-border bg-card',
    icon: 'text-muted/60',
    heading: 'text-text',
    button: 'border-border text-muted hover:text-text hover:bg-white/5',
  },
};

export const ErrorState = memo(function ErrorState({
  variant = 'error',
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  retryCount = 0,
  testId,
}: ErrorStateProps) {
  const styles = VARIANT_STYLES[variant];
  const regionLabel = variant === 'error' ? 'Error notification' : 'Information';

  return (
    <div
      role="alert"
      aria-label={regionLabel}
      data-testid={testId}
      className={`mx-auto max-w-md rounded-xl border p-6 text-center ${styles.container}`}
    >
      <ErrorIcon size={40} className={`mx-auto mb-3 ${styles.icon}`} />
      <h2 className={`mb-2 text-base font-semibold ${styles.heading}`}>{title}</h2>
      <p className="mb-4 text-sm text-muted leading-relaxed">{message}</p>
      {onRetry && (
        <div className="space-y-1.5">
          <button
            onClick={onRetry}
            aria-label={retryCount > 0 ? `${retryLabel} (attempt ${retryCount} failed)` : retryLabel}
            className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors active:scale-95 ${styles.button}`}
          >
            {retryLabel}
          </button>
          {retryCount > 0 && (
            <p className="text-xs text-muted" aria-live="polite">
              Attempt {retryCount} failed
            </p>
          )}
        </div>
      )}
    </div>
  );
});

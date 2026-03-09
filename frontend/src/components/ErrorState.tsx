/**
 * Reusable error state component with retry button.
 *
 * Displays a user-friendly error message inside a styled container
 * and an optional retry button to re-attempt the failed operation.
 */

interface ErrorStateProps {
  /** Short headline shown above the message. Defaults to "Something went wrong". */
  title?: string;
  /** Descriptive error message. */
  message: string;
  /** Callback invoked when the user clicks Retry. Omit to hide retry button. */
  onRetry?: () => void;
  /** Label for the retry button. Defaults to "Try again". */
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-md rounded-xl border border-red/20 bg-red/5 p-6 text-center"
    >
      <h2 className="mb-2 text-base font-semibold text-red">{title}</h2>
      <p className="mb-4 text-sm text-muted leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-red/30 px-5 py-2 text-sm font-medium text-red transition-colors hover:bg-red/10 active:scale-95"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

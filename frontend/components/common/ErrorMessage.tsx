import React, { useState, useMemo } from 'react';
import { normalizeError } from '../../src/lib/error-normalizer';

interface ErrorMessageProps {
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const normalized = useMemo(() => (error ? normalizeError(error) : null), [error]);

  if (!normalized) return null;

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry?.();
    } finally {
      setIsRetrying(false);
    }
  };

  const severityStyles = {
    low: 'bg-blue-50 border-blue-200 text-blue-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    high: 'bg-red-50 border-red-200 text-red-900',
    critical: 'bg-red-100 border-red-300 text-red-950 font-bold',
  };

  const styles = severityStyles[normalized.severity] || severityStyles.medium;

  return (
    <div
      role="alert"
      className={`p-4 border rounded-lg ${styles} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">
            {normalized.severity === 'critical' ? 'Critical Error' : 'Error'}
          </h3>
          <p className="text-sm opacity-90">{normalized.message}</p>
          {normalized.suggestion && (
            <p className="text-xs mt-2 font-medium opacity-80">
              Tip: {normalized.suggestion}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        {normalized.retryable && onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-3 py-1 text-sm bg-black/10 hover:bg-black/20 rounded transition-colors disabled:opacity-50"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>
    </div>
  );
};

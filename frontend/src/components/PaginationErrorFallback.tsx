import React from 'react';

interface PaginationErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export const PaginationErrorFallback: React.FC<PaginationErrorProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-indigo-900 mb-1">
            Pagination Error
          </h3>
          <p className="text-sm text-indigo-700 mb-3">
            Could not load the requested page.
          </p>
          {error && (
            <details className="text-xs text-indigo-600 mb-3">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-1 p-2 bg-indigo-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface AnalyticsErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export const AnalyticsErrorFallback: React.FC<AnalyticsErrorProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 my-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Analytics Data Unavailable
          </h3>
          <p className="text-blue-800 mb-4">
            The analytics dashboard encountered an error while loading data. Your proposals and transactions are still safe.
          </p>
          {error && (
            <details className="text-sm text-blue-700 mb-4">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 p-2 bg-blue-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Reload Analytics
              </button>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 transition-colors font-medium"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

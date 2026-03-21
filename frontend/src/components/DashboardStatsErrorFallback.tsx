import React from 'react';

interface DashboardStatsErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export const DashboardStatsErrorFallback: React.FC<DashboardStatsErrorProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 my-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Dashboard Stats Unavailable
          </h3>
          <p className="text-purple-800 mb-4">
            Could not load dashboard statistics. You can still access other features.
          </p>
          {error && (
            <details className="text-sm text-purple-700 mb-4">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 p-2 bg-purple-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors font-medium"
              >
                Retry Loading
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

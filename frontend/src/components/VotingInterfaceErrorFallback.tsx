import React from 'react';

interface VotingInterfaceErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export const VotingInterfaceErrorFallback: React.FC<VotingInterfaceErrorProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 my-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            Voting Interface Unavailable
          </h3>
          <p className="text-orange-800 mb-4">
            The voting interface encountered an error. You can still view proposal details.
          </p>
          {error && (
            <details className="text-sm text-orange-700 mb-4">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 p-2 bg-orange-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface ProposalListErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export const ProposalListError: React.FC<ProposalListErrorProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 my-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Unable to Load Proposals
          </h3>
          <p className="text-amber-800 mb-4">
            The proposals list encountered an error while loading. Please try again.
          </p>
          {error && (
            <details className="text-sm text-amber-700 mb-4">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 p-2 bg-amber-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-amber-100 text-amber-900 rounded hover:bg-amber-200 transition-colors font-medium"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface TransactionHistoryErrorProps {
  error?: Error;
  onRetry?: () => void;
}

export const TransactionHistoryErrorFallback: React.FC<TransactionHistoryErrorProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-8 my-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-cyan-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-cyan-900 mb-2">
            Transaction History Unavailable
          </h3>
          <p className="text-cyan-800 mb-4">
            Could not load transaction history. Your transactions are still recorded on the blockchain.
          </p>
          {error && (
            <details className="text-sm text-cyan-700 mb-4">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 p-2 bg-cyan-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors font-medium"
              >
                Reload History
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

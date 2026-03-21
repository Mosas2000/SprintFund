'use client';

import { AlertCircle } from 'lucide-react';

interface ProposalDetailErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ProposalDetailError({ message, onRetry }: ProposalDetailErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />

          <div className="flex-1">
            <h2 className="text-lg font-bold text-red-400 mb-2">Error Loading Proposal</h2>

            <p className="text-sm text-red-400/80 mb-4">
              {message || 'We encountered an error while loading this proposal. Please try again.'}
            </p>

            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Proposal List with Error Handling
 * 
 * Demonstrates paginated data fetching with error handling using
 * the useAsyncError hook. Shows patterns for:
 * - Paginated data loading
 * - Error recovery with retry functionality
 * - Empty state handling
 * - Loading state management
 */
import React, { useEffect, useState } from 'react';
import { getAllProposals, getProposalsPage } from '../../src/lib/stacks';
import { useAsyncError } from '../../src/hooks/useAsyncError';
import { ErrorMessage } from '../common/ErrorMessage';
import { AsyncError } from '../../src/lib/async-errors';
import type { Proposal, ProposalPage } from '../../src/types';

interface ProposalListErrorProps {
  error: AsyncError | null;
  onRetry: () => Promise<void>;
  onDismiss: () => void;
}

const ProposalListErrorDisplay: React.FC<ProposalListErrorProps> = ({
  error,
  onRetry,
  onDismiss,
}) => (
  <div className="mb-4">
    <ErrorMessage error={error} onRetry={onRetry} onDismiss={onDismiss} />
  </div>
);

interface ProposalListProps {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of proposals per page */
  pageSize?: number;
}

/**
 * Proposal list component with pagination and error handling.
 * Demonstrates loading, error, empty, and success states.
 */
export const ProposalListWithErrorHandling: React.FC<ProposalListProps> = ({
  page = 1,
  pageSize = 10,
}) => {
  const { error, isLoading, execute, retry, clearError } = useAsyncError();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pageInfo, setPageInfo] = useState<ProposalPage | null>(null);

  /** Load proposals for current page */
  const loadProposals = async () => {
    try {
      const pageData = await execute(async () =>
        getProposalsPage({ page, pageSize }),
      );

      if (pageData) {
        setPageInfo(pageData);
        setProposals(pageData.proposals);
      }
    } catch {
      // Errors are handled by useAsyncError
      setProposals([]);
      setPageInfo(null);
    }
  };

  // Reload when page or pageSize changes
  useEffect(() => {
    loadProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  /** Retry loading proposals after error */
  const handleRetry = async () => {
    clearError();
    await retry(async () => {
      const pageData = await getProposalsPage({ page, pageSize });
      setPageInfo(pageData);
      setProposals(pageData.proposals);
      return pageData;
    });
  };

  return (
    <div>
      {/* Error State: Display error with retry option */}
      {error && (
        <ProposalListErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={clearError}
        />
      )}

      {/* Loading State: Show when no cached proposals available */}
      {isLoading && !proposals.length && (
        <div className="text-center py-8">Loading proposals...</div>
      )}

      {/* Empty State: Show when no proposals found and not loading */}
      {!isLoading && proposals.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">No proposals found</div>
      )}

      {/* Success State: Display proposals list */}
      {proposals.length > 0 && (
        <div>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <h3 className="font-semibold">{proposal.title}</h3>
                <p className="text-sm text-gray-600">{proposal.description}</p>
              </div>
            ))}
          </div>

          {pageInfo && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Page {pageInfo.page} of {pageInfo.totalPages}
              </span>
              <span className="text-sm text-gray-600">
                Total: {pageInfo.totalCount} proposals
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

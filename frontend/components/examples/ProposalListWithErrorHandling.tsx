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
  page?: number;
  pageSize?: number;
}

export const ProposalListWithErrorHandling: React.FC<ProposalListProps> = ({
  page = 1,
  pageSize = 10,
}) => {
  const { error, isLoading, execute, retry, clearError } = useAsyncError();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pageInfo, setPageInfo] = useState<ProposalPage | null>(null);

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
      setProposals([]);
      setPageInfo(null);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [page, pageSize]);

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
      {error && (
        <ProposalListErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={clearError}
        />
      )}

      {isLoading && !proposals.length && (
        <div className="text-center py-8">Loading proposals...</div>
      )}

      {!isLoading && proposals.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">No proposals found</div>
      )}

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

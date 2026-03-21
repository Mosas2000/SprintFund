import React, { useState, useCallback } from 'react';
import { useProposalPagination } from '@/hooks/useProposalPagination';
import { useProposalFilters } from '@/hooks/useProposalFilters';
import { PaginationToolbar } from './PaginationToolbar';
import { ProposalListSkeleton } from './ProposalListSkeleton';

interface PaginatedProposalListProps {
  onProposalSelect?: (proposalId: string) => void;
  className?: string;
}

export const PaginatedProposalList: React.FC<PaginatedProposalListProps> = ({
  onProposalSelect,
  className = '',
}) => {
  const { filters, sort, updateFilter, updateSort, clearFilters } = useProposalFilters();
  const {
    proposals,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
    refetch,
  } = useProposalPagination({
    filters,
    sort,
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      setPageSize(newSize);
      setPage(1);
    },
    [setPageSize, setPage]
  );

  const handleStatusFilterChange = (status: string) => {
    updateFilter('status', status);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilterChange('approved')}
              className={`px-3 py-1 rounded text-sm ${
                filters.status === 'approved'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => handleStatusFilterChange('pending')}
              className={`px-3 py-1 rounded text-sm ${
                filters.status === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilterChange('rejected')}
              className={`px-3 py-1 rounded text-sm ${
                filters.status === 'rejected'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
            {filters.status && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && <ProposalListSkeleton count={pageSize} />}

      {!loading && proposals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No proposals found
        </div>
      )}

      {!loading && proposals.length > 0 && (
        <>
          <div className="space-y-3">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProposalSelect?.(proposal.id)}
              >
                <h3 className="font-semibold text-lg mb-2">{proposal.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{proposal.description}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      proposal.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : proposal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {proposal.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {proposal.votes?.length || 0} votes
                  </span>
                </div>
              </div>
            ))}
          </div>

          <PaginationToolbar
            currentPage={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

import React, { useCallback } from 'react';
import { usePaginationState } from '@/hooks/usePaginationState';

interface PaginationToolbarProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
}

export const PaginationToolbar: React.FC<PaginationToolbarProps> = ({
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  pageSizeOptions = [10, 15, 20, 25, 50],
  onPageChange,
  onPageSizeChange,
  loading = false,
}) => {
  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = parseInt(e.target.value);
      onPageSizeChange?.(newSize);
    },
    [onPageSizeChange]
  );

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={loading}
          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={loading || currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={loading || currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

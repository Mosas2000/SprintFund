import React, { useCallback } from 'react';

interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showButtons?: boolean;
  maxVisibleButtons?: number;
  disabled?: boolean;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showButtons = true,
  maxVisibleButtons = 5,
  disabled = false,
}) => {
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const halfWindow = Math.floor(maxVisibleButtons / 2);

    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(totalPages, start + maxVisibleButtons - 1);

    if (end - start + 1 < maxVisibleButtons) {
      start = Math.max(1, end - maxVisibleButtons + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisibleButtons]);

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={disabled || currentPage === 1}
        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        aria-label="Previous page"
      >
        Prev
      </button>

      {showButtons && (
        <div className="flex gap-1">
          {pageNumbers.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                disabled={disabled}
                className={`px-2 py-1 border rounded text-sm ${
                  page === currentPage
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:bg-gray-100'
                } disabled:opacity-50`}
                aria-current={page === currentPage}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={disabled || currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

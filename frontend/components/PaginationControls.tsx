'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationService } from '@/services/pagination';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  maxVisiblePages?: number;
}

export function PaginationControls({
  page,
  pageSize,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
  maxVisiblePages = 5,
}: PaginationControlsProps) {
  if (total === 0) {
    return null;
  }

  const pageRange = PaginationService.getPageRange(page, totalPages, maxVisiblePages);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
      <div className="flex flex-col gap-4 py-4 border-t border-white/10" aria-label="Pagination Navigation">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60" aria-live="polite">
          Showing {startItem} to {endItem} of {total} results
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-white/60">
            <span className="sr-only">Select items per page</span>
            Items per page:
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="ml-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
            >
              {[10, 15, 20, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <nav aria-label="Pagination Controls" className="flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/60 rounded transition-colors"
          title="First page"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/60 rounded transition-colors"
          title="Previous page"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          {pageRange.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Go to page ${p}`}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/60 rounded transition-colors"
          title="Next page"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/60 rounded transition-colors"
          title="Last page"
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>

      <div className="text-center text-xs text-white/40">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}

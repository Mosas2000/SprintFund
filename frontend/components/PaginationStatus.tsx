import React from 'react';

interface PaginationStatusProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  showItemRange?: boolean;
  compact?: boolean;
}

export const PaginationStatus: React.FC<PaginationStatusProps> = ({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  showItemRange = true,
  compact = false,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (compact) {
    return (
      <div className="text-xs text-gray-500">
        Page {currentPage} of {totalPages} ({totalItems} total)
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 text-sm text-gray-600">
      {showItemRange && (
        <div>
          Showing items {startItem} to {endItem} of {totalItems}
        </div>
      )}
      <div>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

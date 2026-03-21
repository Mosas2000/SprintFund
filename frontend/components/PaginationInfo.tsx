'use client';

interface PaginationInfoProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function PaginationInfo({
  page,
  pageSize,
  total,
  totalPages,
}: PaginationInfoProps) {
  if (total === 0) {
    return (
      <div className="text-sm text-white/60">
        No items to display
      </div>
    );
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between text-sm text-white/60">
      <div>
        Showing <span className="font-medium text-white">{startItem}</span> to{' '}
        <span className="font-medium text-white">{endItem}</span> of{' '}
        <span className="font-medium text-white">{total}</span> results
      </div>
      <div>
        Page <span className="font-medium text-white">{page}</span> of{' '}
        <span className="font-medium text-white">{totalPages}</span>
      </div>
    </div>
  );
}

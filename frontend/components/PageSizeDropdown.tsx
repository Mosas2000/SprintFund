'use client';

import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface PageSizeDropdownProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function PageSizeDropdown({
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 15, 20, 25, 50],
}: PageSizeDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-white/60">Items per page:</label>
      <div className="relative">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="appearance-none px-3 py-2 pr-8 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} items
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
      </div>
    </div>
  );
}

import React, { useCallback } from 'react';

interface SortOption {
  label: string;
  value: string;
}

interface ProposalSortbarProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortOptions?: SortOption[];
  loading?: boolean;
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: 'Date Created', value: 'createdAt' },
  { label: 'Ending Soon', value: 'endingSoon' },
  { label: 'Title', value: 'title' },
  { label: 'Funding Requested', value: 'requestedAmount' },
  { label: 'Vote Count', value: 'votes' },
];

export const ProposalSortbar: React.FC<ProposalSortbarProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  loading = false,
}) => {
  const handleSortByChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value, sortOrder);
    },
    [sortOrder, onSortChange]
  );

  const handleSortOrderChange = useCallback(() => {
    const newOrder: 'asc' | 'desc' = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  }, [sortBy, sortOrder, onSortChange]);

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={handleSortByChange}
        disabled={loading}
        className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSortOrderChange}
        disabled={loading}
        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
        title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
      >
        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
      </button>
    </div>
  );
};

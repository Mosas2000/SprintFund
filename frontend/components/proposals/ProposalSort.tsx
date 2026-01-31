import React from 'react';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'votes-desc' | 'votes-asc';

interface ProposalSortProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export default function ProposalSort({ currentSort, onSortChange }: ProposalSortProps) {
    const sortOptions: { value: SortOption; label: string; icon: string }[] = [
        { value: 'date-desc', label: 'Newest First', icon: '📅↓' },
        { value: 'date-asc', label: 'Oldest First', icon: '📅↑' },
        { value: 'amount-desc', label: 'Highest Amount', icon: '💰↓' },
        { value: 'amount-asc', label: 'Lowest Amount', icon: '💰↑' },
        { value: 'votes-desc', label: 'Most Votes', icon: '🗳️↓' },
        { value: 'votes-asc', label: 'Least Votes', icon: '🗳️↑' },
    ];

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
            </label>
            <select
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

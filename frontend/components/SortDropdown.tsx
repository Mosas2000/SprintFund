'use client';

import { useState, useRef, useEffect } from 'react';
import type { SortOption } from '../src/lib/proposal-params';

interface SortDropdownProps {
    onSortChange: (sort: SortOption) => void;
    sort?: SortOption;
}

export default function SortDropdown({ onSortChange, sort }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalSort, setInternalSort] = useState<SortOption>('newest');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedSort = sort ?? internalSort;

    const sortOptions = [
        { value: 'newest' as const, label: 'Newest First' },
        { value: 'oldest' as const, label: 'Oldest First' },
        { value: 'ending-soon' as const, label: 'Ending Soon' },
        { value: 'highest' as const, label: 'Highest Amount' },
        { value: 'lowest' as const, label: 'Lowest Amount' },
        { value: 'most-votes' as const, label: 'Most Votes' },
    ];

    const sortDescriptions: Record<SortOption, string> = {
        'newest': 'Most recently created proposals first',
        'oldest': 'Earliest created proposals first',
        'ending-soon': 'Active proposals closest to their deadline',
        'highest': 'Largest funding requests first',
        'lowest': 'Smallest funding requests first',
        'most-votes': 'Proposals with the most total votes',
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSortSelect = (s: SortOption) => {
        if (sort === undefined) setInternalSort(s);
        onSortChange(s);
        setIsOpen(false);
    };

    const selectedLabel = sortOptions.find(s => s.value === selectedSort)?.label || 'Newest First';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white shadow-md transition-all hover:bg-white/20 sm:w-auto sm:justify-start sm:py-2"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="text-sm font-medium">{selectedLabel}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-lg border border-white/20 bg-gray-800 shadow-md sm:left-auto sm:right-0 sm:w-48">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSortSelect(option.value)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedSort === option.value
                                    ? 'bg-purple-500/20 text-purple-200 font-semibold'
                                    : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

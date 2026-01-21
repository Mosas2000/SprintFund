'use client';

import { useState, useRef, useEffect } from 'react';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-votes';

interface SortDropdownProps {
    onSortChange: (sort: SortOption) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { value: 'newest' as const, label: 'Newest First' },
        { value: 'oldest' as const, label: 'Oldest First' },
        { value: 'highest' as const, label: 'Highest Amount' },
        { value: 'lowest' as const, label: 'Lowest Amount' },
        { value: 'most-votes' as const, label: 'Most Votes' },
    ];

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

    const handleSortSelect = (sort: SortOption) => {
        setSelectedSort(sort);
        onSortChange(sort);
        setIsOpen(false);
    };

    const selectedLabel = sortOptions.find(s => s.value === selectedSort)?.label || 'Newest First';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all shadow-md"
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
                <div className="absolute top-full mt-2 w-48 bg-gray-800 border border-white/20 rounded-lg shadow-md overflow-hidden z-10">
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

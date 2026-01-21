'use client';

import { useState, useRef, useEffect } from 'react';

interface FilterDropdownProps {
    onFilterChange: (filter: 'all' | 'active' | 'executed') => void;
}

export default function FilterDropdown({ onFilterChange }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'executed'>('all');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filters = [
        { value: 'all' as const, label: 'All Proposals' },
        { value: 'active' as const, label: 'Active' },
        { value: 'executed' as const, label: 'Executed' },
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

    const handleFilterSelect = (filter: 'all' | 'active' | 'executed') => {
        setSelectedFilter(filter);
        onFilterChange(filter);
        setIsOpen(false);
    };

    const selectedLabel = filters.find(f => f.value === selectedFilter)?.label || 'All Proposals';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all shadow-md"
            >
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
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleFilterSelect(filter.value)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedFilter === filter.value
                                    ? 'bg-purple-500/20 text-purple-200 font-semibold'
                                    : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

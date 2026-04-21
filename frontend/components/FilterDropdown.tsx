'use client';

import { useState, useRef, useEffect } from 'react';

export type StatusFilter = 'all' | 'active' | 'executed';
export type CategoryFilter = 'all' | 'development' | 'design' | 'marketing' | 'community' | 'research' | 'other';

interface FilterDropdownProps {
    onFilterChange: (statusFilter: StatusFilter, categoryFilter: CategoryFilter) => void;
    status?: StatusFilter;
    category?: CategoryFilter;
}

export default function FilterDropdown({ onFilterChange, status, category }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalStatus, setInternalStatus] = useState<StatusFilter>('all');
    const [internalCategory, setInternalCategory] = useState<CategoryFilter>('all');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedStatus = status ?? internalStatus;
    const selectedCategory = category ?? internalCategory;

    const statusFilters = [
        { value: 'all' as const, label: 'All Proposals' },
        { value: 'active' as const, label: 'Active' },
        { value: 'executed' as const, label: 'Executed' },
    ];

    const categoryFilters = [
        { value: 'all' as const, label: 'All Categories' },
        { value: 'development' as const, label: 'Development' },
        { value: 'design' as const, label: 'Design' },
        { value: 'marketing' as const, label: 'Marketing' },
        { value: 'community' as const, label: 'Community' },
        { value: 'research' as const, label: 'Research' },
        { value: 'other' as const, label: 'Other' },
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

    const handleStatusSelect = (s: StatusFilter) => {
        if (status === undefined) setInternalStatus(s);
        onFilterChange(s, selectedCategory);
    };

    const handleCategorySelect = (c: CategoryFilter) => {
        if (category === undefined) setInternalCategory(c);
        onFilterChange(selectedStatus, c);
    };

    const getButtonLabel = () => {
        const parts = [];
        if (selectedStatus !== 'all') {
            parts.push(statusFilters.find(f => f.value === selectedStatus)?.label);
        }
        if (selectedCategory !== 'all') {
            parts.push(categoryFilters.find(f => f.value === selectedCategory)?.label);
        }
        return parts.length > 0 ? parts.join(' • ') : 'All Filters';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white shadow-md transition-all hover:bg-white/20 sm:w-auto sm:justify-start sm:py-2"
            >
                <span className="text-sm font-medium">{getButtonLabel()}</span>
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
                <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-lg border border-white/20 bg-gray-800 shadow-md sm:left-auto sm:right-0 sm:w-56">
                    {/* Status Filter Section */}
                    <div className="border-b border-white/10">
                        <div className="px-4 py-2 bg-white/5">
                            <p className="text-xs font-semibold text-slate-400 uppercase">Filter by Status</p>
                        </div>
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => handleStatusSelect(filter.value)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedStatus === filter.value
                                        ? 'bg-orange-600 text-white font-semibold'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Category Filter Section */}
                    <div>
                        <div className="px-4 py-2 bg-white/5">
                            <p className="text-xs font-semibold text-slate-400 uppercase">Filter by Category</p>
                        </div>
                        {categoryFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => handleCategorySelect(filter.value)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === filter.value
                                        ? 'bg-orange-600 text-white font-semibold'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { SortOption } from '../src/lib/proposal-params';

interface SortDropdownProps {
    onSortChange: (sort: SortOption) => void;
    sort?: SortOption;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'ending-soon', label: 'Ending Soon' },
    { value: 'highest', label: 'Highest Amount' },
    { value: 'lowest', label: 'Lowest Amount' },
    { value: 'most-votes', label: 'Most Votes' },
];

const SORT_DESCRIPTIONS: Record<SortOption, string> = {
    newest: 'Most recently created proposals first',
    oldest: 'Earliest created proposals first',
    'ending-soon': 'Active proposals closest to their deadline',
    highest: 'Largest funding requests first',
    lowest: 'Smallest funding requests first',
    'most-votes': 'Proposals with the most total votes',
};

export default function SortDropdown({ onSortChange, sort }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalSort, setInternalSort] = useState<SortOption>('newest');
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedSort = sort ?? internalSort;
    const initialActiveIndex = SORT_OPTIONS.findIndex(o => o.value === selectedSort);

    const close = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(initialActiveIndex >= 0 ? initialActiveIndex : 0);
    }, [initialActiveIndex]);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(initialActiveIndex >= 0 ? initialActiveIndex : 0);
        }
    }, [isOpen, initialActiveIndex]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [close]);

    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
                triggerRef.current?.focus();
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex(prev => (prev < SORT_OPTIONS.length - 1 ? prev + 1 : 0));
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : SORT_OPTIONS.length - 1));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                setActiveIndex(prev => {
                    const opt = SORT_OPTIONS[prev];
                    if (opt) {
                        if (sort === undefined) setInternalSort(opt.value);
                        onSortChange(opt.value);
                        close();
                        triggerRef.current?.focus();
                    }
                    return prev;
                });
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, close, onSortChange, sort]);

    const handleSortSelect = (s: SortOption) => {
        if (sort === undefined) setInternalSort(s);
        onSortChange(s);
        close();
    };

    const selectedLabel = SORT_OPTIONS.find(s => s.value === selectedSort)?.label ?? 'Newest First';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? 'sort-options-list' : undefined}
                aria-activedescendant={isOpen && activeIndex >= 0 ? `sort-option-${SORT_OPTIONS[activeIndex].value}` : undefined}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white shadow-md transition-all hover:bg-white/20 sm:w-auto sm:justify-start sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
                <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="text-sm font-medium">{selectedLabel}</span>
                <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {selectedSort !== 'newest' && (
                <p className="mt-1 text-xs text-purple-300/70" aria-live="polite" role="status">
                    {SORT_DESCRIPTIONS[selectedSort]}
                </p>
            )}

            {isOpen && (
                <ul
                    id="sort-options-list"
                    role="listbox"
                    aria-label="Sort proposals by"
                    className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-lg border border-white/20 bg-gray-800 shadow-md sm:left-auto sm:right-0 sm:w-52"
                >
                    {SORT_OPTIONS.map((option, index) => {
                        const isSelected = selectedSort === option.value;
                        const isActive = activeIndex === index;
                        
                        return (
                            <li 
                                key={option.value} 
                                id={`sort-option-${option.value}`}
                                role="option" 
                                aria-selected={isSelected}
                            >
                                <button
                                    onClick={() => handleSortSelect(option.value)}
                                    tabIndex={-1}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                        isActive ? 'bg-white/10' : ''
                                    } ${
                                        isSelected
                                            ? 'text-purple-200 font-semibold'
                                            : 'text-white'
                                    }`}
                                >
                                    <span className="block">{option.label}</span>
                                    <span className={`block text-xs mt-0.5 ${isSelected ? 'text-purple-300/80' : 'text-purple-300/60'}`}>
                                        {SORT_DESCRIPTIONS[option.value]}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

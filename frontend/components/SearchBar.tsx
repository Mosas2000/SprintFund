'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
    onSearchChange: (searchTerm: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const callbackRef = useRef(onSearchChange);

    // Keep the ref in sync with the latest callback without triggering effects
    useEffect(() => {
        callbackRef.current = onSearchChange;
    }, [onSearchChange]);

    // Debounce search - wait 300ms after user stops typing
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            callbackRef.current(searchTerm);
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm]);

    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className="w-5 h-5 text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search proposals by title or description..."
                className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />

            {/* Clear Button */}
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    aria-label="Clear search"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

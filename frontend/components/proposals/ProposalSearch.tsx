import React, { useState } from 'react';

interface ProposalSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function ProposalSearch({ onSearch, placeholder = 'Search proposals...' }: ProposalSearchProps) {
    const [query, setQuery] = useState('');

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch(value);
    };

    const clearSearch = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search hint */}
            {query && (
                <div className="absolute left-0 right-0 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Searching for "{query}"
                </div>
            )}
        </div>
    );
}

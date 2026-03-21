'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { DiscussionComment } from './DiscussionComment';

interface DiscussionSearchProps {
  comments: any[];
  onFilter: (filtered: any[]) => void;
}

export function DiscussionSearch({ comments, onFilter }: DiscussionSearchProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      onFilter(comments);
      return;
    }

    const lowerQuery = value.toLowerCase();
    const filtered = comments.filter((c) =>
      c.content.toLowerCase().includes(lowerQuery) ||
      c.authorName?.toLowerCase().includes(lowerQuery) ||
      c.authorAddress.toLowerCase().includes(lowerQuery)
    );

    onFilter(filtered);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search comments..."
          className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>
        )}
      </div>

      {query && (
        <p className="mt-2 text-xs text-white/40">
          Found {comments.length} matching comment
          {comments.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

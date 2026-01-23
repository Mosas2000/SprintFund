'use client';

import { useState, useEffect } from 'react';

interface Vote {
  proposalId: string;
  proposalTitle: string;
  voteDirection: 'YES' | 'NO';
  weight: number;
  cost: number;
  timestamp: number;
  category?: string;
}

interface VoteHistoryProps {
  userAddress?: string;
}

export default function VoteHistory({ userAddress }: VoteHistoryProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [dateRange, setDateRange] = useState('all');
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    loadVoteHistory();
  }, [userAddress]);

  const loadVoteHistory = () => {
    if (!userAddress) return;

    // Load votes from localStorage
    const storedVotes = localStorage.getItem(`vote-history-${userAddress}`);
    if (storedVotes) {
      const parsedVotes: Vote[] = JSON.parse(storedVotes);
      setVotes(parsedVotes);
      
      // Calculate total spent
      const total = parsedVotes.reduce((sum, vote) => sum + vote.cost, 0);
      setTotalSpent(total);

      // Calculate category stats
      const stats: Record<string, number> = {};
      parsedVotes.forEach(vote => {
        const category = vote.category || 'General';
        stats[category] = (stats[category] || 0) + 1;
      });
      setCategoryStats(stats);
    }
  };

  const filterVotes = () => {
    let filtered = votes;

    // Filter by vote direction
    if (filter !== 'ALL') {
      filtered = filtered.filter(vote => vote.voteDirection === filter);
    }

    // Filter by date range
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    switch(dateRange) {
      case '7days':
        filtered = filtered.filter(vote => now - vote.timestamp < 7 * dayMs);
        break;
      case '30days':
        filtered = filtered.filter(vote => now - vote.timestamp < 30 * dayMs);
        break;
      case '90days':
        filtered = filtered.filter(vote => now - vote.timestamp < 90 * dayMs);
        break;
    }

    return filtered;
  };

  const filteredVotes = filterVotes();

  const getMostActiveCategory = () => {
    if (Object.keys(categoryStats).length === 0) return 'N/A';
    return Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Vote History & Analytics
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-blue-600 dark:text-blue-400">Total Votes</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{votes.length}</div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-green-600 dark:text-green-400">Total STX Spent</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-200">{totalSpent}</div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-sm text-purple-600 dark:text-purple-400">Average Weight</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
            {votes.length > 0 ? (votes.reduce((sum, v) => sum + v.weight, 0) / votes.length).toFixed(1) : '0'}
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-sm text-orange-600 dark:text-orange-400">Top Category</div>
          <div className="text-lg font-bold text-orange-900 dark:text-orange-200">{getMostActiveCategory()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Vote Type
          </label>
          <div className="flex gap-2">
            {['ALL', 'YES', 'NO'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Vote List */}
      <div className="space-y-3">
        {filteredVotes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No votes found. Start voting on proposals!
          </div>
        ) : (
          filteredVotes.map((vote, index) => (
            <div
              key={index}
              className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {vote.proposalTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      📅 {new Date(vote.timestamp).toLocaleDateString()}
                    </span>
                    {vote.category && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {vote.category}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full font-semibold ${
                    vote.voteDirection === 'YES'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {vote.voteDirection}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Weight: {vote.weight} | Cost: {vote.cost} STX
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Voting Patterns */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="mt-8 pt-6 border-t dark:border-gray-700">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Voting Patterns by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryStats)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-700 dark:text-gray-300">{category}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full flex items-center justify-end pr-2"
                      style={{ width: `${(count / votes.length) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{count}</span>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                    {((count / votes.length) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

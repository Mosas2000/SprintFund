'use client';

import { useState, useEffect } from 'react';

interface VoteData {
  proposalId: number;
  proposalTitle: string;
  vote: 'yes' | 'no';
  weight: number;
  timestamp: number;
  category: string;
}

export default function VotingAnalyticsDashboard() {
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const stored = localStorage.getItem('voteHistory');
    if (stored) {
      setVotes(JSON.parse(stored));
    }
  }, []);

  const filterVotes = () => {
    let filtered = votes;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(v => v.category === filterCategory);
    }

    if (dateRange !== 'all') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      };
      filtered = filtered.filter(v => now - v.timestamp < ranges[dateRange]);
    }

    return filtered;
  };

  const filteredVotes = filterVotes();

  const stats = {
    totalVotes: filteredVotes.length,
    totalWeight: filteredVotes.reduce((sum, v) => sum + v.weight, 0),
    yesVotes: filteredVotes.filter(v => v.vote === 'yes').length,
    noVotes: filteredVotes.filter(v => v.vote === 'no').length,
    avgWeight: filteredVotes.length > 0 
      ? filteredVotes.reduce((sum, v) => sum + v.weight, 0) / filteredVotes.length 
      : 0
  };

  const categoryStats = filteredVotes.reduce((acc, vote) => {
    acc[vote.category] = (acc[vote.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const exportToCSV = () => {
    const headers = ['Proposal ID', 'Proposal Title', 'Vote', 'Weight', 'Timestamp', 'Category'];
    const rows = filteredVotes.map(v => [
      v.proposalId,
      v.proposalTitle,
      v.vote,
      v.weight,
      new Date(v.timestamp).toISOString(),
      v.category
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voting-analytics-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📊 Voting Analytics Dashboard</h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Community">Community</option>
          <option value="Development">Development</option>
          <option value="Marketing">Marketing</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Total Votes</div>
          <div className="text-3xl font-bold">{stats.totalVotes}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Total Weight</div>
          <div className="text-3xl font-bold">{stats.totalWeight.toFixed(0)}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Yes Votes</div>
          <div className="text-3xl font-bold">{stats.yesVotes}</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90 mb-1">No Votes</div>
          <div className="text-3xl font-bold">{stats.noVotes}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Avg Weight</div>
          <div className="text-3xl font-bold">{stats.avgWeight.toFixed(1)}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
        <div className="space-y-3">
          {topCategories.map(([category, count]) => {
            const percentage = (count / stats.totalVotes) * 100;
            return (
              <div key={category}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">{category}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {count} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vote Distribution Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-green-600">
                    Yes Votes
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {stats.totalVotes > 0 ? ((stats.yesVotes / stats.totalVotes) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${stats.totalVotes > 0 ? (stats.yesVotes / stats.totalVotes) * 100 : 0}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                />
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-red-600">
                    No Votes
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block text-red-600">
                    {stats.totalVotes > 0 ? ((stats.noVotes / stats.totalVotes) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${stats.totalVotes > 0 ? (stats.noVotes / stats.totalVotes) * 100 : 0}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {stats.totalVotes > 0 ? ((stats.yesVotes / stats.totalVotes) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</div>
          </div>
        </div>
      </div>

      {/* Recent Votes Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Recent Votes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-2">Proposal</th>
                <th className="text-left p-2">Vote</th>
                <th className="text-left p-2">Weight</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredVotes.slice(0, 10).map((vote, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-2">{vote.proposalTitle}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vote.vote === 'yes' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20'
                    }`}>
                      {vote.vote === 'yes' ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td className="p-2 font-medium">{vote.weight}</td>
                  <td className="p-2">{vote.category}</td>
                  <td className="p-2 text-gray-600 dark:text-gray-400">
                    {new Date(vote.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

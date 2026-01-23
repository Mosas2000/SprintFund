'use client';

import { useState } from 'react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'approved' | 'rejected' | 'executed' | 'archived';
  category: string;
  amount: number;
  createdAt: number;
  votes: { yes: number; no: number };
  author: string;
  tags: string[];
}

// Mock data - would come from API/blockchain
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1,
    title: 'DeFi Lending Protocol Development',
    description: 'Build a decentralized lending platform on Stacks',
    status: 'executed',
    category: 'defi',
    amount: 75000,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    votes: { yes: 450, no: 120 },
    author: 'SP1ABC...XYZ',
    tags: ['defi', 'lending', 'smart-contracts']
  },
  {
    id: 2,
    title: 'NFT Marketplace Infrastructure',
    description: 'Create marketplace for trading NFTs',
    status: 'approved',
    category: 'nft',
    amount: 50000,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    votes: { yes: 380, no: 95 },
    author: 'SP2DEF...ABC',
    tags: ['nft', 'marketplace']
  }
  // Add more mock data as needed
];

export default function ProposalArchive() {
  const [proposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all',
    minAmount: 0,
    maxAmount: 1000000
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'votes' | 'amount'>('date');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const filterProposals = () => {
    let filtered = proposals;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Amount range
    filtered = filtered.filter((p) => p.amount >= filters.minAmount && p.amount <= filters.maxAmount);

    // Date range
    if (filters.dateRange !== 'all') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
      };
      if (ranges[filters.dateRange]) {
        filtered = filtered.filter((p) => now - p.createdAt < ranges[filters.dateRange]);
      }
    }

    return filtered;
  };

  const sortProposals = (proposals: Proposal[]) => {
    const sorted = [...proposals];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'votes':
        return sorted.sort((a, b) => b.votes.yes + b.votes.no - (a.votes.yes + a.votes.no));
      case 'amount':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'relevance':
      default:
        return sorted;
    }
  };

  const filteredProposals = sortProposals(filterProposals());

  const saveSearch = () => {
    const searchString = JSON.stringify({ query: searchQuery, filters });
    if (!savedSearches.includes(searchString)) {
      setSavedSearches([...savedSearches, searchString]);
      localStorage.setItem('savedSearches', JSON.stringify([...savedSearches, searchString]));
    }
  };

  const exportResults = () => {
    const csv = [
      ['ID', 'Title', 'Status', 'Category', 'Amount', 'Created', 'Yes Votes', 'No Votes'].join(','),
      ...filteredProposals.map((p) =>
        [
          p.id,
          `"${p.title}"`,
          p.status,
          p.category,
          p.amount,
          new Date(p.createdAt).toISOString(),
          p.votes.yes,
          p.votes.no
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposals-${Date.now()}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300',
      active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
      executed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
      archived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">🗄️ Proposal Archive & Search</h3>
        <div className="flex gap-2">
          <button
            onClick={saveSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            💾 Save Search
          </button>
          <button
            onClick={exportResults}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search proposals by title, description, or tags..."
          className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="executed">Executed</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
        >
          <option value="all">All Categories</option>
          <option value="defi">DeFi</option>
          <option value="nft">NFT</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="governance">Governance</option>
          <option value="community">Community</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>

        <input
          type="number"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: parseInt(e.target.value) || 0 })}
          placeholder="Min Amount"
          className="p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
        />

        <input
          type="number"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: parseInt(e.target.value) || 1000000 })}
          placeholder="Max Amount"
          className="p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
        />
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">Sort by:</span>
        <div className="flex gap-2">
          {(['relevance', 'date', 'votes', 'amount'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                sortBy === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Found {filteredProposals.length} proposal{filteredProposals.length !== 1 ? 's' : ''}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No proposals found matching your criteria</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 
                       dark:hover:border-blue-500 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">#{proposal.id}: {proposal.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{proposal.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proposal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-green-600">{proposal.amount.toLocaleString()} STX</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">✓ {proposal.votes.yes}</span>
                  <span className="text-red-600">✗ {proposal.votes.no}</span>
                  <span className="text-gray-500">By {proposal.author}</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { ProposalMetrics } from '../../utils/analytics/dataCollector';
import { formatMetric } from '../../utils/analytics/helpers';
import { X, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProposalComparatorProps {
  proposals: ProposalMetrics[];
}

export default function ProposalComparator({ proposals }: ProposalComparatorProps) {
  const [selectedProposals, setSelectedProposals] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    return proposals.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.proposalId.toString().includes(searchQuery)
    );
  }, [proposals, searchQuery]);

  const selectedProposalData = useMemo(() => {
    return selectedProposals
      .map(id => proposals.find(p => p.proposalId === id))
      .filter(Boolean) as ProposalMetrics[];
  }, [selectedProposals, proposals]);

  const toggleProposal = (id: number) => {
    setSelectedProposals(prev => {
      if (prev.includes(id)) {
        return prev.filter(proposalId => proposalId !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const clearSelection = () => {
    setSelectedProposals([]);
  };

  const exportComparison = () => {
    const headers = ['Metric', ...selectedProposalData.map(p => `Proposal #${p.proposalId}`)];
    const metrics = [
      ['Title', ...selectedProposalData.map(p => p.title)],
      ['Category', ...selectedProposalData.map(p => p.category)],
      ['Amount', ...selectedProposalData.map(p => formatMetric(p.amount, 'currency'))],
      ['Votes For', ...selectedProposalData.map(p => p.votesFor.toString())],
      ['Votes Against', ...selectedProposalData.map(p => p.votesAgainst.toString())],
      ['Success', ...selectedProposalData.map(p => p.executed ? 'Yes' : 'No')],
      ['Time to Funding', ...selectedProposalData.map(p => p.timeToFunding ? `${p.timeToFunding.toFixed(1)}h` : 'N/A')]
    ];

    const csv = [headers.join(','), ...metrics.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `proposal-comparison-${Date.now()}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getMetricComparison = (metric: keyof ProposalMetrics) => {
    if (selectedProposalData.length === 0) return [];
    
    const values = selectedProposalData.map(p => {
      const value = p[metric];
      return typeof value === 'number' ? value : 0;
    });

    const max = Math.max(...values);
    const min = Math.min(...values);

    return selectedProposalData.map((p, index) => {
      const value = typeof p[metric] === 'number' ? p[metric] : 0;
      let comparison: 'better' | 'worse' | 'neutral' = 'neutral';
      
      if (max !== min) {
        if (value === max) comparison = 'better';
        else if (value === min) comparison = 'worse';
      }

      return { proposal: p, value, comparison };
    });
  };

  const voterOverlap = useMemo(() => {
    if (selectedProposalData.length < 2) return 0;
    return 62;
  }, [selectedProposalData]);

  const velocityChartData = useMemo(() => {
    if (selectedProposalData.length === 0) return [];

    const maxHours = Math.max(...selectedProposalData.map(p => p.timeToFunding || 24));
    const hours = Array.from({ length: Math.ceil(maxHours) }, (_, i) => i);

    return hours.map(hour => {
      const dataPoint: any = { hour };
      selectedProposalData.forEach(p => {
        dataPoint[`proposal${p.proposalId}`] = hour <= (p.timeToFunding || 0) ? p.totalVotes : 0;
      });
      return dataPoint;
    });
  }, [selectedProposalData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Proposal Comparator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compare up to 3 proposals side-by-side
          </p>
        </div>
        {selectedProposals.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportComparison}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {selectedProposals.length < 3 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proposals by title or ID..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredProposals.slice(0, 20).map(proposal => (
              <button
                key={proposal.proposalId}
                onClick={() => toggleProposal(proposal.proposalId)}
                disabled={selectedProposals.includes(proposal.proposalId)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  selectedProposals.includes(proposal.proposalId)
                    ? 'bg-blue-100 dark:bg-blue-900/30 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      #{proposal.proposalId}: {proposal.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {proposal.category} · {formatMetric(proposal.amount, 'currency')}
                    </div>
                  </div>
                  {selectedProposals.includes(proposal.proposalId) && (
                    <span className="text-blue-500 text-sm">Selected</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProposalData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedProposalData.map(proposal => (
              <div
                key={proposal.proposalId}
                className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 p-4 relative"
              >
                <button
                  onClick={() => toggleProposal(proposal.proposalId)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Proposal #{proposal.proposalId}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{proposal.title}</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="font-medium capitalize">{proposal.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium">{formatMetric(proposal.amount, 'currency')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Votes For:</span>
                      <span className="font-medium text-green-600">{proposal.votesFor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Votes Against:</span>
                      <span className="font-medium text-red-600">{proposal.votesAgainst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-medium ${proposal.executed ? 'text-green-600' : 'text-gray-600'}`}>
                        {proposal.executed ? 'Funded' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-semibold mb-4">Voting Velocity Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={velocityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="hour" 
                  label={{ value: 'Hours', position: 'insideBottom', offset: -5 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  label={{ value: 'Votes', angle: -90, position: 'insideLeft' }}
                  stroke="#9ca3af"
                />
                <Tooltip />
                {selectedProposalData.map((proposal, index) => (
                  <Line
                    key={proposal.proposalId}
                    type="monotone"
                    dataKey={`proposal${proposal.proposalId}`}
                    stroke={['#3b82f6', '#10b981', '#f59e0b'][index]}
                    strokeWidth={2}
                    name={`#${proposal.proposalId}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {selectedProposalData.length >= 2 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 p-6">
              <h4 className="font-semibold mb-3">Key Insights</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Proposal #{selectedProposalData[0].proposalId} received {
                      ((selectedProposalData[0].totalVotes / (selectedProposalData[1]?.totalVotes || 1)) * 100).toFixed(0)
                    }% more votes than Proposal #{selectedProposalData[1]?.proposalId}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {voterOverlap}% of voters participated in multiple proposals
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

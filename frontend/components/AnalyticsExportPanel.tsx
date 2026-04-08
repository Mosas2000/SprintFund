'use client';

import { useState } from 'react';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';
import { exportAnalyticsToCSV, exportAnalyticsToJSON } from '@/utils/analytics-utils';
import { Download } from 'lucide-react';

export function AnalyticsExportPanel() {
  const { proposalStats, categoryStats, voterStats, votingPower, timeline, proposals } =
    useGovernanceAnalytics();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Transform proposals to match AnalyticsProposal interface
      const analyticsProposals = proposals.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.executed ? 'approved' : 'pending',
        category: p.category,
        createdAt: p.createdAt,
        requestedAmount: p.amount,
      }));
      
      // Provide defaults for nullable fields to satisfy AnalyticsData interface
      const data = {
        proposals: analyticsProposals,
        proposalStats: proposalStats ?? {
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          successRate: 0,
          totalAmount: 0,
          averageAmount: 0,
        },
        categoryStats: categoryStats.map((c) => ({
          name: c.category,
          count: c.proposals,
          percentage: 0,
          approved: c.approved,
          rejected: c.rejected,
          pending: 0,
          totalAmount: c.totalFunded,
        })),
        voterStats: {
          totalVoters: voterStats?.totalVoters ?? 0,
          totalVotes: voterStats?.totalVotes ?? 0,
          averageVotesPerVoter: voterStats?.averageVotesPerVoter ?? 0,
          participationRate: 0,
        },
        votingPower: votingPower
          ? {
              distribution: votingPower.topVoters.map((v, i) => ({
                range: `Top ${i + 1}`,
                count: v.amount,
              })),
              gini: 0,
              topHoldersPercentage: votingPower.whaleConcentration,
            }
          : { distribution: [], gini: 0, topHoldersPercentage: 0 },
        timeline: timeline.map((t) => ({
          date: t.date,
          proposals: t.created + t.approved + t.rejected,
          votes: 0,
        })),
      };
      exportAnalyticsToCSV(
        data,
        `governance-analytics-${new Date().toISOString().split('T')[0]}.csv`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      // Transform proposals to match AnalyticsProposal interface
      const analyticsProposals = proposals.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.executed ? 'approved' : 'pending',
        category: p.category,
        createdAt: p.createdAt,
        requestedAmount: p.amount,
      }));
      
      // Provide defaults for nullable fields to satisfy AnalyticsData interface
      const data = {
        proposals: analyticsProposals,
        proposalStats: proposalStats ?? {
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          successRate: 0,
          totalAmount: 0,
          averageAmount: 0,
        },
        categoryStats: categoryStats.map((c) => ({
          name: c.category,
          count: c.proposals,
          percentage: 0,
          approved: c.approved,
          rejected: c.rejected,
          pending: 0,
          totalAmount: c.totalFunded,
        })),
        voterStats: {
          totalVoters: voterStats?.totalVoters ?? 0,
          totalVotes: voterStats?.totalVotes ?? 0,
          averageVotesPerVoter: voterStats?.averageVotesPerVoter ?? 0,
          participationRate: 0,
        },
        votingPower: votingPower
          ? {
              distribution: votingPower.topVoters.map((v, i) => ({
                range: `Top ${i + 1}`,
                count: v.amount,
              })),
              gini: 0,
              topHoldersPercentage: votingPower.whaleConcentration,
            }
          : { distribution: [], gini: 0, topHoldersPercentage: 0 },
        timeline: timeline.map((t) => ({
          date: t.date,
          proposals: t.created + t.approved + t.rejected,
          votes: 0,
        })),
        exportedAt: new Date().toISOString(),
      };
      exportAnalyticsToJSON(
        data,
        `governance-analytics-${new Date().toISOString().split('T')[0]}.json`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Download className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Export Analytics</h3>
      </div>

      <p className="text-sm text-white/60 mb-4">
        Download your governance analytics data in multiple formats
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Export as CSV
        </button>
        <button
          onClick={handleExportJSON}
          disabled={isExporting}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Export as JSON
        </button>
      </div>
    </div>
  );
}

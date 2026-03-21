'use client';

import { useState } from 'react';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';
import CategoryChart from './CategoryChart';
import SuccessRateChart from './SuccessRateChart';
import VotingTrendsChart from './VotingTrendsChart';
import STXDistributionChart from './STXDistributionChart';
import VotingPowerConcentrationChart from './VotingPowerConcentrationChart';
import ProposerActivityChart from './ProposerActivityChart';
import { AnalyticsKPIPanel } from './AnalyticsKPIPanel';
import { AnalyticsExportPanel } from './AnalyticsExportPanel';
import { PerformanceMetricsPanel } from './PerformanceMetricsPanel';
import FundingMetricsChart from './FundingMetricsChart';
import TreasuryBalanceChart from './TreasuryBalanceChart';
import VoterParticipationTrendChart from './VoterParticipationTrendChart';
import { DataRefreshIndicator } from './DataRefreshIndicator';
import { RefreshCw } from 'lucide-react';

export default function GovernanceAnalyticsDashboard() {
  const {
    proposalStats,
    categoryStats,
    voterStats,
    votingPower,
    loading,
    error,
    refetch,
  } = useGovernanceAnalytics();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Governance Analytics</h1>
          <p className="text-white/60 mt-2">Real-time insights into SprintFund governance</p>
        </div>
        <div className="flex items-center gap-3">
          <DataRefreshIndicator />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <AnalyticsKPIPanel />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-2">Total Proposals</p>
          <p className="text-3xl font-bold text-white">
            {proposalStats?.total || 0}
          </p>
          <p className="text-xs text-white/40 mt-2">
            Success Rate: {proposalStats?.successRate?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-2">Total Funded</p>
          <p className="text-3xl font-bold text-white">
            {(proposalStats?.totalAmount || 0) / 1_000_000}
          </p>
          <p className="text-xs text-white/40 mt-2">STX</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-2">Unique Voters</p>
          <p className="text-3xl font-bold text-white">
            {voterStats?.totalVoters || 0}
          </p>
          <p className="text-xs text-white/40 mt-2">
            Avg {voterStats?.averageVotesPerVoter?.toFixed(1) || 0} votes/voter
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-2">Whale Concentration</p>
          <p className="text-3xl font-bold text-white">
            {votingPower?.whaleConcentration?.toFixed(1) || 0}%
          </p>
          <p className="text-xs text-white/40 mt-2">
            Top 10 stakers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuccessRateChart />
        <CategoryChart />
      </div>

      <PerformanceMetricsPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VotingTrendsChart />
        <VoterParticipationTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <STXDistributionChart />
        <FundingMetricsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VotingPowerConcentrationChart />
        <ProposerActivityChart />
      </div>

      <TreasuryBalanceChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsExportPanel />
        {categoryStats.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Category Overview</h2>
            <div className="space-y-3">
              {categoryStats.slice(0, 5).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{cat.category}</p>
                    <p className="text-xs text-white/40">
                      {cat.proposals} proposals • {cat.successRate.toFixed(0)}% success
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-400">
                      {(cat.totalFunded / 1_000_000).toFixed(0)} STX
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {categoryStats.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Detailed Category Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-4 text-white/60">Category</th>
                  <th className="text-right py-2 px-4 text-white/60">Proposals</th>
                  <th className="text-right py-2 px-4 text-white/60">Approved</th>
                  <th className="text-right py-2 px-4 text-white/60">Rejected</th>
                  <th className="text-right py-2 px-4 text-white/60">Success Rate</th>
                  <th className="text-right py-2 px-4 text-white/60">Total Funded</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((cat) => (
                  <tr key={cat.category} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-2 px-4 text-white">{cat.category}</td>
                    <td className="py-2 px-4 text-right text-white">{cat.proposals}</td>
                    <td className="py-2 px-4 text-right text-green-400">{cat.approved}</td>
                    <td className="py-2 px-4 text-right text-red-400">{cat.rejected}</td>
                    <td className="py-2 px-4 text-right text-white">
                      {cat.successRate.toFixed(1)}%
                    </td>
                    <td className="py-2 px-4 text-right text-white">
                      {(cat.totalFunded / 1_000_000).toFixed(2)} STX
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

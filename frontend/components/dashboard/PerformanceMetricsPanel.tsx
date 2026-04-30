'use client';

import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';
import { Clock, Zap, TrendingUp } from 'lucide-react';

export function PerformanceMetricsPanel() {
  const { proposals, proposalStats } = useGovernanceAnalytics();

  const calculateApprovalVelocity = () => {
    if (!proposals || proposals.length === 0) return 0;

    const executedProposals = proposals.filter((p) => p.executed);
    if (executedProposals.length === 0) return 0;

    const recentExecuted = executedProposals.slice(0, 10);
    const dates = recentExecuted.map((p) => p.createdAt);
    const firstDate = Math.min(...dates);
    const lastDate = Math.max(...dates);
    const days = (lastDate - firstDate) / (1000 * 60 * 60 * 24) || 1;

    return (recentExecuted.length / days).toFixed(2);
  };

  const calculateAverageFundingTime = () => {
    if (!proposals || proposals.length === 0) return 0;

    const executedProposals = proposals.filter((p) => p.executed);
    if (executedProposals.length === 0) return 0;

    // Since we don't have updatedAt, estimate based on createdAt spread
    const createdTimes = executedProposals.map((p) => p.createdAt);
    const avgTime = createdTimes.reduce((a, b) => a + b, 0) / createdTimes.length;
    const latestTime = Math.max(...createdTimes);
    const avgDays = ((latestTime - avgTime) / (1000 * 60 * 60 * 24)).toFixed(1);
    return avgDays;
  };

  const calculatePendingRate = () => {
    if (!proposalStats) return 0;
    const total = proposalStats.total || 1;
    return (((proposalStats.pending || 0) / total) * 100).toFixed(1);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-purple-400" />
            <p className="text-sm text-white/60">Approval Velocity</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {calculateApprovalVelocity()}
          </p>
          <p className="text-xs text-white/40 mt-2">proposals/day</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-purple-400" />
            <p className="text-sm text-white/60">Avg Funding Time</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {calculateAverageFundingTime()}
          </p>
          <p className="text-xs text-white/40 mt-2">days</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <p className="text-sm text-white/60">Pending Rate</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {calculatePendingRate()}%
          </p>
          <p className="text-xs text-white/40 mt-2">of proposals</p>
        </div>
      </div>
    </div>
  );
}

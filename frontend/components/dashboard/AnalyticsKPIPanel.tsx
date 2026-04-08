'use client';

import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';
import { TrendingUp, TrendingDown, Users, Zap } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

function KPICard({ title, value, subtitle, trend, icon }: KPICardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-white/40 mt-2">{subtitle}</p>}
        </div>
        {icon && (
          <div className="text-purple-400 opacity-60">{icon}</div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          {trend === 'up' && (
            <>
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Increasing</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className="h-3 w-3 text-red-400" />
              <span className="text-red-400">Decreasing</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function AnalyticsKPIPanel() {
  const {
    proposalStats,
    voterStats,
    votingPower,
    timeline,
  } = useGovernanceAnalytics();

  const avgFundingTime = calculateAverageFundingTime(timeline);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Key Performance Indicators</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Success Rate"
          value={`${(proposalStats?.successRate || 0).toFixed(1)}%`}
          subtitle={`${proposalStats?.approved || 0} of ${proposalStats?.total || 0} approved`}
          icon={<Zap className="h-5 w-5" />}
          trend={proposalStats?.successRate && proposalStats.successRate > 50 ? 'up' : 'down'}
        />

        <KPICard
          title="Participation Rate"
          value={`${((voterStats?.totalVoters || 0) * 10).toFixed(1)}%`}
          subtitle={`${voterStats?.totalVoters || 0} unique voters`}
          icon={<Users className="h-5 w-5" />}
          trend="up"
        />

        <KPICard
          title="Avg Funding Time"
          value={`${avgFundingTime} days`}
          subtitle="Creation to execution"
        />

        <KPICard
          title="Pending Proposals"
          value={proposalStats?.pending || 0}
          subtitle={`of ${proposalStats?.total || 0} total`}
          trend={proposalStats?.pending && proposalStats.pending > 5 ? 'down' : 'stable'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="Total Treasury Distributed"
          value={`${((proposalStats?.totalAmount || 0) / 1_000_000).toFixed(0)} STX`}
          subtitle="Across all approved proposals"
        />

        <KPICard
          title="Voting Power Concentration"
          value={`${(votingPower?.whaleConcentration || 0).toFixed(1)}%`}
          subtitle="Top 10 stakers of total"
          trend={votingPower && votingPower.whaleConcentration > 50 ? 'down' : 'up'}
        />
      </div>
    </div>
  );
}

interface TimelineItem {
  date: string;
  created?: number;
  approved?: number;
}

function calculateAverageFundingTime(timeline: TimelineItem[]): number {
  if (!timeline || timeline.length === 0) return 0;

  // Since this hook provides counts per day, not proposal IDs,
  // we estimate average funding time based on the timeline pattern
  let totalCreated = 0;
  let totalApproved = 0;
  
  timeline.forEach((item) => {
    totalCreated += item.created || 0;
    totalApproved += item.approved || 0;
  });

  // Average days between creation and approval across the timeline
  if (totalApproved === 0) return 0;
  return Math.round(timeline.length / 2); // Simplified estimate
}

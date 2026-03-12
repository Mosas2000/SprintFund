import { memo } from 'react';
import { formatStx } from '../config';
import type { ProfileStatsGridProps } from '../types/profile';

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  color?: string;
}

function StatCard({ label, value, detail, color = 'text-white' }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5">
      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-xl sm:text-2xl font-bold ${color}`}>
        {value}
      </p>
      {detail && (
        <p className="text-xs text-zinc-500 mt-1">{detail}</p>
      )}
    </div>
  );
}

/**
 * Grid of profile stats cards showing key metrics:
 * balance, staked amount, proposals, votes, participation rate, comments.
 */
function ProfileStatsGridBase({ stats }: ProfileStatsGridProps) {
  return (
    <section aria-labelledby="profile-stats-heading">
      <h2
        id="profile-stats-heading"
        className="text-lg font-semibold text-white mb-4"
      >
        Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="STX Balance"
          value={`${formatStx(stats.stxBalance)} STX`}
        />
        <StatCard
          label="Staked Amount"
          value={`${formatStx(stats.stakedAmount)} STX`}
          color="text-emerald-400"
        />
        <StatCard
          label="Proposals Created"
          value={stats.proposalsCreated}
          detail={`${stats.proposalsExecuted} executed`}
        />
        <StatCard
          label="Votes Cast"
          value={stats.totalVotesCast}
          detail={`Weight: ${stats.totalVoteWeight}`}
          color="text-indigo-400"
        />
        <StatCard
          label="Participation"
          value={`${stats.votingParticipationRate}%`}
          detail="of all proposals"
          color={stats.votingParticipationRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}
        />
        <StatCard
          label="Comments"
          value={stats.totalComments}
        />
      </div>
    </section>
  );
}

const ProfileStatsGrid = memo(ProfileStatsGridBase);
ProfileStatsGrid.displayName = 'ProfileStatsGrid';
export default ProfileStatsGrid;

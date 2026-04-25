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
    <div className="group rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6 hover:bg-white/10 transition-all duration-500">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 group-hover:text-slate-400 transition-colors">
        {label}
      </p>
      <p className={`text-2xl sm:text-3xl font-black tracking-tighter ${color}`}>
        {value}
      </p>
      {detail && (
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">{detail}</p>
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
      <div className="flex items-end justify-between mb-6">
        <h2
          id="profile-stats-heading"
          className="text-2xl font-black uppercase tracking-tight text-white"
        >
          Citizen Overview
        </h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
          Last synced: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

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
/** ProfileStatsGrid component displays participation metrics */
// Optimized with React.memo

import { useDetailedStake } from '../hooks/useDetailedStake';
import { StakeLockStatus } from './StakeLockStatus';
import { LockedStakeBreakdown } from './LockedStakeBreakdown';

interface StakeDashboardProps {
  address: string | undefined;
}

export function StakeDashboard({ address }: StakeDashboardProps) {
  const { stakeInfo, loading, error } = useDetailedStake(address);

  if (!address) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-purple-300">Connect your wallet to view stake information</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-8 w-full rounded bg-white/10" />
          <div className="h-8 w-full rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-6">
        <p className="text-sm text-red-200">Error loading stake information: {error}</p>
      </div>
    );
  }

  if (!stakeInfo || stakeInfo.totalStake === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-purple-300">You have no staked STX</p>
        <p className="mt-1 text-xs text-purple-400">Stake STX to participate in governance</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StakeLockStatus stakeInfo={stakeInfo} />
      {stakeInfo.voteCosts.length > 0 && (
        <LockedStakeBreakdown voteCosts={stakeInfo.voteCosts} />
      )}
    </div>
  );
}

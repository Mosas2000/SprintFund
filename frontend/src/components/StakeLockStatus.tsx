import { formatSTX } from '../utils/formatSTX';
import type { DetailedStakeInfo } from '../types/stake';

interface StakeLockStatusProps {
  stakeInfo: DetailedStakeInfo;
  compact?: boolean;
}

export function StakeLockStatus({ stakeInfo, compact = false }: StakeLockStatusProps) {
  const { totalStake, lockedStake, availableStake, activeVotes } = stakeInfo;

  if (compact) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-purple-200">Available</span>
          <span className="text-sm font-semibold text-white">{formatSTX(availableStake)} STX</span>
        </div>
        {lockedStake > 0 && (
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-purple-300">Locked in votes</span>
            <span className="text-xs text-purple-300">{formatSTX(lockedStake)} STX</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Stake Status</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-purple-200">Total Stake</span>
          <span className="text-sm font-semibold text-white">{formatSTX(totalStake)} STX</span>
        </div>

        {lockedStake > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-amber-300">Locked in Votes</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-300">
                  {activeVotes}
                </span>
              </div>
              <span className="text-sm font-semibold text-amber-300">{formatSTX(lockedStake)} STX</span>
            </div>

            <div className="h-px bg-white/10" />
          </>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-green-300">Available to Withdraw</span>
          <span className="text-sm font-bold text-green-300">{formatSTX(availableStake)} STX</span>
        </div>
      </div>

      {lockedStake > 0 && (
        <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-500/10 p-3">
          <p className="text-xs text-amber-200">
            {formatSTX(lockedStake)} STX is locked as voting cost for {activeVotes} active {activeVotes === 1 ? 'proposal' : 'proposals'}. 
            These funds will become available after the voting periods end.
          </p>
        </div>
      )}

      {availableStake === 0 && totalStake > 0 && (
        <div className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 p-3">
          <p className="text-xs text-red-200">
            All your staked funds are currently locked in active votes. You cannot withdraw until voting periods end.
          </p>
        </div>
      )}
    </div>
  );
}

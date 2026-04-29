import { formatSTX } from '../utils/formatSTX';
import type { DetailedStakeInfo } from '../types/stake';

interface CompactStakeStatusProps {
  stakeInfo: DetailedStakeInfo | null;
  loading?: boolean;
}

export function CompactStakeStatus({ stakeInfo, loading }: CompactStakeStatusProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  if (!stakeInfo || stakeInfo.totalStake === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
        <span className="text-xs text-purple-300">No stake</span>
      </div>
    );
  }

  const { totalStake, lockedStake, availableStake, isLocked } = stakeInfo;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-purple-300">Total:</span>
        <span className="text-xs font-semibold text-white">{formatSTX(totalStake)}</span>
      </div>
      
      {isLocked && (
        <>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-amber-300">{formatSTX(lockedStake)}</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-green-300">Available:</span>
            <span className="text-xs font-semibold text-green-300">{formatSTX(availableStake)}</span>
          </div>
        </>
      )}
    </div>
  );
}

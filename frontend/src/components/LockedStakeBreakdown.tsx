import { useState } from 'react';
import { formatSTX } from '../utils/formatSTX';
import type { VoteCostInfo } from '../types/stake';

interface LockedStakeBreakdownProps {
  voteCosts: VoteCostInfo[];
}

export function LockedStakeBreakdown({ voteCosts }: LockedStakeBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (voteCosts.length === 0) {
    return null;
  }

  const totalLocked = voteCosts.reduce((sum, v) => sum + v.cost, 0);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <h4 className="text-sm font-semibold text-white">Locked Stake Breakdown</h4>
          <p className="text-xs text-purple-300">
            {voteCosts.length} active {voteCosts.length === 1 ? 'vote' : 'votes'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-amber-300">{formatSTX(totalLocked)} STX</span>
          <svg
            className={`h-5 w-5 text-purple-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          {voteCosts.map((voteCost) => (
            <div
              key={voteCost.proposalId}
              className="flex items-center justify-between rounded-lg bg-white/5 p-2"
            >
              <div>
                <p className="text-xs font-medium text-white">Proposal #{voteCost.proposalId}</p>
                <p className="text-xs text-purple-300">
                  Vote weight: {voteCost.weight} (cost: {voteCost.weight}² = {voteCost.cost})
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-300">{formatSTX(voteCost.cost)} STX</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

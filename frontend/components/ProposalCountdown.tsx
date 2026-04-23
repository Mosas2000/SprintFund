'use client';

import React from 'react';
import type { Proposal } from '../types';
import { useCurrentBlockHeight } from '../hooks';
import { 
  getBlocksUntilVotingEnds, 
  getBlocksUntilExecutionAllowed, 
  formatBlockDuration,
  isHighValueProposal
} from '../lib/proposal-utils';

interface ProposalCountdownProps {
  proposal: Proposal;
}

/**
 * Premium countdown component for proposal voting and execution windows.
 * Displays real-time estimated time remaining based on block-height logic.
 */
export function ProposalCountdown({ proposal }: ProposalCountdownProps) {
  const { blockHeight } = useCurrentBlockHeight();

  // Don't show for executed proposals or when block height isn't available yet
  if (!blockHeight || proposal.executed) {
    return null;
  }

  const isVotingActive = blockHeight <= proposal.votingEndsAt;
  const blocksUntilVotingEnds = getBlocksUntilVotingEnds(proposal, blockHeight);
  const blocksUntilExecution = getBlocksUntilExecutionAllowed(proposal, blockHeight);
  const isHighValue = isHighValueProposal(proposal);
  
  // Determine if it's currently in the timelock period (voting ended but execution not yet allowed)
  const isTimelockPeriod = !isVotingActive && blocksUntilExecution > 0;
  const isReadyForExecution = !isVotingActive && blocksUntilExecution === 0;

  return (
    <div className="mt-4 rounded-xl bg-white/5 p-4 border border-white/10 shadow-inner backdrop-blur-sm transition-all hover:bg-white/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${
            isVotingActive 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : isReadyForExecution
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          }`}>
            {isVotingActive ? (
              <ClockIcon className="h-6 w-6 animate-pulse" />
            ) : isReadyForExecution ? (
              <CheckIcon className="h-6 w-6" />
            ) : (
              <LockIcon className="h-6 w-6" />
            )}
          </div>
          
          <div>
            <p className="text-[10px] text-purple-300 uppercase tracking-[0.2em] font-bold mb-0.5">
              {isVotingActive 
                ? 'Voting Ends In' 
                : isReadyForExecution 
                  ? 'Proposal Ready' 
                  : 'Execution Timelock'}
            </p>
            <p className="text-xl font-black text-white tabular-nums tracking-tight">
              {isVotingActive 
                ? formatBlockDuration(blocksUntilVotingEnds) 
                : isReadyForExecution 
                  ? 'Now' 
                  : formatBlockDuration(blocksUntilExecution)}
            </p>
          </div>
        </div>

        {(isHighValue || isTimelockPeriod) && (
          <div className="flex flex-wrap gap-2">
            {isHighValue && (
              <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-1.5 border border-purple-500/20">
                <ShieldIcon className="h-4 w-4 text-purple-400" />
                <span className="text-[11px] font-semibold text-purple-200">High-Value Timelock</span>
              </div>
            )}
            {isTimelockPeriod && (
              <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1.5 border border-orange-500/20">
                <HourglassIcon className="h-4 w-4 text-orange-400" />
                <span className="text-[11px] font-semibold text-orange-200">Pending Execution</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Progress Bar for Voting Window */}
      {isVotingActive && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000 ease-out"
            style={{ 
              width: `${Math.max(5, Math.min(100, (1 - blocksUntilVotingEnds / 432) * 100))}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}

// Minimal SVG Icons
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const HourglassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

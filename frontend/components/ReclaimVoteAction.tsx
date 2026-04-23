'use client';

import React from 'react';
import { Proposal } from '@/types';
import { useCurrentBlockHeight, useVote, useTransaction } from '@/hooks';
import { callReclaimVoteCost } from '@/lib/stacks';
import { formatSTX } from '@/utils/formatSTX';
import { Coins, Lock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ReclaimVoteActionProps {
  proposal: Proposal;
  userAddress?: string;
  onSuccess?: () => void;
}

/**
 * Premium action component for reclaiming vote costs.
 * Guides the user through the recovery process once a voting period ends.
 */
export default function ReclaimVoteAction({ 
  proposal, 
  userAddress,
  onSuccess 
}: ReclaimVoteActionProps) {
  const { blockHeight } = useCurrentBlockHeight();
  const { vote, refresh: refreshVote } = useVote(proposal.id, userAddress);
  const { execute, isLoading: isReclaiming } = useTransaction({
    type: 'reclaim-vote',
    proposalId: proposal.id,
    title: proposal.title,
    onSuccess: (txId) => {
      refreshVote();
      onSuccess?.();
    }
  });

  // Calculate if voting has ended based on block height
  const isVotingActive = blockHeight ? blockHeight <= proposal.votingEndsAt : true;
  
  // A user can reclaim if voting ended, they voted, and there is a cost to reclaim
  const canReclaim = !isVotingActive && vote && vote.costPaid > 0;

  // Don't render if user hasn't voted or there's nothing to reclaim
  if (!userAddress || !vote || vote.costPaid === 0) {
    return null;
  }

  const handleReclaim = async () => {
    try {
      await execute(() => new Promise((resolve, reject) => {
        callReclaimVoteCost(proposal.id, {
          onFinish: (txId) => resolve(txId),
          onCancel: () => reject(new Error('Transaction cancelled'))
        });
      }));
    } catch (err) {
      console.error('[SprintFund] Reclaim failed:', err);
    }
  };

  return (
    <div className="mt-6 rounded-2xl bg-slate-900/50 border border-slate-800 p-6 backdrop-blur-sm shadow-xl transition-all hover:border-slate-700">
      <div className="flex items-start gap-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${
          isVotingActive 
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
            : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {isVotingActive ? (
            <Lock className="h-6 w-6" />
          ) : (
            <Coins className="h-6 w-6" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-bold text-white tracking-tight">
              Vote Cost Recovery
            </h4>
            {!isVotingActive && (
              <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-green-400 border border-green-500/20">
                <CheckCircle className="h-3 w-3" />
                Available
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {isVotingActive 
              ? `You have ${formatSTX(vote.costPaid)} STX currently locked by this vote. You can reclaim it once the voting period ends.`
              : `The voting period has ended. You can now reclaim your ${formatSTX(vote.costPaid)} STX to make it available for future votes or withdrawal.`
            }
          </p>

          <button
            onClick={handleReclaim}
            disabled={!canReclaim || isReclaiming}
            className={`group relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              canReclaim && !isReclaiming
                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isReclaiming ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Reclaiming STX...
              </>
            ) : (
              <>
                <Coins className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Reclaim {formatSTX(vote.costPaid)} STX
              </>
            )}
          </button>
          
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-indigo-500/5 p-3 border border-indigo-500/10">
            <AlertCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-200/70 font-medium italic leading-normal">
              Note: Reclaiming vote cost does not remove your vote from the proposal tally. It simply releases the locked stake portion used for quadratic weight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

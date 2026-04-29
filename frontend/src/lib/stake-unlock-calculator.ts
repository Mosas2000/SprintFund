import type { Proposal } from '../types';
import type { VoteCostInfo } from '../types/stake';

const BLOCK_TIME_MINUTES = 10;

export interface UnlockEstimate {
  proposalId: number;
  amount: number;
  votingEndsAt: number;
  blocksRemaining: number;
  estimatedMinutes: number;
  estimatedHours: number;
}

export function calculateUnlockEstimates(
  voteCosts: VoteCostInfo[],
  proposals: Proposal[],
  currentBlockHeight: number
): UnlockEstimate[] {
  const estimates: UnlockEstimate[] = [];

  for (const voteCost of voteCosts) {
    const proposal = proposals.find(p => p.id === voteCost.proposalId);
    if (!proposal || proposal.executed) continue;

    const votingEndsAt = proposal.votingEndsAt || proposal.createdAt + 432;
    const blocksRemaining = Math.max(0, votingEndsAt - currentBlockHeight);
    const estimatedMinutes = blocksRemaining * BLOCK_TIME_MINUTES;

    estimates.push({
      proposalId: voteCost.proposalId,
      amount: voteCost.cost,
      votingEndsAt,
      blocksRemaining,
      estimatedMinutes,
      estimatedHours: Math.floor(estimatedMinutes / 60),
    });
  }

  return estimates.sort((a, b) => a.blocksRemaining - b.blocksRemaining);
}

export function formatUnlockTime(estimate: UnlockEstimate): string {
  if (estimate.blocksRemaining === 0) {
    return 'Available now';
  }

  const days = Math.floor(estimate.estimatedHours / 24);
  const hours = estimate.estimatedHours % 24;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${estimate.estimatedMinutes}m`;
}

export function getTotalUnlockingAmount(estimates: UnlockEstimate[]): number {
  return estimates.reduce((sum, e) => sum + e.amount, 0);
}

export function getNextUnlockEstimate(estimates: UnlockEstimate[]): UnlockEstimate | null {
  return estimates.length > 0 ? estimates[0] : null;
}

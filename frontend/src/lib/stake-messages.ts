import { formatSTX } from '../utils/formatSTX';
import type { DetailedStakeInfo } from '../types/stake';

export function getStakeLockMessage(stakeInfo: DetailedStakeInfo): string {
  if (!stakeInfo.isLocked) {
    return 'All your staked funds are available for withdrawal.';
  }

  const { lockedStake, activeVotes } = stakeInfo;
  return `${formatSTX(lockedStake)} STX is locked in ${activeVotes} active ${activeVotes === 1 ? 'vote' : 'votes'}.`;
}

export function getWithdrawalBlockedMessage(stakeInfo: DetailedStakeInfo): string {
  const { lockedStake, activeVotes, availableStake } = stakeInfo;
  
  if (availableStake === 0) {
    return `All your funds are locked in ${activeVotes} active ${activeVotes === 1 ? 'vote' : 'votes'}. Wait for voting periods to end.`;
  }

  return `${formatSTX(lockedStake)} STX is locked. You can withdraw up to ${formatSTX(availableStake)} STX.`;
}

export function getStakeStatusSummary(stakeInfo: DetailedStakeInfo): string {
  const { totalStake, lockedStake, availableStake } = stakeInfo;
  
  if (lockedStake === 0) {
    return `${formatSTX(totalStake)} STX staked, all available`;
  }

  return `${formatSTX(totalStake)} STX staked (${formatSTX(availableStake)} available, ${formatSTX(lockedStake)} locked)`;
}

export function getVoteCostExplanation(weight: number): string {
  const cost = weight * weight;
  return `Vote weight ${weight} costs ${cost} STX (${weight}² = ${cost})`;
}

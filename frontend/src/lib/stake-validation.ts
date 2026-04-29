import type { DetailedStakeInfo } from '../types/stake';

export interface WithdrawValidationResult {
  canWithdraw: boolean;
  error?: string;
  warning?: string;
}

export function validateWithdrawal(
  amount: number,
  stakeInfo: DetailedStakeInfo | null
): WithdrawValidationResult {
  if (!stakeInfo) {
    return {
      canWithdraw: false,
      error: 'Unable to load stake information',
    };
  }

  if (amount <= 0) {
    return {
      canWithdraw: false,
      error: 'Amount must be greater than zero',
    };
  }

  if (amount > stakeInfo.totalStake) {
    return {
      canWithdraw: false,
      error: `Cannot withdraw more than your total stake (${stakeInfo.totalStake} microSTX)`,
    };
  }

  if (amount > stakeInfo.availableStake) {
    const lockedAmount = stakeInfo.lockedStake;
    const activeVotes = stakeInfo.activeVotes;
    return {
      canWithdraw: false,
      error: `Cannot withdraw ${amount} microSTX. Only ${stakeInfo.availableStake} microSTX available.`,
      warning: `${lockedAmount} microSTX is locked in ${activeVotes} active ${activeVotes === 1 ? 'vote' : 'votes'}. Wait for voting periods to end before withdrawing.`,
    };
  }

  if (stakeInfo.lockedStake > 0 && amount === stakeInfo.totalStake) {
    return {
      canWithdraw: false,
      error: 'Cannot withdraw all stake while funds are locked in active votes',
      warning: `${stakeInfo.lockedStake} microSTX is locked. You can only withdraw ${stakeInfo.availableStake} microSTX.`,
    };
  }

  return {
    canWithdraw: true,
  };
}

export function getWithdrawWarning(
  amount: number,
  stakeInfo: DetailedStakeInfo
): string | null {
  if (amount > stakeInfo.availableStake * 0.9) {
    return 'You are withdrawing most of your available stake. This may limit your ability to vote on new proposals.';
  }
  return null;
}

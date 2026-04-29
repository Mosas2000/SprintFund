export interface StakeLockInfo {
  totalStake: number;
  lockedStake: number;
  availableStake: number;
  lockedUntilBlock?: number;
  isLocked: boolean;
}

export interface VoteCostInfo {
  proposalId: number;
  cost: number;
  weight: number;
}

export interface DetailedStakeInfo extends StakeLockInfo {
  voteCosts: VoteCostInfo[];
  activeVotes: number;
}

export type { StakeLockInfo, VoteCostInfo, DetailedStakeInfo };

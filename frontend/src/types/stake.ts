/**
 * Types for staking operations and stake information.
 */

/**
 * Stake information for an address.
 */
export interface StakeInfo {
  address: string;
  amount: number;
}

/**
 * Stake input for staking transaction.
 */
export interface StakeInput {
  amount: number;
}

/**
 * Withdraw stake input.
 */
export interface WithdrawStakeInput {
  amount: number;
}

/**
 * Minimum stake requirement.
 */
export interface MinStakeInfo {
  amount: number;
  currency: 'STX';
}

/**
 * Stake transaction result.
 */
export interface StakeTransactionResult {
  txId: string;
  amount: number;
  type: 'stake' | 'withdraw';
}

/**
 * Historical stake record.
 */
export interface StakeHistoryEntry {
  timestamp: number;
  amount: number;
  type: 'stake' | 'withdraw';
  txId: string;
}

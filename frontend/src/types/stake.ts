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

/**
 * Enriched stake information with derived fields.
 */
export interface StakeInfoEnhanced extends StakeInfo {
  stakePercentage: number;
  formattedAmount: string;
  isActive: boolean;
}

/**
 * Aggregated stake statistics.
 */
export interface StakeStats {
  totalStaked: number;
  minStake: number;
  maxStake: number;
  averageStake: number;
  medianStake: number;
}

/**
 * User's complete stake portfolio.
 */
export interface StakePortfolio {
  address: string;
  totalStaked: number;
  stakeCount: number;
  averageStakeSize: number;
  lastUpdated: number;
}

/**
 * Stake change event (stake/unstake).
 */
export interface StakeChangeEvent {
  address: string;
  amount: number;
  type: 'stake' | 'unstake';
  timestamp: number;
  txId: string;
}

/**
 * Comparison of before/after stake state.
 */
export interface StakeTransition {
  before: number;
  after: number;
  delta: number;
  changePercent: number;
}

/**
 * Query options for stake data.
 */
export interface StakeQueryOptions {
  address?: string;
  minAmount?: number;
  maxAmount?: number;
  includeHistory?: boolean;
  sortBy?: 'amount' | 'date' | 'address';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated stake query result.
 */
export interface StakeQueryResult {
  stakes: StakeHistoryEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Validator for minimum stake amount in microSTX.
 */
export const MIN_STAKE_AMOUNT = 10_000_000;

/**
 * Validator for maximum stake amount.
 */
export const MAX_STAKE_AMOUNT = Number.MAX_SAFE_INTEGER;

/**
 * Type guard for StakeInfo.
 */
export function isStakeInfo(value: unknown): value is StakeInfo {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.address === 'string' && typeof obj.amount === 'number';
}

/**
 * Type guard for StakeStats.
 */
export function isStakeStats(value: unknown): value is StakeStats {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.totalStaked === 'number' &&
    typeof obj.minStake === 'number' &&
    typeof obj.maxStake === 'number' &&
    typeof obj.averageStake === 'number' &&
    typeof obj.medianStake === 'number'
  );
}

/**
 * Check if stake amount is valid.
 */
export function isValidStakeAmount(amount: number): boolean {
  return (
    Number.isFinite(amount) &&
    amount >= MIN_STAKE_AMOUNT &&
    amount <= MAX_STAKE_AMOUNT
  );
}

/**
 * Calculate stake percentage.
 */
export function calculateStakePercentage(
  userStake: number,
  totalStaked: number
): number {
  if (totalStaked === 0) return 0;
  return (userStake / totalStaked) * 100;
}

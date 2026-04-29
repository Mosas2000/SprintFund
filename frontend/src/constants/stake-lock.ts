export const STAKE_LOCK_CONSTANTS = {
  BLOCK_TIME_MINUTES: 10,
  VOTING_PERIOD_BLOCKS: 432,
  REFRESH_INTERVAL_MS: 30000,
} as const;

export const STAKE_LOCK_MESSAGES = {
  NO_STAKE: 'You have no staked STX',
  ALL_AVAILABLE: 'All your staked funds are available for withdrawal',
  FUNDS_LOCKED: 'Some of your funds are locked in active votes',
  ALL_LOCKED: 'All your funds are locked in active votes',
  WITHDRAWAL_BLOCKED: 'Cannot withdraw while funds are locked',
} as const;

export const STAKE_LOCK_COLORS = {
  TOTAL: 'text-white',
  LOCKED: 'text-amber-300',
  AVAILABLE: 'text-green-300',
} as const;

import { describe, it, expect } from 'vitest';
import { validateWithdrawal, getWithdrawWarning } from './stake-validation';
import type { DetailedStakeInfo } from '../types/stake';

const createMockStakeInfo = (overrides: Partial<DetailedStakeInfo> = {}): DetailedStakeInfo => ({
  totalStake: 100000000,
  lockedStake: 0,
  availableStake: 100000000,
  isLocked: false,
  voteCosts: [],
  activeVotes: 0,
  ...overrides,
});

describe('validateWithdrawal', () => {
  it('allows withdrawal when funds are available', () => {
    const stakeInfo = createMockStakeInfo();
    const result = validateWithdrawal(50000000, stakeInfo);
    
    expect(result.canWithdraw).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects withdrawal of zero amount', () => {
    const stakeInfo = createMockStakeInfo();
    const result = validateWithdrawal(0, stakeInfo);
    
    expect(result.canWithdraw).toBe(false);
    expect(result.error).toContain('greater than zero');
  });

  it('rejects withdrawal exceeding total stake', () => {
    const stakeInfo = createMockStakeInfo({ totalStake: 100000000 });
    const result = validateWithdrawal(150000000, stakeInfo);
    
    expect(result.canWithdraw).toBe(false);
    expect(result.error).toContain('total stake');
  });

  it('rejects withdrawal exceeding available stake', () => {
    const stakeInfo = createMockStakeInfo({
      totalStake: 100000000,
      lockedStake: 60000000,
      availableStake: 40000000,
      isLocked: true,
      activeVotes: 2,
    });
    const result = validateWithdrawal(50000000, stakeInfo);
    
    expect(result.canWithdraw).toBe(false);
    expect(result.error).toContain('Only 40000000 microSTX available');
    expect(result.warning).toContain('locked in 2 active votes');
  });

  it('rejects withdrawal of all stake when funds are locked', () => {
    const stakeInfo = createMockStakeInfo({
      totalStake: 100000000,
      lockedStake: 10000000,
      availableStake: 90000000,
      isLocked: true,
      activeVotes: 1,
    });
    const result = validateWithdrawal(100000000, stakeInfo);
    
    expect(result.canWithdraw).toBe(false);
    expect(result.error).toContain('Cannot withdraw all stake');
  });

  it('handles null stake info', () => {
    const result = validateWithdrawal(50000000, null);
    
    expect(result.canWithdraw).toBe(false);
    expect(result.error).toContain('Unable to load');
  });
});

describe('getWithdrawWarning', () => {
  it('returns warning when withdrawing most of available stake', () => {
    const stakeInfo = createMockStakeInfo({ availableStake: 100000000 });
    const warning = getWithdrawWarning(95000000, stakeInfo);
    
    expect(warning).toContain('most of your available stake');
  });

  it('returns null for small withdrawals', () => {
    const stakeInfo = createMockStakeInfo({ availableStake: 100000000 });
    const warning = getWithdrawWarning(50000000, stakeInfo);
    
    expect(warning).toBeNull();
  });
});

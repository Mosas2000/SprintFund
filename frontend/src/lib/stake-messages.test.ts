import { describe, it, expect } from 'vitest';
import {
  getStakeLockMessage,
  getWithdrawalBlockedMessage,
  getStakeStatusSummary,
  getVoteCostExplanation,
} from './stake-messages';
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

describe('getStakeLockMessage', () => {
  it('returns available message when no funds are locked', () => {
    const stakeInfo = createMockStakeInfo();
    const message = getStakeLockMessage(stakeInfo);
    
    expect(message).toContain('available for withdrawal');
  });

  it('returns locked message with single vote', () => {
    const stakeInfo = createMockStakeInfo({
      lockedStake: 10000000,
      isLocked: true,
      activeVotes: 1,
    });
    const message = getStakeLockMessage(stakeInfo);
    
    expect(message).toContain('locked in 1 active vote');
  });

  it('returns locked message with multiple votes', () => {
    const stakeInfo = createMockStakeInfo({
      lockedStake: 30000000,
      isLocked: true,
      activeVotes: 3,
    });
    const message = getStakeLockMessage(stakeInfo);
    
    expect(message).toContain('locked in 3 active votes');
  });
});

describe('getWithdrawalBlockedMessage', () => {
  it('returns fully locked message when no funds available', () => {
    const stakeInfo = createMockStakeInfo({
      totalStake: 100000000,
      lockedStake: 100000000,
      availableStake: 0,
      isLocked: true,
      activeVotes: 2,
    });
    const message = getWithdrawalBlockedMessage(stakeInfo);
    
    expect(message).toContain('All your funds are locked');
    expect(message).toContain('Wait for voting periods');
  });

  it('returns partial lock message when some funds available', () => {
    const stakeInfo = createMockStakeInfo({
      totalStake: 100000000,
      lockedStake: 40000000,
      availableStake: 60000000,
      isLocked: true,
      activeVotes: 1,
    });
    const message = getWithdrawalBlockedMessage(stakeInfo);
    
    expect(message).toContain('locked');
    expect(message).toContain('withdraw up to');
  });
});

describe('getStakeStatusSummary', () => {
  it('returns simple summary when no funds locked', () => {
    const stakeInfo = createMockStakeInfo();
    const summary = getStakeStatusSummary(stakeInfo);
    
    expect(summary).toContain('all available');
  });

  it('returns detailed summary when funds are locked', () => {
    const stakeInfo = createMockStakeInfo({
      totalStake: 100000000,
      lockedStake: 30000000,
      availableStake: 70000000,
      isLocked: true,
    });
    const summary = getStakeStatusSummary(stakeInfo);
    
    expect(summary).toContain('available');
    expect(summary).toContain('locked');
  });
});

describe('getVoteCostExplanation', () => {
  it('explains quadratic cost calculation', () => {
    const explanation = getVoteCostExplanation(10);
    
    expect(explanation).toContain('weight 10');
    expect(explanation).toContain('costs 100 STX');
    expect(explanation).toContain('10² = 100');
  });

  it('handles different weights', () => {
    const explanation = getVoteCostExplanation(5);
    
    expect(explanation).toContain('weight 5');
    expect(explanation).toContain('costs 25 STX');
  });
});

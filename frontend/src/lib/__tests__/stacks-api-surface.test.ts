import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import * as stacks from '../stacks';

describe('stacks module public API', () => {
  it('exports getProposalCount', () => {
    expect(typeof stacks.getProposalCount).toBe('function');
  });

  it('exports getProposal', () => {
    expect(typeof stacks.getProposal).toBe('function');
  });

  it('exports getAllProposals', () => {
    expect(typeof stacks.getAllProposals).toBe('function');
  });

  it('exports getProposalPage', () => {
    expect(typeof stacks.getProposalPage).toBe('function');
  });

  it('exports getStake', () => {
    expect(typeof stacks.getStake).toBe('function');
  });

  it('exports getMinStakeAmount', () => {
    expect(typeof stacks.getMinStakeAmount).toBe('function');
  });

  it('exports callStake', () => {
    expect(typeof stacks.callStake).toBe('function');
  });

  it('exports callWithdrawStake', () => {
    expect(typeof stacks.callWithdrawStake).toBe('function');
  });

  it('exports callCreateProposal', () => {
    expect(typeof stacks.callCreateProposal).toBe('function');
  });

  it('exports callVote', () => {
    expect(typeof stacks.callVote).toBe('function');
  });

  it('exports callExecuteProposal', () => {
    expect(typeof stacks.callExecuteProposal).toBe('function');
  });

  it('exports BATCH_SIZE', () => {
    expect(typeof stacks.BATCH_SIZE).toBe('number');
    expect(stacks.BATCH_SIZE).toBe(10);
  });
});

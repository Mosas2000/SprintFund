import { describe, it, expect } from 'vitest';
import {
  getProposalStatus,
  isProposalActive,
  isProposalExecutable,
  getTimeRemaining,
  formatTimeRemaining,
} from './proposal-status';
import type { Proposal } from '../types/proposal';

const createMockProposal = (overrides: Partial<Proposal> = {}): Proposal => ({
  id: 1,
  proposer: 'SP1ABC',
  amount: 1000000,
  title: 'Test Proposal',
  description: 'Test description',
  votesFor: 0,
  votesAgainst: 0,
  executed: false,
  createdAt: 1000,
  votingEndsAt: 1432,
  executionAllowedAt: 1432,
  ...overrides,
});

describe('getProposalStatus', () => {
  it('returns executed status for executed proposals', () => {
    const proposal = createMockProposal({ executed: true });
    const result = getProposalStatus(proposal, 1500);
    
    expect(result.status).toBe('executed');
    expect(result.label).toBe('Executed');
    expect(result.variant).toBe('success');
  });

  it('returns active status for new proposals with no votes', () => {
    const proposal = createMockProposal();
    const result = getProposalStatus(proposal, 1100);
    
    expect(result.status).toBe('active');
    expect(result.label).toBe('Active');
    expect(result.variant).toBe('info');
  });

  it('returns passing status for proposals with more votes for', () => {
    const proposal = createMockProposal({ votesFor: 100, votesAgainst: 50 });
    const result = getProposalStatus(proposal, 1100);
    
    expect(result.status).toBe('passing');
    expect(result.label).toBe('Passing');
    expect(result.variant).toBe('success');
  });

  it('returns failing status for proposals with more votes against', () => {
    const proposal = createMockProposal({ votesFor: 50, votesAgainst: 100 });
    const result = getProposalStatus(proposal, 1100);
    
    expect(result.status).toBe('failing');
    expect(result.label).toBe('Failing');
    expect(result.variant).toBe('warning');
  });

  it('returns executable status for passed proposals after timelock', () => {
    const proposal = createMockProposal({ 
      votesFor: 100, 
      votesAgainst: 50,
      votingEndsAt: 1400,
      executionAllowedAt: 1500 
    });
    const result = getProposalStatus(proposal, 1600);
    
    expect(result.status).toBe('executable');
    expect(result.label).toBe('Executable');
    expect(result.variant).toBe('success');
  });

  it('returns expired status for proposals that failed voting', () => {
    const proposal = createMockProposal({ 
      votesFor: 50, 
      votesAgainst: 100,
    });
    const result = getProposalStatus(proposal, 1500);
    
    expect(result.status).toBe('expired');
    expect(result.label).toBe('Expired');
    expect(result.variant).toBe('neutral');
  });

  it('returns expired status for proposals with no votes after voting ends', () => {
    const proposal = createMockProposal();
    const result = getProposalStatus(proposal, 1500);
    
    expect(result.status).toBe('expired');
    expect(result.variant).toBe('neutral');
  });
});

describe('isProposalActive', () => {
  it('returns false for executed proposals', () => {
    const proposal = createMockProposal({ executed: true });
    expect(isProposalActive(proposal, 1100)).toBe(false);
  });

  it('returns true during voting period', () => {
    const proposal = createMockProposal();
    expect(isProposalActive(proposal, 1100)).toBe(true);
  });

  it('returns false after voting period ends', () => {
    const proposal = createMockProposal();
    expect(isProposalActive(proposal, 1500)).toBe(false);
  });
});

describe('isProposalExecutable', () => {
  it('returns false for executed proposals', () => {
    const proposal = createMockProposal({ executed: true, votesFor: 100 });
    expect(isProposalExecutable(proposal, 1500)).toBe(false);
  });

  it('returns false during voting period', () => {
    const proposal = createMockProposal({ votesFor: 100 });
    expect(isProposalExecutable(proposal, 1100)).toBe(false);
  });

  it('returns false for failing proposals', () => {
    const proposal = createMockProposal({ votesFor: 50, votesAgainst: 100 });
    expect(isProposalExecutable(proposal, 1500)).toBe(false);
  });

  it('returns true for passed proposals after execution allowed', () => {
    const proposal = createMockProposal({ 
      votesFor: 100, 
      votingEndsAt: 1400,
      executionAllowedAt: 1500 
    });
    expect(isProposalExecutable(proposal, 1600)).toBe(true);
  });

  it('returns false during timelock period', () => {
    const proposal = createMockProposal({ 
      votesFor: 100, 
      votingEndsAt: 1400,
      executionAllowedAt: 1500 
    });
    expect(isProposalExecutable(proposal, 1450)).toBe(false);
  });
});

describe('getTimeRemaining', () => {
  it('calculates time remaining correctly', () => {
    const proposal = createMockProposal({ createdAt: 1000, votingEndsAt: 1432 });
    const result = getTimeRemaining(proposal, 1100);
    
    expect(result.blocks).toBe(332);
    expect(result.days).toBeGreaterThan(0);
  });

  it('returns zero when voting has ended', () => {
    const proposal = createMockProposal({ createdAt: 1000, votingEndsAt: 1432 });
    const result = getTimeRemaining(proposal, 1500);
    
    expect(result.blocks).toBe(0);
  });
});

describe('formatTimeRemaining', () => {
  it('formats days and hours', () => {
    const proposal = createMockProposal({ createdAt: 1000, votingEndsAt: 2000 });
    const result = formatTimeRemaining(proposal, 1100);
    
    expect(result).toContain('d');
    expect(result).toContain('h');
  });

  it('returns ending soon for short time', () => {
    const proposal = createMockProposal({ createdAt: 1000, votingEndsAt: 1010 });
    const result = formatTimeRemaining(proposal, 1005);
    
    expect(result).toBe('Ending soon');
  });
});

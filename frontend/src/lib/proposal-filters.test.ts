import { describe, it, expect } from 'vitest';
import {
  filterProposalsByStatus,
  filterProposalsByCategory,
  searchProposals,
  applyProposalFilters,
} from './proposal-filters';
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
  category: 'development',
  ...overrides,
});

describe('filterProposalsByStatus', () => {
  it('returns all proposals when filter is all', () => {
    const proposals = [
      createMockProposal({ id: 1 }),
      createMockProposal({ id: 2, executed: true }),
    ];
    
    const result = filterProposalsByStatus(proposals, 'all', 1100);
    expect(result).toHaveLength(2);
  });

  it('filters executed proposals', () => {
    const proposals = [
      createMockProposal({ id: 1 }),
      createMockProposal({ id: 2, executed: true }),
    ];
    
    const result = filterProposalsByStatus(proposals, 'executed', 1100);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('filters active proposals including passing and failing', () => {
    const proposals = [
      createMockProposal({ id: 1, votesFor: 0 }),
      createMockProposal({ id: 2, votesFor: 100, votesAgainst: 50 }),
      createMockProposal({ id: 3, executed: true }),
    ];
    
    const result = filterProposalsByStatus(proposals, 'active', 1100);
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters expired proposals', () => {
    const proposals = [
      createMockProposal({ id: 1, votesFor: 0 }),
      createMockProposal({ id: 2, votesFor: 100 }),
    ];
    
    const result = filterProposalsByStatus(proposals, 'expired', 1500);
    expect(result).toHaveLength(1);
  });
});

describe('filterProposalsByCategory', () => {
  it('returns all proposals when category is all', () => {
    const proposals = [
      createMockProposal({ id: 1, category: 'development' }),
      createMockProposal({ id: 2, category: 'design' }),
    ];
    
    const result = filterProposalsByCategory(proposals, 'all');
    expect(result).toHaveLength(2);
  });

  it('filters by specific category', () => {
    const proposals = [
      createMockProposal({ id: 1, category: 'development' }),
      createMockProposal({ id: 2, category: 'design' }),
      createMockProposal({ id: 3, category: 'development' }),
    ];
    
    const result = filterProposalsByCategory(proposals, 'development');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === 'development')).toBe(true);
  });
});

describe('searchProposals', () => {
  it('returns all proposals when search is empty', () => {
    const proposals = [
      createMockProposal({ id: 1 }),
      createMockProposal({ id: 2 }),
    ];
    
    const result = searchProposals(proposals, '');
    expect(result).toHaveLength(2);
  });

  it('searches in title', () => {
    const proposals = [
      createMockProposal({ id: 1, title: 'Build Dashboard' }),
      createMockProposal({ id: 2, title: 'Design Logo' }),
    ];
    
    const result = searchProposals(proposals, 'dashboard');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('searches in description', () => {
    const proposals = [
      createMockProposal({ id: 1, description: 'Create analytics dashboard' }),
      createMockProposal({ id: 2, description: 'Design new logo' }),
    ];
    
    const result = searchProposals(proposals, 'analytics');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('is case insensitive', () => {
    const proposals = [
      createMockProposal({ id: 1, title: 'Build Dashboard' }),
    ];
    
    const result = searchProposals(proposals, 'DASHBOARD');
    expect(result).toHaveLength(1);
  });
});

describe('applyProposalFilters', () => {
  it('applies no filters when all are set to default', () => {
    const proposals = [
      createMockProposal({ id: 1 }),
      createMockProposal({ id: 2 }),
    ];
    
    const result = applyProposalFilters(proposals, {
      status: 'all',
      category: 'all',
      search: '',
      currentBlockHeight: 1100,
    });
    
    expect(result).toHaveLength(2);
  });

  it('applies status filter only', () => {
    const proposals = [
      createMockProposal({ id: 1 }),
      createMockProposal({ id: 2, executed: true }),
    ];
    
    const result = applyProposalFilters(proposals, {
      status: 'executed',
      currentBlockHeight: 1100,
    });
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('applies category filter only', () => {
    const proposals = [
      createMockProposal({ id: 1, category: 'development' }),
      createMockProposal({ id: 2, category: 'design' }),
    ];
    
    const result = applyProposalFilters(proposals, {
      category: 'development',
      currentBlockHeight: 1100,
    });
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('applies search filter only', () => {
    const proposals = [
      createMockProposal({ id: 1, title: 'Build Dashboard' }),
      createMockProposal({ id: 2, title: 'Design Logo' }),
    ];
    
    const result = applyProposalFilters(proposals, {
      search: 'dashboard',
      currentBlockHeight: 1100,
    });
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('applies multiple filters together', () => {
    const proposals = [
      createMockProposal({ id: 1, category: 'development', title: 'Build Dashboard' }),
      createMockProposal({ id: 2, category: 'development', title: 'Design Logo' }),
      createMockProposal({ id: 3, category: 'design', title: 'Build Dashboard' }),
    ];
    
    const result = applyProposalFilters(proposals, {
      category: 'development',
      search: 'dashboard',
      currentBlockHeight: 1100,
    });
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});

describe('edge cases', () => {
  it('handles empty proposal array in filterProposalsByStatus', () => {
    const result = filterProposalsByStatus([], 'active', 1100);
    expect(result).toHaveLength(0);
  });

  it('handles empty proposal array in filterProposalsByCategory', () => {
    const result = filterProposalsByCategory([], 'development');
    expect(result).toHaveLength(0);
  });

  it('handles empty proposal array in searchProposals', () => {
    const result = searchProposals([], 'test');
    expect(result).toHaveLength(0);
  });

  it('handles empty proposal array in applyProposalFilters', () => {
    const result = applyProposalFilters([], {
      status: 'active',
      category: 'development',
      search: 'test',
      currentBlockHeight: 1100,
    });
    expect(result).toHaveLength(0);
  });
});

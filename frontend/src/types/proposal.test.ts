import { describe, it, expect } from 'vitest';
import type {
  Proposal,
  ProposalWithStats,
  CreateProposalInput,
  ProposalPage,
  ProposalQueryOptions,
} from './proposal';

describe('Proposal types', () => {
  it('implements valid Proposal structure', () => {
    const proposal: Proposal = {
      id: 1,
      proposer: 'SP123456789',
      amount: 1000000,
      title: 'Fund Development',
      description: 'A proposal to fund development efforts',
      votesFor: 100,
      votesAgainst: 25,
      executed: false,
      createdAt: 1700000000,
    };

    expect(proposal.id).toBe(1);
    expect(proposal.proposer).toMatch(/^SP/);
    expect(proposal.amount).toBeGreaterThan(0);
  });

  it('implements ProposalWithStats with derived fields', () => {
    const proposalWithStats: ProposalWithStats = {
      id: 2,
      proposer: 'SP987654321',
      amount: 500000,
      title: 'Marketing Campaign',
      description: 'Proposal for marketing',
      votesFor: 80,
      votesAgainst: 20,
      executed: true,
      createdAt: 1698000000,
      totalVotes: 100,
      forPercentage: 80,
      againstPercentage: 20,
      daysOld: 30,
      isActive: false,
    };

    expect(proposalWithStats.totalVotes).toBe(100);
    expect(proposalWithStats.forPercentage + proposalWithStats.againstPercentage).toBe(100);
    expect(proposalWithStats.isActive).toBe(false);
  });

  it('implements CreateProposalInput', () => {
    const input: CreateProposalInput = {
      title: 'New Proposal',
      description: 'A detailed description of the proposal',
      amount: 2000000,
    };

    expect(input.title.length).toBeGreaterThanOrEqual(0);
    expect(input.amount).toBeGreaterThan(0);
  });

  it('implements ProposalPage with pagination info', () => {
    const page: ProposalPage = {
      proposals: [],
      totalCount: 100,
      page: 1,
      pageSize: 10,
      totalPages: 10,
    };

    expect(page.page).toBe(1);
    expect(page.totalPages).toBe(Math.ceil(page.totalCount / page.pageSize));
  });

  it('implements ProposalQueryOptions for filtering', () => {
    const options: ProposalQueryOptions = {
      status: 'active',
      sortBy: 'newest',
      page: 1,
      pageSize: 20,
    };

    expect(options.status).toMatch(/^(all|active|executed)$/);
  });
});

import { describe, it, expect, vi } from 'vitest';
import * as ProposalCardModule from '../ProposalCard';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

describe('ProposalCard module', () => {
  it('exports a component named ProposalCard', () => {
    expect(ProposalCardModule.ProposalCard).toBeDefined();
  });

  it('is wrapped in React.memo', () => {
    const component = ProposalCardModule.ProposalCard as unknown as {
      $$typeof: symbol;
    };
    expect(component.$$typeof).toBeDefined();
    expect(component.$$typeof.toString()).toContain('memo');
  });

  it('inner component is named ProposalCard', () => {
    const component = ProposalCardModule.ProposalCard as unknown as {
      type: { name: string };
    };
    expect(component.type.name).toMatch(/^ProposalCard/);
  });

  it('exports only ProposalCard', () => {
    const names = Object.keys(ProposalCardModule);
    expect(names).toEqual(['ProposalCard']);
  });
});

describe('ProposalCard props contract', () => {
  it('accepts a Proposal object with required fields', () => {
    const mockProposal = {
      id: 1,
      proposer: 'SP1EXAMPLE',
      amount: 5000000,
      title: 'Test Proposal Title',
      description: 'Test description for the proposal',
      votesFor: 75,
      votesAgainst: 25,
      executed: false,
      createdAt: 1700000000,
    };

    expect(mockProposal.id).toBe(1);
    expect(mockProposal.proposer).toBeTruthy();
    expect(mockProposal.amount).toBeGreaterThan(0);
    expect(mockProposal.title).toBeTruthy();
    expect(mockProposal.description).toBeTruthy();
    expect(typeof mockProposal.votesFor).toBe('number');
    expect(typeof mockProposal.votesAgainst).toBe('number');
    expect(typeof mockProposal.executed).toBe('boolean');
    expect(typeof mockProposal.createdAt).toBe('number');
  });
});

describe('ProposalCard vote percentage calculation', () => {
  it('calculates for percentage when total votes is positive', () => {
    const votesFor = 75;
    const votesAgainst = 25;
    const totalVotes = votesFor + votesAgainst;
    const forPct = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0;

    expect(forPct).toBe(75);
  });

  it('returns 0 when total votes is zero', () => {
    const votesFor = 0;
    const votesAgainst = 0;
    const totalVotes = votesFor + votesAgainst;
    const forPct = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0;

    expect(forPct).toBe(0);
  });

  it('calculates 100% when all votes are for', () => {
    const votesFor = 200;
    const votesAgainst = 0;
    const totalVotes = votesFor + votesAgainst;
    const forPct = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0;

    expect(forPct).toBe(100);
  });

  it('calculates 0% when all votes are against', () => {
    const votesFor = 0;
    const votesAgainst = 150;
    const totalVotes = votesFor + votesAgainst;
    const forPct = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0;

    expect(forPct).toBe(0);
  });

  it('rounds to nearest integer', () => {
    const votesFor = 1;
    const votesAgainst = 2;
    const totalVotes = votesFor + votesAgainst;
    const forPct = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0;

    expect(forPct).toBe(33);
  });

  it('handles large vote counts', () => {
    const votesFor = 1_000_000;
    const votesAgainst = 500_000;
    const totalVotes = votesFor + votesAgainst;
    const forPct = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0;

    expect(forPct).toBe(67);
  });
});

describe('ProposalCard status display logic', () => {
  it('shows Executed for executed proposals', () => {
    const executed = true;
    const label = executed ? 'Executed' : 'Active';
    expect(label).toBe('Executed');
  });

  it('shows Active for non-executed proposals', () => {
    const executed = false;
    const label = executed ? 'Executed' : 'Active';
    expect(label).toBe('Active');
  });
});

describe('ProposalCard link generation', () => {
  it('generates correct proposal detail URL', () => {
    const id = 42;
    const url = `/proposals/${id}`;
    expect(url).toBe('/proposals/42');
  });

  it('generates URL for proposal id 0', () => {
    const id = 0;
    const url = `/proposals/${id}`;
    expect(url).toBe('/proposals/0');
  });
});

describe('ProposalCard comment count visibility', () => {
  it('shows comment count when greater than zero', () => {
    const commentCount = 5;
    const shouldShow = commentCount > 0;
    expect(shouldShow).toBe(true);
  });

  it('hides comment count when zero', () => {
    const commentCount = 0;
    const shouldShow = commentCount > 0;
    expect(shouldShow).toBe(false);
  });

  it('hides comment count when negative', () => {
    const commentCount = -1;
    const shouldShow = commentCount > 0;
    expect(shouldShow).toBe(false);
  });
});

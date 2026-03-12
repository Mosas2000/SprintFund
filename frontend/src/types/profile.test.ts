import { describe, it, expect } from 'vitest';
import type {
  ActivityEventType,
  ActivityEvent,
  ProfileStats,
  VoteRecord,
  UserProfile,
  ProfileLoadingState,
  ProfileTab,
  ProfileHeaderProps,
  ProfileStatsGridProps,
  UserProposalsProps,
  VotingHistoryProps,
  ActivityTimelineProps,
} from './profile';

/**
 * Type-level tests for profile types. Since TypeScript types are erased
 * at runtime, these tests validate that the type contracts are satisfied
 * by representative values and that discriminants work as expected.
 */

describe('ActivityEventType', () => {
  it('accepts all valid event types', () => {
    const types: ActivityEventType[] = [
      'proposal_created',
      'vote_cast',
      'stake_deposited',
      'stake_withdrawn',
      'proposal_executed',
    ];
    expect(types).toHaveLength(5);
    expect(new Set(types).size).toBe(5);
  });
});

describe('ActivityEvent', () => {
  it('creates a minimal event without optional fields', () => {
    const event: ActivityEvent = {
      id: 'evt-1',
      type: 'vote_cast',
      label: 'Voted For: Test Proposal',
      timestamp: 1710000000000,
    };
    expect(event.id).toBe('evt-1');
    expect(event.type).toBe('vote_cast');
    expect(event.description).toBeUndefined();
    expect(event.proposalId).toBeUndefined();
    expect(event.amount).toBeUndefined();
    expect(event.txId).toBeUndefined();
  });

  it('creates a full event with all optional fields', () => {
    const event: ActivityEvent = {
      id: 'evt-2',
      type: 'proposal_created',
      label: 'Created proposal: My Proposal',
      description: 'Requested 100 STX',
      timestamp: 1710000000000,
      proposalId: 5,
      amount: 100_000_000,
      txId: '0xabc123',
    };
    expect(event.proposalId).toBe(5);
    expect(event.amount).toBe(100_000_000);
    expect(event.txId).toBe('0xabc123');
    expect(event.description).toBe('Requested 100 STX');
  });
});

describe('ProfileStats', () => {
  it('has all required numeric fields', () => {
    const stats: ProfileStats = {
      stxBalance: 1_000_000_000,
      stakedAmount: 500_000_000,
      proposalsCreated: 3,
      proposalsExecuted: 1,
      totalVotesCast: 10,
      totalComments: 5,
      totalVoteWeight: 25,
      votingParticipationRate: 67,
    };
    expect(stats.stxBalance).toBe(1_000_000_000);
    expect(stats.stakedAmount).toBe(500_000_000);
    expect(stats.proposalsCreated).toBe(3);
    expect(stats.proposalsExecuted).toBe(1);
    expect(stats.totalVotesCast).toBe(10);
    expect(stats.totalComments).toBe(5);
    expect(stats.totalVoteWeight).toBe(25);
    expect(stats.votingParticipationRate).toBe(67);
  });

  it('allows zero values for all fields', () => {
    const stats: ProfileStats = {
      stxBalance: 0,
      stakedAmount: 0,
      proposalsCreated: 0,
      proposalsExecuted: 0,
      totalVotesCast: 0,
      totalComments: 0,
      totalVoteWeight: 0,
      votingParticipationRate: 0,
    };
    expect(Object.values(stats).every((v) => v === 0)).toBe(true);
  });
});

describe('VoteRecord', () => {
  it('creates a for vote record', () => {
    const record: VoteRecord = {
      proposalId: 1,
      title: 'Test Proposal',
      support: true,
      weight: 3,
      timestamp: 1710000000000,
      executed: false,
    };
    expect(record.support).toBe(true);
    expect(record.weight).toBe(3);
    expect(record.executed).toBe(false);
  });

  it('creates an against vote record', () => {
    const record: VoteRecord = {
      proposalId: 2,
      title: 'Another Proposal',
      support: false,
      weight: 1,
      timestamp: 1710000000000,
      executed: true,
    };
    expect(record.support).toBe(false);
    expect(record.executed).toBe(true);
  });
});

describe('UserProfile', () => {
  it('creates a complete user profile', () => {
    const profile: UserProfile = {
      address: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T',
      stats: {
        stxBalance: 100_000_000,
        stakedAmount: 50_000_000,
        proposalsCreated: 2,
        proposalsExecuted: 1,
        totalVotesCast: 5,
        totalComments: 3,
        totalVoteWeight: 10,
        votingParticipationRate: 50,
      },
      proposals: [],
      votes: [],
      activity: [],
    };
    expect(profile.address).toBe('SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T');
    expect(profile.proposals).toEqual([]);
    expect(profile.votes).toEqual([]);
    expect(profile.activity).toEqual([]);
  });
});

describe('ProfileLoadingState', () => {
  it('accepts all valid loading states', () => {
    const states: ProfileLoadingState[] = ['idle', 'loading', 'error', 'success'];
    expect(states).toHaveLength(4);
  });
});

describe('ProfileTab', () => {
  it('accepts all valid tab identifiers', () => {
    const tabs: ProfileTab[] = ['overview', 'proposals', 'votes', 'activity'];
    expect(tabs).toHaveLength(4);
  });
});

describe('Component prop interfaces', () => {
  it('ProfileHeaderProps has address and balance fields', () => {
    const props: ProfileHeaderProps = {
      address: 'SP123',
      stxBalance: 100,
      stakedAmount: 50,
    };
    expect(props.address).toBe('SP123');
    expect(props.stxBalance).toBe(100);
    expect(props.stakedAmount).toBe(50);
  });

  it('ProfileStatsGridProps has stats field', () => {
    const props: ProfileStatsGridProps = {
      stats: {
        stxBalance: 0,
        stakedAmount: 0,
        proposalsCreated: 0,
        proposalsExecuted: 0,
        totalVotesCast: 0,
        totalComments: 0,
        totalVoteWeight: 0,
        votingParticipationRate: 0,
      },
    };
    expect(props.stats).toBeDefined();
  });

  it('UserProposalsProps has proposals array', () => {
    const props: UserProposalsProps = { proposals: [] };
    expect(props.proposals).toEqual([]);
  });

  it('VotingHistoryProps has votes array', () => {
    const props: VotingHistoryProps = { votes: [] };
    expect(props.votes).toEqual([]);
  });

  it('ActivityTimelineProps has activity array', () => {
    const props: ActivityTimelineProps = { activity: [] };
    expect(props.activity).toEqual([]);
  });
});

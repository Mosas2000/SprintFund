import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUserProfile, saveVoteRecord, getLocalVoteHistory } from '../lib/profile-data';
import type { VoteRecord } from '../types/profile';

/**
 * End-to-end integration tests simulating real user scenarios
 * through the profile data system.
 */

/* ── localStorage mock ────────────────────────── */

const mockStorage = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { mockStorage.set(key, value); }),
  removeItem: vi.fn((key: string) => { mockStorage.delete(key); }),
  clear: vi.fn(() => { mockStorage.clear(); }),
  get length() { return mockStorage.size; },
  key: vi.fn(() => null),
};

/* ── Module mocks ─────────────────────────────── */

vi.mock('../lib/stacks', () => ({
  getStake: vi.fn().mockResolvedValue(50_000_000),
  getAllProposals: vi.fn().mockResolvedValue([]),
}));

vi.mock('../lib/api', () => ({
  getStxBalance: vi.fn().mockResolvedValue(200_000_000),
}));

beforeEach(async () => {
  mockStorage.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  const stacks = await import('../lib/stacks');
  vi.mocked(stacks.getStake).mockResolvedValue(50_000_000);
  vi.mocked(stacks.getAllProposals).mockResolvedValue([]);
  const api = await import('../lib/api');
  vi.mocked(api.getStxBalance).mockResolvedValue(200_000_000);
});

afterEach(() => {
  vi.restoreAllMocks();
  mockStorage.clear();
});

describe('Profile integration scenarios', () => {
  describe('new user with no activity', () => {
    it('displays empty profile with zero stats', async () => {
      const profile = await fetchUserProfile('SP_NEW_USER');

      expect(profile.address).toBe('SP_NEW_USER');
      expect(profile.stats.stxBalance).toBe(200_000_000);
      expect(profile.stats.stakedAmount).toBe(50_000_000);
      expect(profile.stats.proposalsCreated).toBe(0);
      expect(profile.stats.proposalsExecuted).toBe(0);
      expect(profile.stats.totalVotesCast).toBe(0);
      expect(profile.stats.totalVoteWeight).toBe(0);
      expect(profile.stats.votingParticipationRate).toBe(0);
      expect(profile.proposals).toEqual([]);
      expect(profile.votes).toEqual([]);
      expect(profile.activity).toEqual([]);
    });
  });

  describe('active user with proposals and votes', () => {
    it('shows full activity for proposal creator who votes', async () => {
      const { getAllProposals } = await import('../lib/stacks');
      vi.mocked(getAllProposals).mockResolvedValueOnce([
        { id: 1, proposer: 'SP_ACTIVE', amount: 10_000_000, title: 'Build CLI', description: 'CLI tools', votesFor: 8, votesAgainst: 2, executed: true, createdAt: 1000 },
        { id: 2, proposer: 'SP_ACTIVE', amount: 5_000_000, title: 'Write Docs', description: 'Documentation', votesFor: 3, votesAgainst: 5, executed: false, createdAt: 2000 },
        { id: 3, proposer: 'SP_OTHER', amount: 20_000_000, title: 'Other Project', description: '', votesFor: 10, votesAgainst: 1, executed: true, createdAt: 3000 },
      ]);

      // User voted on proposal 3
      saveVoteRecord('SP_ACTIVE', {
        proposalId: 3, title: 'Other Project', support: true, weight: 4, timestamp: 3500, executed: false,
      });

      const profile = await fetchUserProfile('SP_ACTIVE');

      // Stats
      expect(profile.stats.proposalsCreated).toBe(2);
      expect(profile.stats.proposalsExecuted).toBe(1);
      expect(profile.stats.totalVotesCast).toBe(1);
      expect(profile.stats.totalVoteWeight).toBe(4);
      expect(profile.stats.votingParticipationRate).toBe(33); // 1/3

      // Proposals filtered to user
      expect(profile.proposals).toHaveLength(2);
      expect(profile.proposals.every((p) => p.proposer === 'SP_ACTIVE')).toBe(true);

      // Votes
      expect(profile.votes).toHaveLength(1);
      expect(profile.votes[0].proposalId).toBe(3);

      // Activity: 2 proposal_created + 1 proposal_executed + 1 vote_cast = 4
      expect(profile.activity.length).toBe(4);
    });
  });

  describe('whale voter with many votes', () => {
    it('correctly computes stats for heavy voter', async () => {
      const { getAllProposals } = await import('../lib/stacks');
      const proposals = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        proposer: 'SP_OTHER',
        amount: 1_000_000,
        title: `Proposal ${i + 1}`,
        description: '',
        votesFor: 5,
        votesAgainst: 2,
        executed: i < 3,
        createdAt: (i + 1) * 1000,
      }));
      vi.mocked(getAllProposals).mockResolvedValueOnce(proposals);

      // User voted on 8 of 10 proposals
      const votes: VoteRecord[] = Array.from({ length: 8 }, (_, i) => ({
        proposalId: i + 1,
        title: `Proposal ${i + 1}`,
        support: i % 2 === 0,
        weight: 5,
        timestamp: (i + 1) * 1000 + 500,
        executed: false,
      }));

      for (const v of votes) {
        saveVoteRecord('SP_WHALE', v);
      }

      const profile = await fetchUserProfile('SP_WHALE');

      expect(profile.stats.totalVotesCast).toBe(8);
      expect(profile.stats.totalVoteWeight).toBe(40); // 8 * 5
      expect(profile.stats.votingParticipationRate).toBe(80); // 8/10
      expect(profile.stats.proposalsCreated).toBe(0);
      expect(profile.votes).toHaveLength(8);
    });
  });

  describe('vote then profile refresh', () => {
    it('new vote appears in profile after refresh', async () => {
      // Initial profile load
      let profile = await fetchUserProfile('SP_VOTER');
      expect(profile.votes).toHaveLength(0);

      // User votes
      saveVoteRecord('SP_VOTER', {
        proposalId: 1, title: 'New Vote', support: true, weight: 2, timestamp: 5000, executed: false,
      });

      // Reset mock for second call
      const stacks = await import('../lib/stacks');
      vi.mocked(stacks.getAllProposals).mockResolvedValueOnce([]);

      // Refresh profile
      profile = await fetchUserProfile('SP_VOTER');
      expect(profile.votes).toHaveLength(1);
      expect(profile.stats.totalVotesCast).toBe(1);
      expect(profile.activity.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('activity timeline ordering', () => {
    it('interleaves proposals and votes by timestamp', async () => {
      const { getAllProposals } = await import('../lib/stacks');
      vi.mocked(getAllProposals).mockResolvedValueOnce([
        { id: 1, proposer: 'SP_USER', amount: 1000, title: 'Early Proposal', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 1000 },
        { id: 2, proposer: 'SP_USER', amount: 2000, title: 'Late Proposal', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 5000 },
      ]);

      saveVoteRecord('SP_USER', {
        proposalId: 10, title: 'Middle Vote', support: true, weight: 1, timestamp: 3000, executed: false,
      });

      const profile = await fetchUserProfile('SP_USER');

      // Activity should be sorted descending by timestamp
      for (let i = 1; i < profile.activity.length; i++) {
        expect(profile.activity[i - 1].timestamp).toBeGreaterThanOrEqual(
          profile.activity[i].timestamp,
        );
      }

      // Late Proposal (5000) should be first
      expect(profile.activity[0].label).toContain('Late Proposal');
    });
  });

  describe('comment count pass-through', () => {
    it('includes comment count from external source', async () => {
      const profile = await fetchUserProfile('SP_COMMENTER', 25);
      expect(profile.stats.totalComments).toBe(25);
    });
  });
});

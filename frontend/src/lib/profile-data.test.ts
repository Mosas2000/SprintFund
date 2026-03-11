import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLocalVoteHistory, saveVoteRecord, fetchUserProfile } from './profile-data';
import type { VoteRecord } from '../types/profile';

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

vi.mock('./stacks', () => ({
  getStake: vi.fn().mockResolvedValue(10_000_000),
  getAllProposals: vi.fn().mockResolvedValue([]),
}));

vi.mock('./api', () => ({
  getStxBalance: vi.fn().mockResolvedValue(100_000_000),
}));

/* ── Setup / teardown ─────────────────────────── */

beforeEach(async () => {
  mockStorage.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  // Reset mock implementations (restoreAllMocks clears them)
  const stacks = await import('./stacks');
  vi.mocked(stacks.getStake).mockResolvedValue(10_000_000);
  vi.mocked(stacks.getAllProposals).mockResolvedValue([]);
  const api = await import('./api');
  vi.mocked(api.getStxBalance).mockResolvedValue(100_000_000);
});

afterEach(() => {
  vi.restoreAllMocks();
  mockStorage.clear();
});

/* ── getLocalVoteHistory ──────────────────────── */

describe('getLocalVoteHistory', () => {
  it('returns empty array when no votes stored', () => {
    const result = getLocalVoteHistory('SP123');
    expect(result).toEqual([]);
  });

  it('returns empty array when stored value is null', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    expect(getLocalVoteHistory('SP123')).toEqual([]);
  });

  it('returns parsed vote records from storage', () => {
    const votes: VoteRecord[] = [
      { proposalId: 1, title: 'Test', support: true, weight: 2, timestamp: 1000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(votes));

    const result = getLocalVoteHistory('SP123');
    expect(result).toHaveLength(1);
    expect(result[0].proposalId).toBe(1);
    expect(result[0].support).toBe(true);
  });

  it('returns empty array when stored value is not an array', () => {
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify({ not: 'array' }));
    expect(getLocalVoteHistory('SP123')).toEqual([]);
  });

  it('returns empty array when stored value is invalid JSON', () => {
    mockStorage.set('sprintfund-votes-SP123', 'not-json');
    expect(getLocalVoteHistory('SP123')).toEqual([]);
  });

  it('uses address-specific storage key', () => {
    const votesA: VoteRecord[] = [
      { proposalId: 1, title: 'A', support: true, weight: 1, timestamp: 1000, executed: false },
    ];
    const votesB: VoteRecord[] = [
      { proposalId: 2, title: 'B', support: false, weight: 3, timestamp: 2000, executed: true },
    ];
    mockStorage.set('sprintfund-votes-SP_A', JSON.stringify(votesA));
    mockStorage.set('sprintfund-votes-SP_B', JSON.stringify(votesB));

    const resultA = getLocalVoteHistory('SP_A');
    expect(resultA).toHaveLength(1);
    expect(resultA[0].proposalId).toBe(1);

    const resultB = getLocalVoteHistory('SP_B');
    expect(resultB).toHaveLength(1);
    expect(resultB[0].proposalId).toBe(2);
  });
});

/* ── saveVoteRecord ───────────────────────────── */

describe('saveVoteRecord', () => {
  const sampleRecord: VoteRecord = {
    proposalId: 5,
    title: 'Fund UI overhaul',
    support: true,
    weight: 3,
    timestamp: 1710000000000,
    executed: false,
  };

  it('saves a vote record to localStorage', () => {
    saveVoteRecord('SP123', sampleRecord);

    const stored = mockStorage.get('sprintfund-votes-SP123');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].proposalId).toBe(5);
  });

  it('appends to existing records', () => {
    const existing: VoteRecord[] = [
      { proposalId: 1, title: 'Existing', support: false, weight: 1, timestamp: 1000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(existing));

    saveVoteRecord('SP123', sampleRecord);

    const stored = JSON.parse(mockStorage.get('sprintfund-votes-SP123')!);
    expect(stored).toHaveLength(2);
    expect(stored[0].proposalId).toBe(1);
    expect(stored[1].proposalId).toBe(5);
  });

  it('prevents duplicate votes for same proposal', () => {
    saveVoteRecord('SP123', sampleRecord);
    saveVoteRecord('SP123', { ...sampleRecord, support: false });

    const stored = JSON.parse(mockStorage.get('sprintfund-votes-SP123')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].support).toBe(true); // Original kept
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    // Should not throw
    expect(() => saveVoteRecord('SP123', sampleRecord)).not.toThrow();
  });
});

/* ── fetchUserProfile ─────────────────────────── */

describe('fetchUserProfile', () => {
  it('returns a profile with basic stats when no proposals exist', async () => {
    const profile = await fetchUserProfile('SP123');

    expect(profile.address).toBe('SP123');
    expect(profile.stats.stxBalance).toBe(100_000_000);
    expect(profile.stats.stakedAmount).toBe(10_000_000);
    expect(profile.stats.proposalsCreated).toBe(0);
    expect(profile.stats.proposalsExecuted).toBe(0);
    expect(profile.stats.totalVotesCast).toBe(0);
    expect(profile.proposals).toEqual([]);
    expect(profile.votes).toEqual([]);
    expect(profile.activity).toEqual([]);
  });

  it('filters proposals by address', async () => {
    const { getAllProposals } = await import('./stacks');
    const mockGetAll = vi.mocked(getAllProposals);
    mockGetAll.mockResolvedValueOnce([
      { id: 1, proposer: 'SP123', amount: 1000, title: 'Mine', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 1000 },
      { id: 2, proposer: 'SP999', amount: 2000, title: 'Others', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 2000 },
    ]);

    const profile = await fetchUserProfile('SP123');
    expect(profile.proposals).toHaveLength(1);
    expect(profile.proposals[0].id).toBe(1);
    expect(profile.stats.proposalsCreated).toBe(1);
  });

  it('counts executed proposals correctly', async () => {
    const { getAllProposals } = await import('./stacks');
    const mockGetAll = vi.mocked(getAllProposals);
    mockGetAll.mockResolvedValueOnce([
      { id: 1, proposer: 'SP123', amount: 1000, title: 'Executed', description: '', votesFor: 10, votesAgainst: 0, executed: true, createdAt: 1000 },
      { id: 2, proposer: 'SP123', amount: 2000, title: 'Active', description: '', votesFor: 5, votesAgainst: 3, executed: false, createdAt: 2000 },
    ]);

    const profile = await fetchUserProfile('SP123');
    expect(profile.stats.proposalsExecuted).toBe(1);
    expect(profile.stats.proposalsCreated).toBe(2);
  });

  it('includes vote records from localStorage in stats', async () => {
    const votes: VoteRecord[] = [
      { proposalId: 1, title: 'A', support: true, weight: 3, timestamp: 1000, executed: false },
      { proposalId: 2, title: 'B', support: false, weight: 2, timestamp: 2000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(votes));

    const profile = await fetchUserProfile('SP123');
    expect(profile.stats.totalVotesCast).toBe(2);
    expect(profile.stats.totalVoteWeight).toBe(5);
    expect(profile.votes).toHaveLength(2);
  });

  it('computes participation rate correctly', async () => {
    const { getAllProposals } = await import('./stacks');
    const mockGetAll = vi.mocked(getAllProposals);
    mockGetAll.mockResolvedValueOnce([
      { id: 1, proposer: 'SP999', amount: 1000, title: 'P1', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 1000 },
      { id: 2, proposer: 'SP999', amount: 2000, title: 'P2', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 2000 },
      { id: 3, proposer: 'SP999', amount: 3000, title: 'P3', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 3000 },
      { id: 4, proposer: 'SP999', amount: 4000, title: 'P4', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 4000 },
    ]);

    const votes: VoteRecord[] = [
      { proposalId: 1, title: 'P1', support: true, weight: 1, timestamp: 1000, executed: false },
      { proposalId: 3, title: 'P3', support: true, weight: 1, timestamp: 3000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(votes));

    const profile = await fetchUserProfile('SP123');
    expect(profile.stats.votingParticipationRate).toBe(50);
  });

  it('caps participation rate at 100 percent', async () => {
    // If somehow user has more votes than proposals (edge case with localStorage)
    const votes: VoteRecord[] = [
      { proposalId: 1, title: 'A', support: true, weight: 1, timestamp: 1000, executed: false },
      { proposalId: 2, title: 'B', support: true, weight: 1, timestamp: 2000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(votes));

    // Only one proposal exists on-chain
    const { getAllProposals } = await import('./stacks');
    vi.mocked(getAllProposals).mockResolvedValueOnce([
      { id: 1, proposer: 'SP999', amount: 1000, title: 'A', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 1000 },
    ]);

    const profile = await fetchUserProfile('SP123');
    expect(profile.stats.votingParticipationRate).toBeLessThanOrEqual(100);
  });

  it('accepts a comment count parameter', async () => {
    const profile = await fetchUserProfile('SP123', 42);
    expect(profile.stats.totalComments).toBe(42);
  });

  it('defaults comment count to zero', async () => {
    const profile = await fetchUserProfile('SP123');
    expect(profile.stats.totalComments).toBe(0);
  });

  it('builds activity events from proposals and votes', async () => {
    const { getAllProposals } = await import('./stacks');
    vi.mocked(getAllProposals).mockResolvedValueOnce([
      { id: 1, proposer: 'SP123', amount: 1_000_000, title: 'My Proposal', description: '', votesFor: 5, votesAgainst: 2, executed: true, createdAt: 1000 },
    ]);

    const votes: VoteRecord[] = [
      { proposalId: 2, title: 'Other Proposal', support: true, weight: 2, timestamp: 3000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(votes));

    const profile = await fetchUserProfile('SP123');

    // Should have: proposal_created, proposal_executed, vote_cast
    expect(profile.activity.length).toBeGreaterThanOrEqual(3);

    const types = profile.activity.map((a) => a.type);
    expect(types).toContain('proposal_created');
    expect(types).toContain('proposal_executed');
    expect(types).toContain('vote_cast');
  });

  it('sorts activity events by timestamp descending', async () => {
    const { getAllProposals } = await import('./stacks');
    vi.mocked(getAllProposals).mockResolvedValueOnce([
      { id: 1, proposer: 'SP123', amount: 1000, title: 'Old Proposal', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 1000 },
      { id: 2, proposer: 'SP123', amount: 2000, title: 'New Proposal', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 5000 },
    ]);

    const profile = await fetchUserProfile('SP123');

    for (let i = 1; i < profile.activity.length; i++) {
      expect(profile.activity[i - 1].timestamp).toBeGreaterThanOrEqual(
        profile.activity[i].timestamp,
      );
    }
  });

  it('each activity event has a unique id', async () => {
    const { getAllProposals } = await import('./stacks');
    vi.mocked(getAllProposals).mockResolvedValueOnce([
      { id: 1, proposer: 'SP123', amount: 1000, title: 'P1', description: '', votesFor: 0, votesAgainst: 0, executed: true, createdAt: 1000 },
    ]);

    const votes: VoteRecord[] = [
      { proposalId: 2, title: 'P2', support: true, weight: 1, timestamp: 2000, executed: false },
    ];
    mockStorage.set('sprintfund-votes-SP123', JSON.stringify(votes));

    const profile = await fetchUserProfile('SP123');
    const ids = profile.activity.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

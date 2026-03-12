import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLocalVoteHistory, saveVoteRecord } from '../lib/profile-data';
import type { VoteRecord } from '../types/profile';

/**
 * Integration tests for the vote record storage system.
 * Tests the complete flow of saving and retrieving vote records,
 * edge cases around storage limits, and data integrity.
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

beforeEach(() => {
  mockStorage.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  mockStorage.clear();
});

describe('Vote record integration', () => {
  describe('save then retrieve flow', () => {
    it('saves a vote and retrieves it', () => {
      const record: VoteRecord = {
        proposalId: 1,
        title: 'Fund SDK',
        support: true,
        weight: 3,
        timestamp: 1710000000000,
        executed: false,
      };

      saveVoteRecord('SP123', record);
      const result = getLocalVoteHistory('SP123');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(record);
    });

    it('saves multiple votes and retrieves all', () => {
      const votes: VoteRecord[] = [
        { proposalId: 1, title: 'A', support: true, weight: 1, timestamp: 1000, executed: false },
        { proposalId: 2, title: 'B', support: false, weight: 2, timestamp: 2000, executed: false },
        { proposalId: 3, title: 'C', support: true, weight: 3, timestamp: 3000, executed: true },
      ];

      for (const v of votes) {
        saveVoteRecord('SP123', v);
      }

      const result = getLocalVoteHistory('SP123');
      expect(result).toHaveLength(3);
      expect(result[0].proposalId).toBe(1);
      expect(result[1].proposalId).toBe(2);
      expect(result[2].proposalId).toBe(3);
    });
  });

  describe('multi-address isolation', () => {
    it('votes from different addresses are isolated', () => {
      saveVoteRecord('SP_ALICE', {
        proposalId: 1, title: 'Alice Vote', support: true, weight: 5, timestamp: 1000, executed: false,
      });
      saveVoteRecord('SP_BOB', {
        proposalId: 1, title: 'Bob Vote', support: false, weight: 2, timestamp: 2000, executed: false,
      });

      const aliceVotes = getLocalVoteHistory('SP_ALICE');
      const bobVotes = getLocalVoteHistory('SP_BOB');

      expect(aliceVotes).toHaveLength(1);
      expect(aliceVotes[0].support).toBe(true);
      expect(aliceVotes[0].weight).toBe(5);

      expect(bobVotes).toHaveLength(1);
      expect(bobVotes[0].support).toBe(false);
      expect(bobVotes[0].weight).toBe(2);
    });

    it('clearing one address does not affect another', () => {
      saveVoteRecord('SP_ALICE', {
        proposalId: 1, title: 'X', support: true, weight: 1, timestamp: 1000, executed: false,
      });
      saveVoteRecord('SP_BOB', {
        proposalId: 2, title: 'Y', support: true, weight: 1, timestamp: 2000, executed: false,
      });

      mockStorage.delete('sprintfund-votes-SP_ALICE');

      expect(getLocalVoteHistory('SP_ALICE')).toHaveLength(0);
      expect(getLocalVoteHistory('SP_BOB')).toHaveLength(1);
    });
  });

  describe('duplicate prevention', () => {
    it('does not add duplicate vote for same proposal', () => {
      const record: VoteRecord = {
        proposalId: 5, title: 'Test', support: true, weight: 3, timestamp: 1000, executed: false,
      };

      saveVoteRecord('SP123', record);
      saveVoteRecord('SP123', record);
      saveVoteRecord('SP123', { ...record, support: false, weight: 1 });

      const result = getLocalVoteHistory('SP123');
      expect(result).toHaveLength(1);
      expect(result[0].support).toBe(true); // Original preserved
      expect(result[0].weight).toBe(3);
    });

    it('allows votes for different proposals', () => {
      saveVoteRecord('SP123', {
        proposalId: 1, title: 'A', support: true, weight: 1, timestamp: 1000, executed: false,
      });
      saveVoteRecord('SP123', {
        proposalId: 2, title: 'B', support: false, weight: 2, timestamp: 2000, executed: false,
      });

      const result = getLocalVoteHistory('SP123');
      expect(result).toHaveLength(2);
    });
  });

  describe('data integrity', () => {
    it('preserves all vote fields through save/load cycle', () => {
      const record: VoteRecord = {
        proposalId: 42,
        title: 'Comprehensive Proposal with Special Characters: "test" & <html>',
        support: false,
        weight: 10,
        timestamp: 1710000000000,
        executed: true,
      };

      saveVoteRecord('SP123', record);
      const result = getLocalVoteHistory('SP123');

      expect(result[0].proposalId).toBe(42);
      expect(result[0].title).toBe(record.title);
      expect(result[0].support).toBe(false);
      expect(result[0].weight).toBe(10);
      expect(result[0].timestamp).toBe(1710000000000);
      expect(result[0].executed).toBe(true);
    });

    it('handles maximum weight values', () => {
      saveVoteRecord('SP123', {
        proposalId: 1, title: 'Heavy', support: true, weight: 999, timestamp: 1000, executed: false,
      });

      const result = getLocalVoteHistory('SP123');
      expect(result[0].weight).toBe(999);
    });
  });

  describe('storage failure recovery', () => {
    it('returns empty array when getItem throws', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });

      const result = getLocalVoteHistory('SP123');
      expect(result).toEqual([]);
    });

    it('does not corrupt existing data when setItem fails', () => {
      saveVoteRecord('SP123', {
        proposalId: 1, title: 'Existing', support: true, weight: 1, timestamp: 1000, executed: false,
      });

      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      saveVoteRecord('SP123', {
        proposalId: 2, title: 'New', support: true, weight: 2, timestamp: 2000, executed: false,
      });

      // Original data should still be readable
      const result = getLocalVoteHistory('SP123');
      expect(result).toHaveLength(1);
      expect(result[0].proposalId).toBe(1);
    });
  });
});

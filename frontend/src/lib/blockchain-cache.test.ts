import { describe, it, expect, beforeEach, vi } from 'vitest';
import { blockchainCache } from './blockchain-cache';
import type { Proposal, ProposalPage } from '../types';

const mockProposal: Proposal = {
  id: 1,
  title: 'Test',
  description: 'Test proposal',
  amount: 1000000,
  proposer: 'SP123',
  votesFor: 10,
  votesAgainst: 5,
  executed: false,
  createdAt: 12345,
};

const mockProposalPage: ProposalPage = {
  proposals: [mockProposal],
  totalCount: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('BlockchainDataCache', () => {
  beforeEach(() => {
    blockchainCache.clear();
  });

  describe('proposal caching', () => {
    it('should cache proposal', () => {
      blockchainCache.setProposal(1, mockProposal);
      const cached = blockchainCache.getProposal(1);
      expect(cached).toEqual(mockProposal);
    });

    it('should return null for uncached proposal', () => {
      const cached = blockchainCache.getProposal(999);
      expect(cached).toBeNull();
    });

    it('should expire cached proposal after TTL', () => {
      vi.useFakeTimers();
      blockchainCache.setProposal(1, mockProposal, 1000);
      expect(blockchainCache.getProposal(1)).toEqual(mockProposal);

      vi.advanceTimersByTime(1100);
      expect(blockchainCache.getProposal(1)).toBeNull();

      vi.useRealTimers();
    });

    it('should invalidate single proposal', () => {
      blockchainCache.setProposal(1, mockProposal);
      blockchainCache.invalidateProposal(1);
      expect(blockchainCache.getProposal(1)).toBeNull();
    });
  });

  describe('proposal page caching', () => {
    it('should cache proposal page', () => {
      blockchainCache.setProposalPage(1, 10, mockProposalPage);
      const cached = blockchainCache.getProposalPage(1, 10);
      expect(cached).toEqual(mockProposalPage);
    });

    it('should differentiate between different pages', () => {
      blockchainCache.setProposalPage(1, 10, mockProposalPage);
      const page2 = { ...mockProposalPage, page: 2 };
      blockchainCache.setProposalPage(2, 10, page2);

      expect(blockchainCache.getProposalPage(1, 10)?.page).toBe(1);
      expect(blockchainCache.getProposalPage(2, 10)?.page).toBe(2);
    });

    it('should differentiate between different page sizes', () => {
      blockchainCache.setProposalPage(1, 10, mockProposalPage);
      blockchainCache.setProposalPage(1, 20, mockProposalPage);

      expect(blockchainCache.getProposalPage(1, 10)).toEqual(mockProposalPage);
      expect(blockchainCache.getProposalPage(1, 20)).toEqual(mockProposalPage);
    });

    it('should invalidate all proposal pages', () => {
      blockchainCache.setProposalPage(1, 10, mockProposalPage);
      blockchainCache.setProposalPage(2, 10, mockProposalPage);
      blockchainCache.invalidateProposalPages();

      expect(blockchainCache.getProposalPage(1, 10)).toBeNull();
      expect(blockchainCache.getProposalPage(2, 10)).toBeNull();
    });
  });

  describe('proposal count caching', () => {
    it('should cache proposal count', () => {
      blockchainCache.setProposalCount(42);
      expect(blockchainCache.getProposalCount()).toBe(42);
    });

    it('should expire proposal count', () => {
      vi.useFakeTimers();
      blockchainCache.setProposalCount(42, 1000);
      expect(blockchainCache.getProposalCount()).toBe(42);

      vi.advanceTimersByTime(1100);
      expect(blockchainCache.getProposalCount()).toBeNull();

      vi.useRealTimers();
    });

    it('should invalidate proposal count', () => {
      blockchainCache.setProposalCount(42);
      blockchainCache.invalidateProposalCount();
      expect(blockchainCache.getProposalCount()).toBeNull();
    });
  });

  describe('stake caching', () => {
    it('should cache stake', () => {
      blockchainCache.setStake('SP123', 1000000);
      expect(blockchainCache.getStake('SP123')).toBe(1000000);
    });

    it('should cache different stakes per address', () => {
      blockchainCache.setStake('SP123', 1000000);
      blockchainCache.setStake('SP456', 2000000);

      expect(blockchainCache.getStake('SP123')).toBe(1000000);
      expect(blockchainCache.getStake('SP456')).toBe(2000000);
    });

    it('should invalidate specific stake', () => {
      blockchainCache.setStake('SP123', 1000000);
      blockchainCache.invalidateStake('SP123');
      expect(blockchainCache.getStake('SP123')).toBeNull();
    });
  });

  describe('min stake amount caching', () => {
    it('should cache min stake amount', () => {
      blockchainCache.setMinStakeAmount(10000000);
      expect(blockchainCache.getMinStakeAmount()).toBe(10000000);
    });

    it('should use long TTL for min stake', () => {
      vi.useFakeTimers();
      blockchainCache.setMinStakeAmount(10000000);
      vi.advanceTimersByTime(30 * 60 * 1000);

      expect(blockchainCache.getMinStakeAmount()).toBe(10000000);
      vi.useRealTimers();
    });
  });

  describe('cache statistics', () => {
    it('should track cache hits and misses', () => {
      blockchainCache.setProposal(1, mockProposal);

      blockchainCache.getProposal(1);
      blockchainCache.getProposal(1);
      blockchainCache.getProposal(999);

      const stats = blockchainCache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });

    it('should calculate hit rate', () => {
      blockchainCache.setProposal(1, mockProposal);

      blockchainCache.getProposal(1);
      blockchainCache.getProposal(1);
      blockchainCache.getProposal(999);

      const stats = blockchainCache.getStats();
      expect(stats.hitRate).toBeCloseTo(66.67, 1);
    });

    it('should reset stats', () => {
      blockchainCache.setProposal(1, mockProposal);
      blockchainCache.getProposal(1);

      const statsBefore = blockchainCache.getStats();
      expect(statsBefore.hits).toBeGreaterThan(0);

      blockchainCache.resetStats();
      const statsAfter = blockchainCache.getStats();
      expect(statsAfter.hits).toBe(0);
      expect(statsAfter.misses).toBe(0);
    });
  });

  describe('cache operations', () => {
    it('should return cache size', () => {
      blockchainCache.setProposal(1, mockProposal);
      blockchainCache.setProposalCount(42);
      blockchainCache.setStake('SP123', 1000000);

      expect(blockchainCache.getSize()).toBe(3);
    });

    it('should invalidate all cache', () => {
      blockchainCache.setProposal(1, mockProposal);
      blockchainCache.setProposalCount(42);
      blockchainCache.setStake('SP123', 1000000);

      blockchainCache.invalidateAll();

      expect(blockchainCache.getProposal(1)).toBeNull();
      expect(blockchainCache.getProposalCount()).toBeNull();
      expect(blockchainCache.getStake('SP123')).toBeNull();
      expect(blockchainCache.getSize()).toBe(0);
    });

    it('should clear cache and stats', () => {
      blockchainCache.setProposal(1, mockProposal);
      blockchainCache.getProposal(1);

      blockchainCache.clear();

      expect(blockchainCache.getProposal(1)).toBeNull();
      expect(blockchainCache.getStats().hits).toBe(0);
    });
  });
});

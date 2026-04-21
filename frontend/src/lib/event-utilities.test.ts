import { describe, it, expect } from 'vitest';
import {
  groupEventsByCategory,
  filterEventsByStatus,
  getEventStats,
  getRecentEvents,
  getEventAmount,
  getTotalAmount,
  getAverageAmount,
} from './event-utilities';
import { ContractEvent } from '../types/contract-events';

describe('Event Utilities', () => {
  const mockEvents: ContractEvent[] = [
    {
      id: '1',
      txId: 'tx1',
      timestamp: 1000,
      sender: 'SP123',
      category: 'stake',
      status: 'success',
      description: 'Staked 1000 tokens',
      amount: '1000',
    },
    {
      id: '2',
      txId: 'tx2',
      timestamp: 2000,
      sender: 'SP456',
      category: 'vote',
      status: 'success',
      description: 'Voted',
      weight: 500,
    },
    {
      id: '3',
      txId: 'tx3',
      timestamp: 3000,
      sender: 'SP789',
      category: 'stake',
      status: 'failed',
      description: 'Failed stake',
    },
    {
      id: '4',
      txId: 'tx4',
      timestamp: 4000,
      sender: 'SP000',
      category: 'proposal',
      status: 'success',
      description: 'Created proposal',
    },
  ];

  describe('groupEventsByCategory', () => {
    it('groups events by category', () => {
      const groups = groupEventsByCategory(mockEvents);

      expect(groups.size).toBe(3);
      expect(groups.get('stake')).toHaveLength(2);
      expect(groups.get('vote')).toHaveLength(1);
      expect(groups.get('proposal')).toHaveLength(1);
    });
  });

  describe('filterEventsByStatus', () => {
    it('filters events by success status', () => {
      const successful = filterEventsByStatus(mockEvents, 'success');

      expect(successful).toHaveLength(3);
      expect(successful.every(e => e.status === 'success')).toBe(true);
    });

    it('filters events by failed status', () => {
      const failed = filterEventsByStatus(mockEvents, 'failed');

      expect(failed).toHaveLength(1);
      expect(failed[0].id).toBe('3');
    });
  });

  describe('getEventStats', () => {
    it('calculates correct statistics', () => {
      const stats = getEventStats(mockEvents);

      expect(stats.total).toBe(4);
      expect(stats.succeeded).toBe(3);
      expect(stats.failed).toBe(1);
      expect(stats.byCategory.stake).toBe(2);
      expect(stats.byCategory.vote).toBe(1);
    });
  });

  describe('getRecentEvents', () => {
    it('returns recent events with limit', () => {
      const recent = getRecentEvents(mockEvents, 2);

      expect(recent).toHaveLength(2);
      expect(recent[0].id).toBe('1');
    });

    it('returns all events if count exceeds length', () => {
      const recent = getRecentEvents(mockEvents, 100);

      expect(recent).toHaveLength(4);
    });
  });

  describe('getEventAmount', () => {
    it('extracts amount from event', () => {
      const event = mockEvents.find(e => e.amount);
      expect(getEventAmount(event!)).toBe(1000);
    });

    it('extracts weight as amount', () => {
      const event = mockEvents.find(e => e.weight);
      expect(getEventAmount(event!)).toBe(500);
    });

    it('returns 0 for events without amount or weight', () => {
      const event = mockEvents.find(e => !e.amount && !e.weight);
      expect(getEventAmount(event!)).toBe(0);
    });
  });

  describe('getTotalAmount', () => {
    it('calculates total amount across events', () => {
      const total = getTotalAmount(mockEvents);

      expect(total).toBe(1500);
    });

    it('handles empty events', () => {
      expect(getTotalAmount([])).toBe(0);
    });
  });

  describe('getAverageAmount', () => {
    it('calculates average amount', () => {
      const avg = getAverageAmount(mockEvents);

      expect(avg).toBe(375);
    });

    it('handles empty events', () => {
      expect(getAverageAmount([])).toBe(0);
    });
  });
});

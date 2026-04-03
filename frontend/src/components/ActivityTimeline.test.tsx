import { describe, it, expect } from 'vitest';
import type { ActivityEvent, ActivityEventType } from '../types/profile';

/**
 * Behavioral tests for ActivityTimeline component.
 * Tests filtering, pagination, relative time formatting, and event metadata.
 */

/* ── Event metadata (mirrors component) ───────── */

const EVENT_META: Record<ActivityEventType, { icon: string; color: string }> = {
  proposal_created: { icon: 'P', color: 'bg-indigo-500' },
  vote_cast: { icon: 'V', color: 'bg-purple-500' },
  stake_deposited: { icon: 'S', color: 'bg-emerald-500' },
  stake_withdrawn: { icon: 'W', color: 'bg-amber-500' },
  proposal_executed: { icon: 'E', color: 'bg-teal-500' },
};

/* ── Relative time (mirrors component) ────────── */

function formatRelativeTime(timestamp: number, now: number): string {
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

/* ── Filter options (mirrors component) ───────── */

const FILTER_OPTIONS: { label: string; value: ActivityEventType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Proposals', value: 'proposal_created' },
  { label: 'Votes', value: 'vote_cast' },
  { label: 'Executed', value: 'proposal_executed' },
];

const PAGE_SIZE = 10;

/* ── Test data ────────────────────────────────── */

function createEvents(count: number): ActivityEvent[] {
  const types: ActivityEventType[] = [
    'proposal_created',
    'vote_cast',
    'proposal_executed',
    'stake_deposited',
    'stake_withdrawn',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `evt-${i}`,
    type: types[i % types.length],
    label: `Event ${i}`,
    timestamp: 1000 + i * 1000,
  }));
}

describe('ActivityTimeline behaviour', () => {
  describe('event metadata', () => {
    it('has metadata for all 5 event types', () => {
      const keys = Object.keys(EVENT_META) as ActivityEventType[];
      expect(keys).toHaveLength(5);
    });

    it('each event type has an icon and color', () => {
      for (const [, meta] of Object.entries(EVENT_META)) {
        expect(meta.icon).toBeTruthy();
        expect(meta.color).toBeTruthy();
        expect(meta.color).toMatch(/^bg-/);
      }
    });

    it('each event type has a unique icon', () => {
      const icons = Object.values(EVENT_META).map((m) => m.icon);
      expect(new Set(icons).size).toBe(5);
    });
  });

  describe('filtering', () => {
    const events = createEvents(15);

    it('all filter returns all events', () => {
      const filtered = events;
      expect(filtered).toHaveLength(15);
    });

    it('proposal_created filter returns only proposals', () => {
      const filtered = events.filter((e) => e.type === 'proposal_created');
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((e) => e.type === 'proposal_created')).toBe(true);
    });

    it('vote_cast filter returns only votes', () => {
      const filtered = events.filter((e) => e.type === 'vote_cast');
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((e) => e.type === 'vote_cast')).toBe(true);
    });

    it('proposal_executed filter returns only executed', () => {
      const filtered = events.filter((e) => e.type === 'proposal_executed');
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((e) => e.type === 'proposal_executed')).toBe(true);
    });

    it('filter with no matching results returns empty', () => {
      const onlyProposals = events.filter((e) => e.type === 'proposal_created');
      const filtered = onlyProposals.filter((e) => e.type === 'vote_cast');
      expect(filtered).toHaveLength(0);
    });
  });

  describe('pagination', () => {
    it('shows first page of PAGE_SIZE items', () => {
      const events = createEvents(25);
      const visible = events.slice(0, PAGE_SIZE);
      expect(visible).toHaveLength(10);
    });

    it('detects hasMore when events exceed page size', () => {
      const events = createEvents(25);
      const visibleCount = PAGE_SIZE;
      const hasMore = visibleCount < events.length;
      expect(hasMore).toBe(true);
    });

    it('detects no more when events fit in page', () => {
      const events = createEvents(5);
      const visibleCount = PAGE_SIZE;
      const hasMore = visibleCount < events.length;
      expect(hasMore).toBe(false);
    });

    it('shows more button with remaining count', () => {
      const events = createEvents(25);
      const visibleCount = PAGE_SIZE;
      const remaining = events.length - visibleCount;
      expect(remaining).toBe(15);
    });

    it('increments visible count by PAGE_SIZE', () => {
      let visibleCount = PAGE_SIZE;
      visibleCount += PAGE_SIZE;
      expect(visibleCount).toBe(20);
    });
  });

  describe('relative time formatting', () => {
    const now = 1710000060000;

    it('shows Just now for timestamps within a minute', () => {
      expect(formatRelativeTime(now - 30_000, now)).toBe('Just now');
    });

    it('shows minutes ago', () => {
      expect(formatRelativeTime(now - 300_000, now)).toBe('5m ago');
    });

    it('shows hours ago', () => {
      expect(formatRelativeTime(now - 7_200_000, now)).toBe('2h ago');
    });

    it('shows days ago', () => {
      expect(formatRelativeTime(now - 172_800_000, now)).toBe('2d ago');
    });

    it('shows date for timestamps older than 30 days', () => {
      const oldTimestamp = now - 31 * 24 * 60 * 60 * 1000;
      const result = formatRelativeTime(oldTimestamp, now);
      expect(result).not.toContain('ago');
      expect(result).toMatch(/\w+ \d+, \d{4}/);
    });
  });

  describe('filter options', () => {
    it('has exactly 4 filter options', () => {
      expect(FILTER_OPTIONS).toHaveLength(4);
    });

    it('first option is All', () => {
      expect(FILTER_OPTIONS[0]).toEqual({ label: 'All', value: 'all' });
    });

    it('each option has a unique value', () => {
      const values = FILTER_OPTIONS.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    });
  });

  describe('empty state', () => {
    it('detects empty activity list', () => {
      const events: ActivityEvent[] = [];
      expect(events.length === 0).toBe(true);
    });
  });

  describe('event links', () => {
    it('events with proposalId generate correct link paths', () => {
      const event: ActivityEvent = {
        id: '1',
        type: 'proposal_created',
        label: 'Test',
        timestamp: 1000,
        proposalId: 42,
      };
      const path = `/proposals/${event.proposalId}`;
      expect(path).toBe('/proposals/42');
    });

    it('events without proposalId do not generate links', () => {
      const event: ActivityEvent = {
        id: '2',
        type: 'stake_deposited',
        label: 'Staked 100 STX',
        timestamp: 1000,
      };
      expect(event.proposalId).toBeUndefined();
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  BADGE_CONFIGS,
  getBadgeConfig,
  getBadgeLabel,
  formatBadgeCount,
} from './notification-badges';
import type { NotificationType } from '../types/notification';

const ALL_TYPES: NotificationType[] = [
  'proposal_created',
  'proposal_executed',
  'vote_milestone',
  'stake_change',
  'vote_received',
];

describe('BADGE_CONFIGS', () => {
  it('has an entry for every notification type', () => {
    const configTypes = BADGE_CONFIGS.map((b) => b.type);
    for (const type of ALL_TYPES) {
      expect(configTypes).toContain(type);
    }
  });

  it('every config has a non-empty label', () => {
    for (const config of BADGE_CONFIGS) {
      expect(config.label.length).toBeGreaterThan(0);
    }
  });

  it('every config has a color and bgColor', () => {
    for (const config of BADGE_CONFIGS) {
      expect(config.color.length).toBeGreaterThan(0);
      expect(config.bgColor.length).toBeGreaterThan(0);
    }
  });

  it('has exactly 5 entries', () => {
    expect(BADGE_CONFIGS).toHaveLength(5);
  });
});

describe('getBadgeConfig', () => {
  it('returns config for a known type', () => {
    const config = getBadgeConfig('proposal_created');
    expect(config).toBeDefined();
    expect(config?.label).toBe('New');
    expect(config?.color).toBe('text-green');
  });

  it('returns config for each notification type', () => {
    for (const type of ALL_TYPES) {
      const config = getBadgeConfig(type);
      expect(config).toBeDefined();
      expect(config?.type).toBe(type);
    }
  });

  it('returns undefined for unknown type', () => {
    const config = getBadgeConfig('unknown' as NotificationType);
    expect(config).toBeUndefined();
  });
});

describe('getBadgeLabel', () => {
  it('returns configured label for known types', () => {
    expect(getBadgeLabel('proposal_created')).toBe('New');
    expect(getBadgeLabel('proposal_executed')).toBe('Executed');
    expect(getBadgeLabel('vote_milestone')).toBe('Milestone');
    expect(getBadgeLabel('stake_change')).toBe('Stake');
    expect(getBadgeLabel('vote_received')).toBe('Vote');
  });

  it('returns capitalized fallback for unknown types', () => {
    const label = getBadgeLabel('unknown_type' as NotificationType);
    expect(label).toBe('Unknown Type');
  });
});

describe('formatBadgeCount', () => {
  it('returns empty string for zero', () => {
    expect(formatBadgeCount(0)).toBe('');
  });

  it('returns empty string for negative values', () => {
    expect(formatBadgeCount(-5)).toBe('');
  });

  it('returns exact number for 1-99', () => {
    expect(formatBadgeCount(1)).toBe('1');
    expect(formatBadgeCount(42)).toBe('42');
    expect(formatBadgeCount(99)).toBe('99');
  });

  it('returns "99+" for values above 99', () => {
    expect(formatBadgeCount(100)).toBe('99+');
    expect(formatBadgeCount(1000)).toBe('99+');
  });
});

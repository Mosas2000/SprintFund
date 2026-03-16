import { describe, it, expect } from 'vitest';
import { getNotificationIconName, getNotificationColor } from './notification-icons';
import type { NotificationType } from '../types/notification';

const ALL_TYPES: NotificationType[] = [
  'proposal_created',
  'proposal_executed',
  'vote_milestone',
  'stake_change',
  'vote_received',
  'quorum_reached',
];

describe('getNotificationIconName', () => {
  it('returns a non-empty string for every notification type', () => {
    for (const type of ALL_TYPES) {
      const icon = getNotificationIconName(type);
      expect(typeof icon).toBe('string');
      expect(icon.length).toBeGreaterThan(0);
    }
  });

  it('returns FileText for proposal_created', () => {
    expect(getNotificationIconName('proposal_created')).toBe('FileText');
  });

  it('returns CheckCircle for proposal_executed', () => {
    expect(getNotificationIconName('proposal_executed')).toBe('CheckCircle');
  });

  it('returns Target for quorum_reached', () => {
    expect(getNotificationIconName('quorum_reached')).toBe('Target');
  });
});

describe('getNotificationColor', () => {
  it('returns a Tailwind color class for every notification type', () => {
    for (const type of ALL_TYPES) {
      const color = getNotificationColor(type);
      expect(color).toMatch(/^text-/);
    }
  });

  it('returns blue class for proposal_created', () => {
    expect(getNotificationColor('proposal_created')).toContain('blue');
  });

  it('returns green class for proposal_executed', () => {
    expect(getNotificationColor('proposal_executed')).toContain('green');
  });

  it('returns emerald class for quorum_reached', () => {
    expect(getNotificationColor('quorum_reached')).toContain('emerald');
  });
});

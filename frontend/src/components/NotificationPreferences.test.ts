import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadPreferences,
  savePreferences,
  isTypeEnabled,
} from '../lib/notification-preferences';
import type { NotificationPreferences } from '../lib/notification-preferences';

/**
 * Tests for NotificationPreferences utilities and component behavior.
 */

const ALL_TYPES = [
  'proposal_created',
  'proposal_executed',
  'vote_milestone',
  'stake_change',
  'vote_received',
] as const;

let storage: Record<string, string> = {};

beforeEach(() => {
  storage = {};
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
  });
});

describe('loadPreferences', () => {
  it('returns all enabled by default when storage is empty', () => {
    const prefs = loadPreferences();
    for (const type of ALL_TYPES) {
      expect(prefs[type]).toBe(true);
    }
  });

  it('returns all enabled when storage has invalid JSON', () => {
    storage['sprintfund-notification-preferences'] = 'not-json';
    const prefs = loadPreferences();
    for (const type of ALL_TYPES) {
      expect(prefs[type]).toBe(true);
    }
  });

  it('loads saved preferences from storage', () => {
    const saved: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: false,
      vote_milestone: true,
      stake_change: false,
      vote_received: true,
    };
    storage['sprintfund-notification-preferences'] = JSON.stringify(saved);
    const prefs = loadPreferences();
    expect(prefs.proposal_executed).toBe(false);
    expect(prefs.stake_change).toBe(false);
    expect(prefs.proposal_created).toBe(true);
  });

  it('fills missing keys with defaults', () => {
    storage['sprintfund-notification-preferences'] = JSON.stringify({
      proposal_created: false,
    });
    const prefs = loadPreferences();
    expect(prefs.proposal_created).toBe(false);
    expect(prefs.vote_milestone).toBe(true); // default
    expect(prefs.vote_received).toBe(true); // default
  });

  it('ignores non-boolean values and uses defaults', () => {
    storage['sprintfund-notification-preferences'] = JSON.stringify({
      proposal_created: 'yes',
      proposal_executed: 42,
      vote_milestone: null,
    });
    const prefs = loadPreferences();
    expect(prefs.proposal_created).toBe(true); // default, 'yes' is not boolean
    expect(prefs.proposal_executed).toBe(true); // default
    expect(prefs.vote_milestone).toBe(true); // default
  });
});

describe('savePreferences', () => {
  it('persists preferences to localStorage', () => {
    const prefs: NotificationPreferences = {
      proposal_created: false,
      proposal_executed: true,
      vote_milestone: false,
      stake_change: true,
      vote_received: false,
    };
    savePreferences(prefs);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sprintfund-notification-preferences',
      JSON.stringify(prefs),
    );
  });

  it('handles storage errors gracefully', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError');
      }),
      removeItem: vi.fn(),
    });

    const prefs: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: true,
      vote_milestone: true,
      stake_change: true,
      vote_received: true,
    };

    // Should not throw
    expect(() => savePreferences(prefs)).not.toThrow();
  });

  it('roundtrips through load/save cycle', () => {
    const original: NotificationPreferences = {
      proposal_created: false,
      proposal_executed: true,
      vote_milestone: false,
      stake_change: true,
      vote_received: false,
    };
    savePreferences(original);

    // Manually update storage to simulate real localStorage
    const saved = (localStorage.setItem as ReturnType<typeof vi.fn>).mock.calls[0];
    storage[saved[0]] = saved[1];

    const loaded = loadPreferences();
    expect(loaded).toEqual(original);
  });
});

describe('isTypeEnabled', () => {
  it('returns true for enabled types', () => {
    const prefs: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: false,
      vote_milestone: true,
      stake_change: false,
      vote_received: true,
    };
    expect(isTypeEnabled(prefs, 'proposal_created')).toBe(true);
    expect(isTypeEnabled(prefs, 'vote_milestone')).toBe(true);
    expect(isTypeEnabled(prefs, 'vote_received')).toBe(true);
  });

  it('returns false for disabled types', () => {
    const prefs: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: false,
      vote_milestone: true,
      stake_change: false,
      vote_received: true,
    };
    expect(isTypeEnabled(prefs, 'proposal_executed')).toBe(false);
    expect(isTypeEnabled(prefs, 'stake_change')).toBe(false);
  });

  it('checks all five notification types', () => {
    const allEnabled: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: true,
      vote_milestone: true,
      stake_change: true,
      vote_received: true,
    };
    for (const type of ALL_TYPES) {
      expect(isTypeEnabled(allEnabled, type)).toBe(true);
    }
  });
});

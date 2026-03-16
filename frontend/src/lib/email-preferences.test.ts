import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadEmailPreferences,
  saveEmailPreferences,
  isValidEmail,
  DEFAULT_EMAIL_PREFERENCES,
} from './email-preferences';

let storage: Record<string, string> = {};

beforeEach(() => {
  storage = {};
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { storage[key] = value; }),
    removeItem: vi.fn((key: string) => { delete storage[key]; }),
  });
});

describe('loadEmailPreferences', () => {
  it('returns defaults when localStorage is empty', () => {
    const prefs = loadEmailPreferences();
    expect(prefs).toEqual(DEFAULT_EMAIL_PREFERENCES);
  });

  it('returns defaults when localStorage has invalid JSON', () => {
    storage['sprintfund-email-preferences'] = 'bad';
    const prefs = loadEmailPreferences();
    expect(prefs).toEqual(DEFAULT_EMAIL_PREFERENCES);
  });

  it('loads saved preferences', () => {
    const saved = { enabled: true, address: 'test@example.com', digestMode: 'weekly' };
    storage['sprintfund-email-preferences'] = JSON.stringify(saved);
    const prefs = loadEmailPreferences();
    expect(prefs.enabled).toBe(true);
    expect(prefs.address).toBe('test@example.com');
    expect(prefs.digestMode).toBe('weekly');
  });

  it('falls back to defaults for invalid digest mode', () => {
    const saved = { enabled: true, address: 'test@example.com', digestMode: 'hourly' };
    storage['sprintfund-email-preferences'] = JSON.stringify(saved);
    const prefs = loadEmailPreferences();
    expect(prefs.digestMode).toBe('daily');
  });
});

describe('saveEmailPreferences', () => {
  it('persists to localStorage', () => {
    saveEmailPreferences({ enabled: true, address: 'a@b.com', digestMode: 'instant' });
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('handles storage errors gracefully', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(() => { throw new Error('full'); }),
      removeItem: vi.fn(),
    });
    expect(() => saveEmailPreferences(DEFAULT_EMAIL_PREFERENCES)).not.toThrow();
  });
});

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test+tag@domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('@no-local.com')).toBe(false);
    expect(isValidEmail('no-domain@')).toBe(false);
  });

  it('rejects emails longer than 254 characters', () => {
    const long = 'a'.repeat(250) + '@b.com';
    expect(isValidEmail(long)).toBe(false);
  });
});

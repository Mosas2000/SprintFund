import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSoundEnabled, setSoundEnabled } from './notification-sound';

let storage: Record<string, string> = {};

beforeEach(() => {
  storage = {};
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { storage[key] = value; }),
    removeItem: vi.fn((key: string) => { delete storage[key]; }),
  });
});

describe('isSoundEnabled', () => {
  it('returns true by default when no preference is stored', () => {
    expect(isSoundEnabled()).toBe(true);
  });

  it('returns true when stored value is true', () => {
    storage['sprintfund-notification-sound'] = 'true';
    expect(isSoundEnabled()).toBe(true);
  });

  it('returns false when stored value is false', () => {
    storage['sprintfund-notification-sound'] = 'false';
    expect(isSoundEnabled()).toBe(false);
  });

  it('returns true when localStorage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => { throw new Error('fail'); }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    expect(isSoundEnabled()).toBe(true);
  });
});

describe('setSoundEnabled', () => {
  it('persists true to localStorage', () => {
    setSoundEnabled(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sprintfund-notification-sound',
      'true',
    );
  });

  it('persists false to localStorage', () => {
    setSoundEnabled(false);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'sprintfund-notification-sound',
      'false',
    );
  });

  it('handles storage errors gracefully', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(() => { throw new Error('full'); }),
      removeItem: vi.fn(),
    });
    expect(() => setSoundEnabled(true)).not.toThrow();
  });
});

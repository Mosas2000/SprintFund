import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPushPermission, isPushSupported } from './push-permission';

describe('isPushSupported', () => {
  it('returns true when Notification API is available', () => {
    vi.stubGlobal('Notification', { permission: 'default', requestPermission: vi.fn() });
    expect(isPushSupported()).toBe(true);
    vi.unstubAllGlobals();
  });

  it('returns false when Notification API is unavailable', () => {
    const original = globalThis.Notification;
    // @ts-expect-error - removing for test
    delete globalThis.Notification;
    expect(isPushSupported()).toBe(false);
    if (original) {
      globalThis.Notification = original;
    }
  });
});

describe('getPushPermission', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns granted when permission is granted', () => {
    vi.stubGlobal('Notification', { permission: 'granted' });
    expect(getPushPermission()).toBe('granted');
    vi.unstubAllGlobals();
  });

  it('returns denied when permission is denied', () => {
    vi.stubGlobal('Notification', { permission: 'denied' });
    expect(getPushPermission()).toBe('denied');
    vi.unstubAllGlobals();
  });

  it('returns default when permission is default', () => {
    vi.stubGlobal('Notification', { permission: 'default' });
    expect(getPushPermission()).toBe('default');
    vi.unstubAllGlobals();
  });

  it('returns denied when window is undefined', () => {
    const original = globalThis.Notification;
    // @ts-expect-error - removing for test
    delete globalThis.Notification;
    expect(getPushPermission()).toBe('denied');
    if (original) {
      globalThis.Notification = original;
    }
  });
});

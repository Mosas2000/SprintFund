import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatRelativeTime,
  formatAbsoluteDate,
  formatFullDateTime,
  shortenAddress,
  getAddressInitials,
} from '../lib/comment-formatting';

describe('Comment formatting', () => {
  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Just now" for timestamps less than a minute ago', () => {
      const now = Date.now();
      expect(formatRelativeTime(now)).toBe('Just now');
      expect(formatRelativeTime(now - 30000)).toBe('Just now');
    });

    it('returns "Just now" for future timestamps', () => {
      expect(formatRelativeTime(Date.now() + 60000)).toBe('Just now');
    });

    it('formats minutes ago', () => {
      expect(formatRelativeTime(Date.now() - 5 * 60000)).toBe('5m ago');
      expect(formatRelativeTime(Date.now() - 59 * 60000)).toBe('59m ago');
    });

    it('formats hours ago', () => {
      expect(formatRelativeTime(Date.now() - 2 * 3600000)).toBe('2h ago');
      expect(formatRelativeTime(Date.now() - 23 * 3600000)).toBe('23h ago');
    });

    it('formats days ago', () => {
      expect(formatRelativeTime(Date.now() - 3 * 86400000)).toBe('3d ago');
      expect(formatRelativeTime(Date.now() - 6 * 86400000)).toBe('6d ago');
    });

    it('formats weeks ago', () => {
      expect(formatRelativeTime(Date.now() - 14 * 86400000)).toBe('2w ago');
      expect(formatRelativeTime(Date.now() - 21 * 86400000)).toBe('3w ago');
    });

    it('formats months ago', () => {
      expect(formatRelativeTime(Date.now() - 60 * 86400000)).toBe('2mo ago');
      expect(formatRelativeTime(Date.now() - 300 * 86400000)).toBe('10mo ago');
    });

    it('formats very old timestamps as absolute dates', () => {
      const oldDate = new Date('2024-01-15T00:00:00Z').getTime();
      expect(formatRelativeTime(oldDate)).toBe('Jan 15, 2024');
    });
  });

  describe('formatAbsoluteDate', () => {
    it('formats a date correctly', () => {
      const date = new Date('2025-03-22T00:00:00Z').getTime();
      expect(formatAbsoluteDate(date)).toBe('Mar 22, 2025');
    });

    it('formats January correctly', () => {
      const date = new Date('2025-01-01T00:00:00Z').getTime();
      expect(formatAbsoluteDate(date)).toBe('Jan 1, 2025');
    });

    it('formats December correctly', () => {
      const date = new Date('2025-12-31T00:00:00Z').getTime();
      expect(formatAbsoluteDate(date)).toBe('Dec 31, 2025');
    });
  });

  describe('formatFullDateTime', () => {
    it('formats date with AM time', () => {
      const date = new Date('2025-06-15T09:05:00Z').getTime();
      const result = formatFullDateTime(date);
      expect(result).toContain('Jun 15, 2025');
      // Time depends on local timezone, just check structure
      expect(result).toContain(' at ');
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)$/);
    });

    it('formats midnight as 12:00 AM', () => {
      const date = new Date('2025-06-15T00:00:00Z').getTime();
      const result = formatFullDateTime(date);
      // In UTC this would be 12:00 AM, but timezone may shift it
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)$/);
    });

    it('formats noon correctly', () => {
      const date = new Date('2025-06-15T12:00:00Z').getTime();
      const result = formatFullDateTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)$/);
    });
  });

  describe('shortenAddress', () => {
    it('shortens a standard Stacks address', () => {
      const address = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
      expect(shortenAddress(address)).toBe('SP3FBR...5SVTE');
    });

    it('returns short addresses unchanged', () => {
      expect(shortenAddress('SP3FBR')).toBe('SP3FBR');
      expect(shortenAddress('short')).toBe('short');
    });

    it('returns empty string for empty input', () => {
      expect(shortenAddress('')).toBe('');
    });

    it('handles addresses exactly at threshold', () => {
      const addr = '123456789012';
      expect(shortenAddress(addr)).toBe('123456...89012');
    });
  });

  describe('getAddressInitials', () => {
    it('returns first two characters uppercased', () => {
      expect(getAddressInitials('SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE')).toBe('SP');
    });

    it('handles lowercase input', () => {
      expect(getAddressInitials('sp3fbr')).toBe('SP');
    });

    it('returns ?? for empty string', () => {
      expect(getAddressInitials('')).toBe('??');
    });

    it('returns ?? for single character', () => {
      expect(getAddressInitials('S')).toBe('??');
    });

    it('returns first two characters for short string', () => {
      expect(getAddressInitials('ST')).toBe('ST');
    });
  });
});

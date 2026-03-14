import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import {
  encodePathSegment,
  isValidHttpUrl,
  isValidStacksAddress,
} from '../../lib/sanitize-url';

describe('encodePathSegment', () => {
  it('encodes special characters', () => {
    const encoded = encodePathSegment('hello world');
    expect(encoded).not.toContain(' ');
  });

  it('preserves alphanumeric characters', () => {
    expect(encodePathSegment('abc123')).toBe('abc123');
  });

  it('handles empty string', () => {
    expect(encodePathSegment('')).toBe('');
  });

  it('encodes forward slashes', () => {
    const encoded = encodePathSegment('a/b');
    expect(encoded).not.toBe('a/b');
  });

  it('handles transaction hash format', () => {
    const txId = '0xabcdef1234567890';
    const encoded = encodePathSegment(txId);
    expect(encoded).toContain('0x');
  });
});

describe('isValidHttpUrl', () => {
  it('accepts valid https URL', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true);
  });

  it('accepts valid http URL', () => {
    expect(isValidHttpUrl('http://example.com')).toBe(true);
  });

  it('rejects javascript: protocol', () => {
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data: protocol', () => {
    expect(isValidHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidHttpUrl('')).toBe(false);
  });

  it('rejects plain text', () => {
    expect(isValidHttpUrl('not a url')).toBe(false);
  });

  it('accepts URL with path', () => {
    expect(isValidHttpUrl('https://example.com/path/to/page')).toBe(true);
  });

  it('accepts URL with query parameters', () => {
    expect(isValidHttpUrl('https://example.com?key=value')).toBe(true);
  });
});

describe('isValidStacksAddress', () => {
  it('accepts valid SP address', () => {
    expect(isValidStacksAddress('SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T')).toBe(true);
  });

  it('accepts valid ST address', () => {
    expect(isValidStacksAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidStacksAddress('')).toBe(false);
  });

  it('rejects random text', () => {
    expect(isValidStacksAddress('not an address')).toBe(false);
  });

  it('rejects address that is too short', () => {
    expect(isValidStacksAddress('SP1')).toBe(false);
  });
});

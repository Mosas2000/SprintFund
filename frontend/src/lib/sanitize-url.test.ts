import { describe, it, expect } from 'vitest';
import {
  sanitizeUrl,
  encodePathSegment,
  isValidStacksAddress,
  isValidTxId,
  safeExplorerTxUrl,
  safeExplorerAddressUrl,
} from './sanitize-url';

/* ── sanitizeUrl ──────────────────────────────── */

describe('sanitizeUrl', () => {
  it('returns valid https URLs unchanged', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('returns valid http URLs unchanged', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('blocks javascript: protocol', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
  });

  it('blocks javascript: with mixed case', () => {
    expect(sanitizeUrl('JaVaScRiPt:alert(1)')).toBe('');
  });

  it('blocks data: protocol', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('blocks vbscript: protocol', () => {
    expect(sanitizeUrl('vbscript:MsgBox("xss")')).toBe('');
  });

  it('blocks blob: protocol', () => {
    expect(sanitizeUrl('blob:https://example.com/uuid')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeUrl('')).toBe('');
  });

  it('allows relative paths and non-protocol strings through', () => {
    expect(sanitizeUrl('not a url')).toBe('not a url');
  });

  it('allows protocol-less strings that are not dangerous', () => {
    expect(sanitizeUrl('://example.com')).toBe('://example.com');
  });

  it('handles URLs with query parameters', () => {
    const url = 'https://explorer.hiro.so/txid/0xabc?chain=mainnet';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('handles URLs with fragments', () => {
    const url = 'https://example.com/page#section';
    expect(sanitizeUrl(url)).toBe(url);
  });

  it('handles URLs with ports', () => {
    const url = 'https://localhost:3000/api';
    expect(sanitizeUrl(url)).toBe(url);
  });
});

/* ── encodePathSegment ────────────────────────── */

describe('encodePathSegment', () => {
  it('encodes special characters', () => {
    expect(encodePathSegment('hello world')).toBe('hello%20world');
  });

  it('encodes forward slashes', () => {
    expect(encodePathSegment('a/b')).toBe('a%2Fb');
  });

  it('preserves alphanumeric characters', () => {
    expect(encodePathSegment('abc123')).toBe('abc123');
  });

  it('encodes HTML special characters', () => {
    expect(encodePathSegment('<script>')).toBe('%3Cscript%3E');
  });

  it('returns empty string for empty input', () => {
    expect(encodePathSegment('')).toBe('');
  });
});

/* ── isValidStacksAddress ─────────────────────── */

describe('isValidStacksAddress', () => {
  it('accepts valid mainnet address starting with SP', () => {
    expect(isValidStacksAddress('SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T')).toBe(true);
  });

  it('accepts valid testnet address starting with ST', () => {
    expect(isValidStacksAddress('ST31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T')).toBe(true);
  });

  it('rejects address not starting with S', () => {
    expect(isValidStacksAddress('AP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidStacksAddress('')).toBe(false);
  });

  it('rejects address with special characters', () => {
    expect(isValidStacksAddress('SP31<script>alert(1)</script>')).toBe(false);
  });

  it('rejects address that is too short', () => {
    expect(isValidStacksAddress('SP31')).toBe(false);
  });
});

/* ── isValidTxId ──────────────────────────────── */

describe('isValidTxId', () => {
  it('accepts valid hex txId with 0x prefix', () => {
    expect(isValidTxId('0x' + 'a'.repeat(64))).toBe(true);
  });

  it('accepts valid hex txId without 0x prefix', () => {
    expect(isValidTxId('f'.repeat(64))).toBe(true);
  });

  it('accepts mixed hex characters', () => {
    expect(isValidTxId('0x1234567890abcdef' + '0'.repeat(48))).toBe(true);
  });

  it('rejects txId with wrong length', () => {
    expect(isValidTxId('0xabc')).toBe(false);
  });

  it('rejects txId with non-hex characters', () => {
    expect(isValidTxId('0x' + 'g'.repeat(64))).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidTxId('')).toBe(false);
  });

  it('rejects script injection attempt', () => {
    expect(isValidTxId('<script>alert(1)</script>')).toBe(false);
  });
});

/* ── safeExplorerTxUrl ────────────────────────── */

describe('safeExplorerTxUrl', () => {
  it('returns a valid explorer URL for a valid txId', () => {
    const txId = '0x' + 'a'.repeat(64);
    const url = safeExplorerTxUrl(txId);
    expect(url).toContain('explorer.hiro.so/txid/');
    expect(url).toContain('chain=mainnet');
  });

  it('returns empty string for invalid txId', () => {
    expect(safeExplorerTxUrl('not-a-txid')).toBe('');
  });

  it('returns empty string for script injection', () => {
    expect(safeExplorerTxUrl('javascript:alert(1)')).toBe('');
  });
});

/* ── safeExplorerAddressUrl ───────────────────── */

describe('safeExplorerAddressUrl', () => {
  it('returns a valid explorer URL for a valid address', () => {
    const addr = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
    const url = safeExplorerAddressUrl(addr);
    expect(url).toContain('explorer.hiro.so/address/');
    expect(url).toContain('chain=mainnet');
  });

  it('returns empty string for invalid address', () => {
    expect(safeExplorerAddressUrl('not-an-address')).toBe('');
  });

  it('returns empty string for script injection', () => {
    expect(safeExplorerAddressUrl('<script>alert(1)</script>')).toBe('');
  });
});

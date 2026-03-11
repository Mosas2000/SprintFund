/**
 * URL sanitization utilities for defense-in-depth against
 * protocol injection and open-redirect attacks.
 *
 * All dynamic URLs constructed with user-controlled path segments
 * should pass through these utilities before being used in href
 * attributes or fetch() calls.
 */

/**
 * Allowed URL protocols. Any URL not starting with one of these
 * is rejected by sanitizeUrl().
 */
const ALLOWED_PROTOCOLS = ['https:', 'http:'] as const;

/**
 * Dangerous URL protocol prefixes that could execute code.
 */
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'blob:',
] as const;

/**
 * Validate and sanitize a URL string.
 *
 * Returns the URL if it uses an allowed protocol, or an empty string
 * if the URL is potentially dangerous.
 *
 * @param url - URL string to validate
 * @returns Sanitized URL or empty string
 *
 * @example
 * ```ts
 * sanitizeUrl('https://explorer.hiro.so/address/SP123')
 * // → 'https://explorer.hiro.so/address/SP123'
 *
 * sanitizeUrl('javascript:alert(1)')
 * // → ''
 * ```
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim();

  // Check for dangerous protocols (case-insensitive)
  const lower = trimmed.toLowerCase();
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lower.startsWith(protocol)) {
      return '';
    }
  }

  // Validate against allowed protocols
  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol as typeof ALLOWED_PROTOCOLS[number])) {
      return '';
    }
    return trimmed;
  } catch {
    // If URL parsing fails, it might be a relative URL or malformed
    // For href attributes, reject anything that looks like a protocol
    if (/^[a-z]+:/i.test(trimmed)) {
      return '';
    }
    // Allow relative paths (e.g. /proposals/1)
    return trimmed;
  }
}

/**
 * Encode a path segment for use in URL construction.
 *
 * Wraps encodeURIComponent to ensure user-controlled values
 * (addresses, transaction IDs, etc.) cannot break URL parsing
 * or inject additional path segments.
 *
 * @param segment - Raw path segment value
 * @returns URL-encoded segment safe for interpolation
 *
 * @example
 * ```ts
 * encodePathSegment('SP123ABC456')
 * // → 'SP123ABC456' (no special chars, unchanged)
 *
 * encodePathSegment('../../etc/passwd')
 * // → '..%2F..%2Fetc%2Fpasswd' (traversal neutralized)
 * ```
 */
export function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

/**
 * Validate that a string looks like a valid Stacks address.
 *
 * Stacks addresses start with 'SP' (mainnet) or 'ST' (testnet)
 * followed by alphanumeric characters. This is a lightweight check,
 * not a full cryptographic validation.
 *
 * @param address - String to validate
 * @returns true if the string matches the Stacks address pattern
 */
export function isValidStacksAddress(address: string): boolean {
  return /^S[PT][A-Z0-9]{38,128}$/i.test(address);
}

/**
 * Validate that a string looks like a valid transaction ID (hex string).
 *
 * Stacks transaction IDs are 64-character hex strings, optionally
 * prefixed with '0x'.
 *
 * @param txId - String to validate
 * @returns true if the string matches the txId pattern
 */
export function isValidTxId(txId: string): boolean {
  return /^(0x)?[0-9a-f]{64}$/i.test(txId);
}

/**
 * Build a safe explorer URL for a transaction.
 *
 * Validates the txId format and encodes it before constructing
 * the URL. Returns an empty string for invalid inputs.
 *
 * @param txId - Transaction ID
 * @returns Explorer URL or empty string
 */
export function safeExplorerTxUrl(txId: string): string {
  if (!txId || !isValidTxId(txId)) return '';
  return `https://explorer.hiro.so/txid/${encodePathSegment(txId)}?chain=mainnet`;
}

/**
 * Build a safe explorer URL for an address.
 *
 * Validates the address format and encodes it before constructing
 * the URL. Returns an empty string for invalid inputs.
 *
 * @param address - Stacks address
 * @returns Explorer URL or empty string
 */
export function safeExplorerAddressUrl(address: string): string {
  if (!address || !isValidStacksAddress(address)) return '';
  return `https://explorer.hiro.so/address/${encodePathSegment(address)}?chain=mainnet`;
}

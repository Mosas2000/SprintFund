/**
 * Security-related constants used across the application.
 *
 * Centralizing these values ensures consistency between the CSP
 * headers in vercel.json and runtime checks in application code.
 */

/**
 * Allowed external API origins for fetch requests.
 * These must match the connect-src directive in the CSP header.
 */
export const ALLOWED_API_ORIGINS = [
  'https://api.hiro.so',
  'https://api.mainnet.hiro.so',
  'https://stacks-node-api.mainnet.stacks.co',
] as const;

/**
 * The Explorer base URL used for transaction and address links.
 */
export const EXPLORER_BASE_URL = 'https://explorer.hiro.so';

/**
 * Maximum allowed lengths for user-generated content fields.
 * These are enforced both at the validation layer and the
 * sanitization layer.
 */
export const CONTENT_LIMITS = {
  /** Maximum proposal title length */
  TITLE_MAX: 100,
  /** Maximum proposal description length */
  DESCRIPTION_MAX: 500,
  /** Maximum toast message length */
  TOAST_TITLE_MAX: 200,
  /** Maximum toast description length */
  TOAST_DESCRIPTION_MAX: 500,
} as const;

/**
 * URL protocols that are considered safe for use in href attributes.
 */
export const SAFE_PROTOCOLS = ['https:', 'http:'] as const;

/**
 * URL protocols that must be blocked to prevent code execution
 * through href attributes or window.location assignments.
 */
export const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'blob:',
] as const;

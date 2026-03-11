/**
 * Text sanitization utilities for user-generated content.
 *
 * Although React's JSX auto-escapes string interpolation (preventing
 * most XSS), these utilities provide defense-in-depth by stripping
 * potentially dangerous content at the data layer before it ever
 * reaches a component.
 *
 * Use cases:
 * - Proposal titles and descriptions fetched from on-chain storage
 * - Error messages derived from untrusted sources
 * - Any string that originated outside our codebase
 */

/**
 * Regex matching HTML tags including self-closing and malformed variants.
 * Covers `<script>`, `<img onerror=...>`, `<a href=...>`, etc.
 */
const HTML_TAG_PATTERN = /<\/?[a-z][^>]*>/gi;

/**
 * Regex matching HTML entity references (named, decimal, and hex).
 * Catches `&lt;`, `&#60;`, `&#x3C;` etc. that could be decoded by
 * the browser in certain contexts.
 */
const HTML_ENTITY_PATTERN = /&(?:#x?[0-9a-f]+|[a-z]+);/gi;

/**
 * Regex matching common JavaScript event handler attributes that could
 * appear in crafted strings to exploit attribute-context rendering.
 */
const EVENT_HANDLER_PATTERN = /\bon\w+\s*=/gi;

/**
 * Control characters (U+0000–U+001F except tab, newline, carriage return)
 * that have no legitimate use in displayed text and can be used to
 * bypass filters or confuse parsers.
 */
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

/**
 * Strip all HTML tags from a string, returning plain text.
 *
 * This is intentionally aggressive: it removes ALL tag-like content
 * rather than trying to allow "safe" tags, because proposal titles
 * and descriptions should never contain HTML markup.
 *
 * @param input - Raw string potentially containing HTML
 * @returns Plain text with all HTML tags removed
 */
export function stripHtmlTags(input: string): string {
  return input.replace(HTML_TAG_PATTERN, '');
}

/**
 * Strip HTML entity references from a string.
 *
 * Prevents double-encoding attacks where `&lt;script&gt;` might be
 * decoded into `<script>` by a downstream consumer.
 *
 * @param input - Raw string potentially containing HTML entities
 * @returns String with entity references removed
 */
export function stripHtmlEntities(input: string): string {
  return input.replace(HTML_ENTITY_PATTERN, '');
}

/**
 * Remove inline event handler patterns (e.g. `onerror=`, `onclick=`).
 *
 * @param input - Raw string
 * @returns String with event handler patterns removed
 */
export function stripEventHandlers(input: string): string {
  return input.replace(EVENT_HANDLER_PATTERN, '');
}

/**
 * Remove non-printable control characters that have no display purpose.
 *
 * Preserves tabs (U+0009), newlines (U+000A), and carriage returns
 * (U+000D) which are legitimate whitespace in descriptions.
 *
 * @param input - Raw string
 * @returns String with control characters removed
 */
export function stripControlChars(input: string): string {
  return input.replace(CONTROL_CHAR_PATTERN, '');
}

/**
 * Comprehensive sanitization pipeline for user-generated text content.
 *
 * Applies all sanitization steps in sequence:
 * 1. Strip control characters
 * 2. Strip HTML tags
 * 3. Strip HTML entities
 * 4. Strip event handler patterns
 * 5. Trim leading/trailing whitespace
 *
 * @param input - Raw user-generated string
 * @returns Sanitized plain text safe for rendering
 *
 * @example
 * ```ts
 * sanitizeText('<script>alert("xss")</script>Hello')
 * // → 'alert("xss")Hello'
 *
 * sanitizeText('Normal proposal title')
 * // → 'Normal proposal title'
 * ```
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  let result = input;
  result = stripControlChars(result);
  result = stripHtmlTags(result);
  result = stripHtmlEntities(result);
  result = stripEventHandlers(result);
  result = result.trim();

  return result;
}

/**
 * Sanitize a multi-line text field (e.g. proposal descriptions).
 *
 * Same as sanitizeText but preserves intentional line breaks that
 * are rendered with CSS `white-space: pre-wrap`.
 *
 * @param input - Raw multi-line user-generated string
 * @returns Sanitized text with line breaks preserved
 */
export function sanitizeMultilineText(input: string): string {
  if (!input) return '';

  // Process each line individually to preserve intentional newlines
  return input
    .split('\n')
    .map((line) => sanitizeText(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n'); // Collapse excessive blank lines
}

/**
 * Truncate a sanitized string to a maximum length, appending an
 * ellipsis if truncation occurs.
 *
 * @param input - String to truncate
 * @param maxLength - Maximum character length (default 200)
 * @returns Truncated string
 */
export function truncateText(input: string, maxLength = 200): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength).trimEnd() + '...';
}

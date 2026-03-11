import { sanitizeText, sanitizeMultilineText, truncateText } from '../lib/sanitize';

interface SafeTextProps {
  /** The raw text to sanitize and display */
  children: string;
  /** Whether to preserve newlines (for multiline content like descriptions) */
  multiline?: boolean;
  /** Maximum character length before truncation */
  maxLength?: number;
  /** HTML element to render (defaults to span) */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names */
  className?: string;
  /** Additional HTML attributes */
  title?: string;
}

/**
 * SafeText renders user-generated text content with XSS sanitization applied.
 *
 * While React already escapes JSX text interpolation, SafeText provides
 * defense-in-depth by stripping HTML tags, entities, and event handler
 * attributes before rendering. This protects against edge cases where
 * raw content might bypass React's escaping layer.
 *
 * Usage:
 *   <SafeText>{proposal.title}</SafeText>
 *   <SafeText multiline maxLength={500}>{proposal.description}</SafeText>
 */
export default function SafeText({
  children,
  multiline = false,
  maxLength,
  as: Element = 'span',
  className,
  title,
}: SafeTextProps) {
  if (!children || typeof children !== 'string') {
    return null;
  }

  let sanitized = multiline
    ? sanitizeMultilineText(children)
    : sanitizeText(children);

  if (maxLength && maxLength > 0) {
    sanitized = truncateText(sanitized, maxLength);
  }

  if (multiline) {
    // Render multiline content with line breaks preserved
    const lines = sanitized.split('\n');
    return (
      <Element className={className} title={title}>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </Element>
    );
  }

  return (
    <Element className={className} title={title}>
      {sanitized}
    </Element>
  );
}

interface ErrorIconProps {
  /** Size in pixels. Defaults to 48. */
  size?: number;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Inline SVG icon showing an exclamation mark inside a circle.
 * Used in error states to provide a clear visual indicator.
 */
export function ErrorIcon({ size = 48, className = '' }: ErrorIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

import { FOCUS_RING_GREEN } from '../lib/focus-styles';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Animated three-line hamburger button for mobile navigation.
 *
 * Transitions between a hamburger icon (closed) and an X icon (open).
 * Minimum 44px touch target for mobile accessibility.
 */
export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      className={`inline-flex items-center justify-center rounded-md p-2 text-muted hover:text-text transition-colors sm:hidden min-h-[44px] min-w-[44px] ${FOCUS_RING_GREEN}`}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        {isOpen ? (
          /* X icon */
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        ) : (
          /* Hamburger icon */
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}

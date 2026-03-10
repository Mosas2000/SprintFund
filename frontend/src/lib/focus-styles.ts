/**
 * Shared focus-visible utility classes for keyboard navigation.
 *
 * These Tailwind classes add a visible focus ring only when the element
 * is focused via keyboard (not mouse), following the :focus-visible spec.
 */

/** Green focus ring on dark background - for primary action buttons. */
export const FOCUS_RING_GREEN =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-dark';

/** Red focus ring on dark background - for destructive action buttons. */
export const FOCUS_RING_RED =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-dark';

/** Muted border focus ring - for neutral/secondary buttons. */
export const FOCUS_RING_MUTED =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-dark';

/** Inset focus ring - for inputs and form controls. */
export const FOCUS_RING_INSET =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-inset';

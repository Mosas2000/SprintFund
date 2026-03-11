/**
 * Tailwind CSS breakpoint values in pixels.
 *
 * These match the default Tailwind breakpoints and are used
 * in JavaScript when media queries need to be created manually
 * (e.g. in the useMobileMenu hook).
 */
export const BREAKPOINTS = {
  /** 640px - small devices (landscape phones) */
  sm: 640,
  /** 768px - medium devices (tablets) */
  md: 768,
  /** 1024px - large devices (desktops) */
  lg: 1024,
  /** 1280px - extra large devices (large desktops) */
  xl: 1280,
} as const;

/**
 * Minimum touch target size as recommended by WCAG 2.5.5.
 *
 * All interactive elements on mobile should be at least this size.
 */
export const MIN_TOUCH_TARGET = 44;

/**
 * Shared responsive Tailwind utility classes.
 */
export const RESPONSIVE = {
  /** Full-width on mobile, auto on desktop */
  fullWidthMobile: 'w-full sm:w-auto',

  /** Container padding that adjusts per breakpoint */
  containerPadding: 'px-4 sm:px-6',

  /** Touch-friendly button padding */
  touchButton: 'py-3 min-h-[44px]',

  /** Touch-friendly input height */
  touchInput: 'py-2.5 min-h-[44px]',
} as const;

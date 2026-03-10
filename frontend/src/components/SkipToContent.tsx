/**
 * Skip-to-content link for keyboard and screen reader users.
 *
 * Renders an anchor that is visually hidden until focused via Tab.
 * When activated it jumps focus to the element with id="main-content".
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-green focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-dark focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-dark"
    >
      Skip to main content
    </a>
  );
}

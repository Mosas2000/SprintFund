import { useEffect, useRef } from 'react';

/**
 * Returns a ref that focuses the attached element when the component mounts.
 *
 * Useful for moving keyboard focus to the page heading after a route
 * change so keyboard and screen reader users start at the right place.
 * Uses tabIndex=-1 on the target to allow programmatic focus without
 * adding the element to the tab order.
 */
export function useFocusOnMount<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ref.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return ref;
}

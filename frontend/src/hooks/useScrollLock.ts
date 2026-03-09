import { useEffect } from 'react';

/**
 * Prevents background page scrolling while `active` is true.
 *
 * Sets `overflow: hidden` on the document body and restores the
 * original value when deactivated or when the component unmounts.
 *
 * @param active - Whether scrolling should be locked
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [active]);
}

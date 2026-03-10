import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveRouteTitle } from '../lib/route-titles';

/**
 * Announces route changes to screen readers via a visually-hidden live region.
 *
 * On each pathname change the hook updates an off-screen element with
 * aria-live="assertive" so assistive technology announces the new page.
 * Returns a ref that should be attached to the announcer element.
 *
 * Skips the initial mount so the first page load is not double-announced.
 */
export function useRouteAnnouncer() {
  const { pathname } = useLocation();
  const announcerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const title = resolveRouteTitle(pathname);

    if (announcerRef.current) {
      announcerRef.current.textContent = `Navigated to ${title}`;
    }
  }, [pathname]);

  return announcerRef;
}

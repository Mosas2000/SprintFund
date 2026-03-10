import { useRouteAnnouncer } from '../hooks/useRouteAnnouncer';

/**
 * Visually-hidden live region that announces route changes to screen readers.
 *
 * Mount this component once inside a Router context. On each navigation
 * the announcer updates its text content to "Navigated to {page title}"
 * which is picked up by assistive technology via aria-live="assertive".
 */
export function RouteAnnouncer() {
  const announcerRef = useRouteAnnouncer();

  return (
    <div
      ref={announcerRef}
      aria-live="assertive"
      aria-atomic="true"
      role="status"
      className="sr-only"
    />
  );
}

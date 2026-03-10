/**
 * Maps route paths to human-readable page titles for screen reader announcements.
 */
export const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/proposals': 'Proposals',
  '/proposals/create': 'Create Proposal',
  '/dashboard': 'Dashboard',
};

/**
 * Resolves a pathname to a page title.
 *
 * Static routes are matched first. Dynamic routes like /proposals/:id
 * receive a generic fallback title.
 */
export function resolveRouteTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  if (/^\/proposals\/\d+$/.test(pathname)) {
    return 'Proposal Detail';
  }

  return 'Page';
}

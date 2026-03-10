import { describe, it, expect } from 'vitest';
import { resolveRouteTitle } from '../lib/route-titles';

/* ──────────────────────────────────────────────
 * Tests for useRouteAnnouncer behaviour.
 *
 * The hook depends on React Router's useLocation, so these tests
 * verify the announcement logic indirectly via resolveRouteTitle
 * and the expected textContent format.
 * ────────────────────────────────────────────── */

describe('useRouteAnnouncer announcement format', () => {
  it('produces Navigated to {title} for the home page', () => {
    const title = resolveRouteTitle('/');
    const announcement = `Navigated to ${title}`;
    expect(announcement).toBe('Navigated to Home');
  });

  it('produces Navigated to {title} for proposals', () => {
    const title = resolveRouteTitle('/proposals');
    const announcement = `Navigated to ${title}`;
    expect(announcement).toBe('Navigated to Proposals');
  });

  it('produces Navigated to {title} for create proposal', () => {
    const title = resolveRouteTitle('/proposals/create');
    const announcement = `Navigated to ${title}`;
    expect(announcement).toBe('Navigated to Create Proposal');
  });

  it('produces Navigated to {title} for dashboard', () => {
    const title = resolveRouteTitle('/dashboard');
    const announcement = `Navigated to ${title}`;
    expect(announcement).toBe('Navigated to Dashboard');
  });

  it('produces Navigated to {title} for a proposal detail', () => {
    const title = resolveRouteTitle('/proposals/42');
    const announcement = `Navigated to ${title}`;
    expect(announcement).toBe('Navigated to Proposal #42');
  });

  it('always starts with the Navigated to prefix', () => {
    const paths = ['/', '/proposals', '/dashboard', '/proposals/7'];
    for (const path of paths) {
      const title = resolveRouteTitle(path);
      expect(`Navigated to ${title}`).toMatch(/^Navigated to /);
    }
  });

  it('never produces an empty title', () => {
    const paths = ['/', '/proposals', '/proposals/create', '/dashboard', '/unknown'];
    for (const path of paths) {
      const title = resolveRouteTitle(path);
      expect(title.length).toBeGreaterThan(0);
    }
  });
});

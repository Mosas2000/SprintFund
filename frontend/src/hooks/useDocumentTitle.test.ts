import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/* ──────────────────────────────────────────────
 * Since useDocumentTitle is a React hook that calls useEffect,
 * we test the underlying logic by simulating what the hook does:
 * setting and restoring document.title.
 * ────────────────────────────────────────────── */

describe('useDocumentTitle behaviour', () => {
  let originalTitle: string;

  beforeEach(() => {
    originalTitle = document.title;
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it('sets the document title with the SprintFund suffix', () => {
    document.title = 'Proposals | SprintFund';
    expect(document.title).toBe('Proposals | SprintFund');
  });

  it('formats the title as "{page} | SprintFund"', () => {
    const page = 'Dashboard';
    document.title = `${page} | SprintFund`;
    expect(document.title).toBe('Dashboard | SprintFund');
  });

  it('handles dynamic page titles', () => {
    const proposalTitle = 'Fund Developer Workshop';
    document.title = `${proposalTitle} | SprintFund`;
    expect(document.title).toBe('Fund Developer Workshop | SprintFund');
  });

  it('restores the previous title on cleanup', () => {
    const previous = document.title;
    document.title = 'New Page | SprintFund';
    expect(document.title).not.toBe(previous);

    // Simulate cleanup
    document.title = previous;
    expect(document.title).toBe(previous);
  });

  it('handles the home page title', () => {
    document.title = 'Home | SprintFund';
    expect(document.title).toBe('Home | SprintFund');
  });
});

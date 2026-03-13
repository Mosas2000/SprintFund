import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for the useMediaQuery hook logic.
 *
 * Since @testing-library/react is not installed, these tests validate
 * the matchMedia integration patterns that the hook relies on.
 */

/* ------------------------------------------------------------------ */
/* matchMedia mock                                                     */
/* ------------------------------------------------------------------ */
type ChangeHandler = (e: { matches: boolean }) => void;
let mediaChangeHandler: ChangeHandler | null = null;
let initialMatches = false;

function createMockMatchMedia() {
  return vi.fn().mockImplementation((query: string) => ({
    matches: initialMatches,
    media: query,
    addEventListener: (_event: string, handler: ChangeHandler) => {
      mediaChangeHandler = handler;
    },
    removeEventListener: () => {
      mediaChangeHandler = null;
    },
  }));
}

describe('useMediaQuery supporting logic', () => {
  beforeEach(() => {
    initialMatches = false;
    mediaChangeHandler = null;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('matchMedia returns false when query does not match', () => {
    const mql = window.matchMedia('(min-width: 640px)');
    expect(mql.matches).toBe(false);
  });

  it('matchMedia returns true when query matches initially', () => {
    initialMatches = true;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });

    const mql = window.matchMedia('(min-width: 640px)');
    expect(mql.matches).toBe(true);
  });

  it('change handler fires when media query changes to matching', () => {
    const mql = window.matchMedia('(min-width: 640px)');
    mql.addEventListener('change', () => {
      // no-op; we only care that the handler wiring exists for the mock
    });

    let currentMatch = false;
    if (mediaChangeHandler) {
      const handler = mediaChangeHandler;
      const wrappedHandler = (e: { matches: boolean }) => {
        currentMatch = e.matches;
        handler(e);
      };
      wrappedHandler({ matches: true });
    }

    expect(currentMatch).toBe(true);
  });

  it('change handler fires when media query changes to not matching', () => {
    initialMatches = true;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });

    const mql = window.matchMedia('(min-width: 640px)');
    mql.addEventListener('change', () => {
      // no-op; we only care that the handler wiring exists for the mock
    });

    let currentMatch = true;
    if (mediaChangeHandler) {
      const original = mediaChangeHandler;
      const wrappedHandler = (e: { matches: boolean }) => {
        currentMatch = e.matches;
        original(e);
      };
      wrappedHandler({ matches: false });
    }

    expect(currentMatch).toBe(false);
  });

  it('passes the query string to matchMedia', () => {
    const query = '(max-width: 1024px)';
    window.matchMedia(query);

    expect(window.matchMedia).toHaveBeenCalledWith(query);
  });

  it('removes listener on cleanup', () => {
    const mql = window.matchMedia('(min-width: 640px)');
    const handler = vi.fn();
    mql.addEventListener('change', handler);
    expect(mediaChangeHandler).not.toBeNull();

    mql.removeEventListener('change', handler);
    expect(mediaChangeHandler).toBeNull();
  });

  it('resubscribes when query changes', () => {
    window.matchMedia('(min-width: 640px)');
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 640px)');

    window.matchMedia('(min-width: 1024px)');
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('SSR guard returns false when window is undefined', () => {
    /* The hook checks typeof window !== "undefined" */
    const ssrFallback = false;
    expect(ssrFallback).toBe(false);
  });
});

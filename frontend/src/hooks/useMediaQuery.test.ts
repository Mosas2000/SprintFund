import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

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

describe('useMediaQuery', () => {
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

  it('returns false when media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when media query matches initially', () => {
    initialMatches = true;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
    expect(result.current).toBe(true);
  });

  it('updates when media query changes to matching', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
    expect(result.current).toBe(false);

    act(() => {
      if (mediaChangeHandler) {
        mediaChangeHandler({ matches: true });
      }
    });

    expect(result.current).toBe(true);
  });

  it('updates when media query changes to not matching', () => {
    initialMatches = true;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 640px)'));
    expect(result.current).toBe(true);

    act(() => {
      if (mediaChangeHandler) {
        mediaChangeHandler({ matches: false });
      }
    });

    expect(result.current).toBe(false);
  });

  it('passes the query string to matchMedia', () => {
    const query = '(max-width: 1024px)';
    renderHook(() => useMediaQuery(query));

    expect(window.matchMedia).toHaveBeenCalledWith(query);
  });

  it('removes listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 640px)'));

    expect(mediaChangeHandler).not.toBeNull();

    unmount();

    expect(mediaChangeHandler).toBeNull();
  });

  it('resubscribes when query string changes', () => {
    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 640px)' } },
    );

    /* First subscription cleaned up, new one created */
    rerender({ query: '(min-width: 1024px)' });

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});

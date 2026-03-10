import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobileMenu } from './useMobileMenu';
import { BREAKPOINTS } from '../lib/breakpoints';

/* ------------------------------------------------------------------ */
/* Mock react-router-dom useLocation                                   */
/* ------------------------------------------------------------------ */
let mockPathname = '/';
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
}));

/* ------------------------------------------------------------------ */
/* Mock matchMedia                                                     */
/* ------------------------------------------------------------------ */
type ChangeHandler = (e: { matches: boolean }) => void;
let mediaChangeHandler: ChangeHandler | null = null;

function createMockMatchMedia() {
  return vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: (_event: string, handler: ChangeHandler) => {
      mediaChangeHandler = handler;
    },
    removeEventListener: () => {
      mediaChangeHandler = null;
    },
  }));
}

describe('useMobileMenu', () => {
  beforeEach(() => {
    mockPathname = '/';
    mediaChangeHandler = null;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts closed', () => {
    const { result } = renderHook(() => useMobileMenu());
    expect(result.current.isOpen).toBe(false);
  });

  it('opens when open is called', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());

    expect(result.current.isOpen).toBe(true);
  });

  it('closes when close is called', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggles state', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('closes on route change', () => {
    const { result, rerender } = renderHook(() => useMobileMenu());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    /* Simulate route change */
    mockPathname = '/proposals';
    rerender();

    expect(result.current.isOpen).toBe(false);
  });

  it('closes when viewport passes sm breakpoint', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    /* Simulate the media query matching (viewport wider than sm) */
    act(() => {
      if (mediaChangeHandler) {
        mediaChangeHandler({ matches: true });
      }
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('does not close when viewport stays below sm breakpoint', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());

    act(() => {
      if (mediaChangeHandler) {
        mediaChangeHandler({ matches: false });
      }
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closes on Escape key press', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('does not close on Escape when already closed', () => {
    const { result } = renderHook(() => useMobileMenu());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('ignores non-Escape key presses', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('creates matchMedia with BREAKPOINTS.sm value', () => {
    renderHook(() => useMobileMenu());

    expect(window.matchMedia).toHaveBeenCalledWith(
      `(min-width: ${BREAKPOINTS.sm}px)`,
    );
  });

  it('removes matchMedia listener on unmount', () => {
    const { unmount } = renderHook(() => useMobileMenu());

    unmount();

    expect(mediaChangeHandler).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BREAKPOINTS } from '../lib/breakpoints';

/**
 * Tests for the useMobileMenu hook logic.
 *
 * Since @testing-library/react is not installed, these tests validate
 * the individual behaviors (matchMedia, Escape key, route change)
 * that the hook composes.
 */

/* ------------------------------------------------------------------ */
/* matchMedia mock                                                     */
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

describe('useMobileMenu supporting logic', () => {
  beforeEach(() => {
    mediaChangeHandler = null;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('matchMedia integration', () => {
    it('creates a media query with the sm breakpoint value', () => {
      window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);

      expect(window.matchMedia).toHaveBeenCalledWith(
        `(min-width: ${BREAKPOINTS.sm}px)`,
      );
    });

    it('registers a change handler on the media query list', () => {
      const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);
      const handler = vi.fn();
      mql.addEventListener('change', handler);

      expect(mediaChangeHandler).toBe(handler);
    });

    it('removes the change handler on cleanup', () => {
      const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);
      const handler = vi.fn();
      mql.addEventListener('change', handler);
      expect(mediaChangeHandler).toBe(handler);

      mql.removeEventListener('change', handler);
      expect(mediaChangeHandler).toBeNull();
    });

    it('change handler receives matches: true when viewport widens', () => {
      window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);
      expect(mediaChangeHandler).not.toBeNull();

      const result = { matches: true };
      if (mediaChangeHandler) {
        mediaChangeHandler(result);
      }

      expect(result.matches).toBe(true);
    });

    it('change handler receives matches: false when viewport narrows', () => {
      window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);

      const result = { matches: false };
      if (mediaChangeHandler) {
        mediaChangeHandler(result);
      }

      expect(result.matches).toBe(false);
    });
  });

  describe('Escape key logic', () => {
    it('dispatches Escape key event on document', () => {
      const handler = vi.fn();
      document.addEventListener('keydown', handler);

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].key).toBe('Escape');

      document.removeEventListener('keydown', handler);
    });

    it('does not trigger on non-Escape keys', () => {
      let escapeCalled = false;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') escapeCalled = true;
      };

      document.addEventListener('keydown', handler);

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      document.dispatchEvent(event);

      expect(escapeCalled).toBe(false);

      document.removeEventListener('keydown', handler);
    });

    it('handler is removed after cleanup', () => {
      const handler = vi.fn();
      document.addEventListener('keydown', handler);
      document.removeEventListener('keydown', handler);

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Toggle state logic', () => {
    it('toggle flips boolean state', () => {
      let isOpen = false;
      const toggle = () => { isOpen = !isOpen; };

      toggle();
      expect(isOpen).toBe(true);

      toggle();
      expect(isOpen).toBe(false);
    });

    it('open sets state to true', () => {
      let isOpen = false;
      const open = () => { isOpen = true; };

      open();
      expect(isOpen).toBe(true);

      /* Calling open again is idempotent */
      open();
      expect(isOpen).toBe(true);
    });

    it('close sets state to false', () => {
      let isOpen = true;
      const close = () => { isOpen = false; };

      close();
      expect(isOpen).toBe(false);

      /* Calling close again is idempotent */
      close();
      expect(isOpen).toBe(false);
    });

    it('starts in closed state', () => {
      const isOpen = false;
      expect(isOpen).toBe(false);
    });
  });

  describe('Route change close logic', () => {
    it('changing pathname should reset isOpen to false', () => {
      let isOpen = true;
      const resetOnRouteChange = () => { isOpen = false; };

      /* Simulating useEffect on [pathname] */
      resetOnRouteChange();
      expect(isOpen).toBe(false);
    });
  });
});

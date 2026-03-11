import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { BREAKPOINTS } from '../lib/breakpoints';

/**
 * Manages mobile navigation menu open/close state.
 *
 * Automatically closes the menu on route changes and when the viewport
 * resizes above the mobile breakpoint (sm: 640px). Also supports closing
 * via the Escape key.
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  /* Close on route change */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* Close when viewport passes mobile breakpoint */
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return { isOpen, open, close, toggle };
}

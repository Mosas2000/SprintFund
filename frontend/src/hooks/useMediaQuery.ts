import { useState, useEffect } from 'react';

/**
 * Subscribes to a CSS media query and returns whether it matches.
 *
 * Useful for conditionally rendering content at different breakpoints
 * when CSS alone is insufficient (e.g. rendering different component trees).
 *
 * @param query - A valid CSS media query string, e.g. "(min-width: 640px)"
 * @returns true when the media query matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

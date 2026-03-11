import { useRef, useCallback } from 'react';

/**
 * Returns a stable callback reference that always invokes the latest
 * version of `callback`.
 *
 * Unlike `useCallback`, the returned function identity never changes,
 * making it safe to pass to memoized children without invalidating
 * their props. The trade-off is that the callback always reads the
 * latest closure values via a ref, so it should only be used for
 * event handlers (not effects) where staleness is not a concern.
 *
 * @example
 * ```tsx
 * const handleClick = useStableCallback((id: number) => {
 *   doSomething(id, latestState);
 * });
 * // handleClick identity never changes
 * <MemoizedChild onClick={handleClick} />
 * ```
 */
export function useStableCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R,
): (...args: Args) => R {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Args) => callbackRef.current(...args), []);
}

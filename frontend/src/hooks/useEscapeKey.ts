import { useEffect, useCallback } from 'react';

/**
 * Calls the given handler when the Escape key is pressed and the
 * hook is active. Cleans up the event listener when deactivated
 * or when the component unmounts.
 *
 * @param active - Whether the Escape listener should be attached
 * @param handler - The function to call when Escape is pressed
 */
export function useEscapeKey(active: boolean, handler: () => void): void {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler();
      }
    },
    [handler],
  );

  useEffect(() => {
    if (!active) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, onKeyDown]);
}

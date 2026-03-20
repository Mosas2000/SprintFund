import { useEffect, useCallback } from 'react';

export interface ArrowKeyCallbacks {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}

export function useArrowKeys(callbacks: ArrowKeyCallbacks, enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowUp':
          if (callbacks.onUp) {
            event.preventDefault();
            callbacks.onUp();
          }
          break;
        case 'ArrowDown':
          if (callbacks.onDown) {
            event.preventDefault();
            callbacks.onDown();
          }
          break;
        case 'ArrowLeft':
          if (callbacks.onLeft) {
            event.preventDefault();
            callbacks.onLeft();
          }
          break;
        case 'ArrowRight':
          if (callbacks.onRight) {
            event.preventDefault();
            callbacks.onRight();
          }
          break;
      }
    },
    [callbacks, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

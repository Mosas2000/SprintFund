import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  enabled = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback, enabled]);

  return ref;
}

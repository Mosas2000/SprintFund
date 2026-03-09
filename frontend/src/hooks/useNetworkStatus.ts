import { useState, useEffect } from 'react';

/**
 * Tracks the browser's online/offline status in real time.
 *
 * Returns `true` when the browser reports being online.
 * Components can use this to show an offline banner or disable
 * actions that require network connectivity.
 */
export function useNetworkStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}

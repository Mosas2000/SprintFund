import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * Fixed banner shown at the top of the viewport when the browser is offline.
 * Automatically hides when connectivity is restored.
 */
export function OfflineBanner() {
  const online = useNetworkStatus();

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-x-0 top-0 z-50 bg-red/90 px-4 py-2 text-center text-xs font-medium text-white backdrop-blur-sm"
    >
      You are offline. Some features may be unavailable until your connection is restored.
    </div>
  );
}

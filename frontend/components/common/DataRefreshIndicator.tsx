'use client';

import { useEffect, useState } from 'react';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

export function DataRefreshIndicator() {
  const { loading } = useGovernanceAnalytics();
  const [lastUpdated] = useState<Date>(new Date());
  const [timeSinceUpdate, setTimeSinceUpdate] = useState('now');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);

      if (diffMins === 0) {
        setTimeSinceUpdate(`${diffSecs}s ago`);
      } else if (diffMins < 60) {
        setTimeSinceUpdate(`${diffMins}m ago`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setTimeSinceUpdate(`${diffHours}h ago`);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-white/60">
      <div className={`flex items-center gap-1.5 ${loading ? 'opacity-50' : ''}`}>
        <div
          className={`w-2 h-2 rounded-full ${
            loading ? 'bg-yellow-400' : 'bg-green-400'
          } ${loading ? 'animate-pulse' : ''}`}
        />
        <span>{loading ? 'Updating...' : `Updated ${timeSinceUpdate}`}</span>
      </div>
    </div>
  );
}

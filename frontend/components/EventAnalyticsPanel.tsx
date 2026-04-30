'use client';

import React from 'react';
import { useContractEvents } from '../src/hooks/useContractEvents';
import { getEventStats, groupEventsByCategory } from '../src/lib/event-utilities';
import { GOVERNANCE_CONFIG } from '../src/lib/governance-config';
import { BarChart3, TrendingUp } from 'lucide-react';

interface EventAnalyticsPanelProps {
  contractPrincipal?: string;
}

export const EventAnalyticsPanel: React.FC<EventAnalyticsPanelProps> = ({
  contractPrincipal = GOVERNANCE_CONFIG.CONTRACT_PRINCIPAL,
}) => {
  const { events, isLoading } = useContractEvents({
    contractPrincipal,
    pollInterval: GOVERNANCE_CONFIG.EVENT_POLL_INTERVAL,
  });

  const stats = getEventStats(events);
  const byCategory = groupEventsByCategory(events);

  const successRate = stats.total > 0 
    ? ((stats.succeeded / stats.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Event Analytics</h3>
        </div>

        {isLoading && events.length === 0 ? (
          <div className="text-sm text-gray-500">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Successful</p>
              <p className="text-2xl font-bold text-green-700">{stats.succeeded}</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-blue-700">{successRate}%</p>
            </div>
          </div>
        )}
      </div>

      {byCategory.size > 0 && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h4 className="text-base font-semibold text-gray-900">By Category</h4>
          </div>

          <div className="space-y-3">
            {Array.from(byCategory.entries()).map(([category, catEvents]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(catEvents.length / stats.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {catEvents.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAnalyticsPanel;

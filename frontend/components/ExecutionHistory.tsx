'use client';

import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ExecutionHistoryProps {
  history: Array<{
    transactionId: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: string;
    blockHeight?: number;
    errorMessage?: string;
  }>;
}

export function ExecutionHistory({ history }: ExecutionHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Execution History</h3>
        <p className="text-white/60 text-center py-8">No execution history available</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'confirmed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">Execution History</h3>

      <div className="space-y-3">
        {history.map((entry, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(entry.status)}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-medium ${getStatusColor(entry.status)}`}>
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </p>

              <p className="text-sm text-white/60 mt-1 font-mono break-all">
                {entry.transactionId}
              </p>

              <p className="text-xs text-white/40 mt-2">
                {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
              </p>

              {entry.blockHeight && (
                <p className="text-xs text-white/40 mt-1">Block: {entry.blockHeight}</p>
              )}

              {entry.errorMessage && (
                <p className="text-xs text-red-400 mt-2 bg-red-500/10 p-2 rounded">
                  {entry.errorMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

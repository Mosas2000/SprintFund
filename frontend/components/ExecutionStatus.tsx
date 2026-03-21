'use client';

import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ExecutionStatusProps {
  status: 'pending' | 'executing' | 'completed' | 'failed';
  transactionId?: string;
  blockHeight?: number;
  executedAt?: string;
  errorMessage?: string;
}

export function ExecutionStatus({
  status,
  transactionId,
  blockHeight,
  executedAt,
  errorMessage,
}: ExecutionStatusProps) {
  const statusConfig = {
    pending: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      icon: Clock,
      label: 'Pending',
    },
    executing: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      icon: Clock,
      label: 'Executing',
    },
    completed: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      icon: CheckCircle,
      label: 'Completed',
    },
    failed: {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      icon: AlertCircle,
      label: 'Failed',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} rounded-xl p-6 border border-${config.color}/20`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 ${config.color} flex-shrink-0 mt-0.5`} />

        <div className="flex-1">
          <h3 className={`font-bold ${config.color}`}>{config.label}</h3>

          <div className="mt-3 space-y-2 text-sm text-white/70">
            {transactionId && (
              <div>
                <p className="text-white/60">Transaction:</p>
                <p className="font-mono text-xs break-all">{transactionId}</p>
              </div>
            )}

            {blockHeight && (
              <div>
                <p className="text-white/60">Block Height: {blockHeight}</p>
              </div>
            )}

            {executedAt && (
              <div>
                <p className="text-white/60">
                  {new Date(executedAt).toLocaleDateString()} {new Date(executedAt).toLocaleTimeString()}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                <p className="text-red-400 text-xs">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

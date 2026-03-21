'use client';

import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { TransactionStatus } from '@/types/transaction';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  confirmations?: number;
}

export default function TransactionStatusBadge({ status, confirmations }: TransactionStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: confirmations ? `Pending (${confirmations}/3)` : 'Pending',
          className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        };
      case 'confirmed':
        return {
          icon: CheckCircle2,
          label: 'Confirmed',
          className: 'bg-green-500/10 text-green-600 border-green-500/20',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Failed',
          className: 'bg-red-500/10 text-red-600 border-red-500/20',
        };
      case 'dropped':
        return {
          icon: AlertCircle,
          label: 'Dropped',
          className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        };
      default:
        return {
          icon: Clock,
          label: 'Unknown',
          className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

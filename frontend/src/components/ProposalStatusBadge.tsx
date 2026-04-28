import type { ProposalStatusInfo } from '../lib/proposal-status';

interface ProposalStatusBadgeProps {
  statusInfo: ProposalStatusInfo;
  className?: string;
}

export function ProposalStatusBadge({ statusInfo, className = '' }: ProposalStatusBadgeProps) {
  const variantStyles = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    neutral: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variantStyles[statusInfo.variant]
      } ${className}`}
      title={statusInfo.description}
    >
      {statusInfo.label}
    </span>
  );
}

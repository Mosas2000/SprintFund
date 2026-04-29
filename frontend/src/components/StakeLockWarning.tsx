import { formatSTX } from '../utils/formatSTX';

interface StakeLockWarningProps {
  lockedAmount: number;
  activeVotes: number;
  variant?: 'info' | 'warning' | 'error';
}

export function StakeLockWarning({ lockedAmount, activeVotes, variant = 'warning' }: StakeLockWarningProps) {
  const variantStyles = {
    info: 'border-blue-400/20 bg-blue-500/10 text-blue-200',
    warning: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
    error: 'border-red-400/20 bg-red-500/10 text-red-200',
  };

  const iconPaths = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 ${variantStyles[variant]}`}>
      <svg
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconPaths[variant]}
        />
      </svg>
      <div className="text-xs">
        <p className="font-medium">
          {formatSTX(lockedAmount)} STX locked in {activeVotes} active {activeVotes === 1 ? 'vote' : 'votes'}
        </p>
        <p className="mt-1 opacity-90">
          These funds are reserved as voting costs and will become available after the voting periods end.
        </p>
      </div>
    </div>
  );
}

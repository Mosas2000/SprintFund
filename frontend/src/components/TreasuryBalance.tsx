import { memo } from 'react';
import { formatStx } from '../config';
import { useStxPriceData } from '../hooks/useStxPrice';
import { formatUsd, stxToUsd } from '../lib/currency';
import { useTreasuryBalance } from '../hooks/useTreasuryBalance';

interface TreasuryBalanceProps {
  className?: string;
}

export const TreasuryBalance = memo(function TreasuryBalance({
  className = '',
}: TreasuryBalanceProps) {
  const { balance, loading, error } = useTreasuryBalance();
  const { price } = useStxPriceData();

  if (loading && balance === null) {
    return (
      <div className={`rounded-xl border border-border bg-card p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-border rounded mb-2" />
          <div className="h-6 w-32 bg-border rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border border-border bg-card p-4 ${className}`}>
        <p className="text-xs text-muted">Treasury Balance</p>
        <p className="text-sm text-red mt-1">Failed to load</p>
      </div>
    );
  }

  const usdValue = balance !== null && price ? stxToUsd(balance / 1_000_000, price) : null;

  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 ${className}`}
      role="region"
      aria-label="DAO Treasury balance"
    >
      <p className="text-xs text-muted mb-1">Total Value Locked</p>
      <p className="text-lg font-bold text-text">
        {balance !== null ? formatStx(balance) : '—'} STX
      </p>
      {usdValue !== null && (
        <p className="text-sm text-muted mt-0.5">{formatUsd(usdValue)}</p>
      )}
    </div>
  );
});

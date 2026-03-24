import { memo } from 'react';
import { useWalletBalanceData } from '../hooks/useWalletBalance';
import { useStxPriceData } from '../hooks/useStxPrice';
import { formatStx } from '../config';
import { formatUsd, formatPercentage, stxToUsd } from '../lib/currency';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';

interface WalletBalanceDisplayProps {
  compact?: boolean;
}

export const WalletBalanceDisplay = memo(function WalletBalanceDisplay({
  compact = false,
}: WalletBalanceDisplayProps) {
  const { stxBalance, loading: balanceLoading } = useWalletBalanceData();
  const { price, change24h, loading: priceLoading } = useStxPriceData();

  if (balanceLoading && stxBalance === null) {
    return (
      <div className="flex items-center gap-1.5" role="status" aria-label="Loading balance">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-border border-t-green" />
        {!compact && <span className="text-xs text-muted">Loading...</span>}
      </div>
    );
  }

  if (stxBalance === null) {
    return null;
  }

  const usdValue = price ? stxToUsd(stxBalance, price) : null;
  const isPositiveChange = (change24h ?? 0) >= 0;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg bg-surface/50 px-2.5 py-1.5 ${FOCUS_RING_GREEN}`}
        role="status"
        aria-label={`Wallet balance: ${formatStx(stxBalance * 1_000_000)} STX`}
      >
        <span className="text-xs font-mono text-text">
          {formatStx(stxBalance * 1_000_000)}
        </span>
        <span className="text-xs text-muted">STX</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-border bg-card p-4"
      role="region"
      aria-label="Wallet balance"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted mb-1">Wallet Balance</p>
          <p className="text-lg font-bold text-text">
            {formatStx(stxBalance * 1_000_000)} STX
          </p>
          {usdValue !== null && (
            <p className="text-sm text-muted mt-0.5">
              {formatUsd(usdValue)}
            </p>
          )}
        </div>
        {price !== null && (
          <div className="text-right">
            <p className="text-xs text-muted mb-1">STX Price</p>
            <p className="text-sm font-medium text-text">{formatUsd(price)}</p>
            {change24h !== null && (
              <p
                className={`text-xs mt-0.5 ${
                  isPositiveChange ? 'text-green' : 'text-red'
                }`}
              >
                {formatPercentage(change24h)}
              </p>
            )}
          </div>
        )}
      </div>
      {priceLoading && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <div className="h-2 w-2 animate-spin rounded-full border border-muted border-t-green" />
          <span>Updating price...</span>
        </div>
      )}
    </div>
  );
});

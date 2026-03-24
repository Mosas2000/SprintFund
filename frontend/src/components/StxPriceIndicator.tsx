import { memo } from 'react';
import { useStxPriceData } from '../hooks/useStxPrice';
import { formatUsd, formatPercentage } from '../lib/currency';

export const StxPriceIndicator = memo(function StxPriceIndicator() {
  const { price, change24h, loading, error } = useStxPriceData();

  if (error) {
    return null;
  }

  if (loading && price === null) {
    return (
      <div
        className="flex items-center gap-1 px-2 py-1"
        role="status"
        aria-label="Loading STX price"
      >
        <div className="h-2.5 w-2.5 animate-spin rounded-full border border-muted border-t-green" />
      </div>
    );
  }

  if (price === null) {
    return null;
  }

  const isPositive = (change24h ?? 0) >= 0;

  return (
    <div
      className="flex items-center gap-1.5 text-xs"
      role="status"
      aria-label={`STX price: ${formatUsd(price)}, ${change24h !== null ? formatPercentage(change24h) : ''}`}
    >
      <span className="text-muted">STX</span>
      <span className="font-medium text-text">{formatUsd(price)}</span>
      {change24h !== null && (
        <span className={isPositive ? 'text-green' : 'text-red'}>
          {formatPercentage(change24h)}
        </span>
      )}
    </div>
  );
});

import React, { useEffect, useState } from 'react';
import { getStxBalance, getTxStatus } from '../lib/api';
import { useAsyncError } from '../hooks/useAsyncError';
import { ErrorMessage } from './common/ErrorMessage';
import { AsyncError } from '../../src/lib/async-errors';

interface DashboardErrorProps {
  title: string;
  error: AsyncError | null;
  onRetry: () => Promise<void>;
  onDismiss: () => void;
}

const SectionError: React.FC<DashboardErrorProps> = ({
  title,
  error,
  onRetry,
  onDismiss,
}) => (
  <div className="p-4 border rounded-lg border-gray-200">
    <h3 className="font-semibold text-lg mb-3">{title}</h3>
    <ErrorMessage error={error} onRetry={onRetry} onDismiss={onDismiss} />
  </div>
);

interface DashboardProps {
  address: string;
}

export const DashboardWithErrorHandling: React.FC<DashboardProps> = ({
  address,
}) => {
  const balanceHandler = useAsyncError();
  const txStatusHandler = useAsyncError();

  const [balance, setBalance] = useState<number | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  useEffect(() => {
    balanceHandler.execute(async () => {
      const bal = await getStxBalance(address);
      setBalance(bal);
      return bal;
    });
  }, [address]);

  useEffect(() => {
    txStatusHandler.execute(async () => {
      const status = await getTxStatus('recent-tx-id');
      setTxStatus(status);
      return status;
    });
  }, []);

  const handleBalanceRetry = async () => {
    balanceHandler.clearError();
    await balanceHandler.retry(async () => {
      const bal = await getStxBalance(address);
      setBalance(bal);
      return bal;
    });
  };

  const handleTxStatusRetry = async () => {
    txStatusHandler.clearError();
    await txStatusHandler.retry(async () => {
      const status = await getTxStatus('recent-tx-id');
      setTxStatus(status);
      return status;
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg border-gray-200">
          <h3 className="font-semibold text-lg mb-3">STX Balance</h3>

          {balanceHandler.error && (
            <SectionError
              title="Balance Error"
              error={balanceHandler.error}
              onRetry={handleBalanceRetry}
              onDismiss={balanceHandler.clearError}
            />
          )}

          {balanceHandler.isLoading && !balance && (
            <div className="text-gray-500">Loading balance...</div>
          )}

          {!balanceHandler.isLoading && balance !== null && !balanceHandler.error && (
            <div className="text-2xl font-bold text-green-600">{balance} STX</div>
          )}
        </div>

        <div className="p-4 border rounded-lg border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Transaction Status</h3>

          {txStatusHandler.error && (
            <SectionError
              title="Status Error"
              error={txStatusHandler.error}
              onRetry={handleTxStatusRetry}
              onDismiss={txStatusHandler.clearError}
            />
          )}

          {txStatusHandler.isLoading && !txStatus && (
            <div className="text-gray-500">Loading status...</div>
          )}

          {!txStatusHandler.isLoading && txStatus && !txStatusHandler.error && (
            <div>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  txStatus === 'success'
                    ? 'bg-green-100 text-green-800'
                    : txStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {txStatus}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

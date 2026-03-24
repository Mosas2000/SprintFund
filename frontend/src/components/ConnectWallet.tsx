import { memo, useCallback } from 'react';
import {
  useWalletAddress,
  useWalletConnected,
  useWalletConnect,
  useWalletDisconnect,
  useWalletLoading,
} from '../store/wallet-selectors';
import { truncateAddress } from '../lib/api';
import { useToast } from '../hooks/useToast';
import { useWalletBalanceData } from '../hooks/useWalletBalance';
import { FOCUS_RING_GREEN, FOCUS_RING_RED } from '../lib/focus-styles';

export const ConnectWallet = memo(function ConnectWallet() {
  const loading = useWalletLoading();
  const address = useWalletAddress();
  const connected = useWalletConnected();
  const connect = useWalletConnect();
  const disconnect = useWalletDisconnect();
  const toast = useToast();
  const { stxBalance } = useWalletBalanceData();

  const handleConnect = useCallback(() => {
    connect();
    toast.info('Connecting wallet', 'Approve the connection in your wallet extension.');
  }, [connect, toast]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    toast.success('Wallet disconnected');
  }, [disconnect, toast]);

  if (loading) {
    return (
      <div className="flex items-center gap-2" role="status" aria-label="Loading wallet status">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-green" />
        <span className="text-xs text-muted">Loading...</span>
      </div>
    );
  }

  if (connected && address) {
    const balanceDisplay = stxBalance !== null
      ? `${stxBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} STX`
      : null;

    return (
      <div className="flex items-center gap-2" role="status" aria-label="Wallet connected">
        <div className="flex flex-col items-end">
          <span
            className="rounded-md bg-green/10 px-2.5 py-1.5 text-xs font-mono text-green min-h-[36px] sm:min-h-0 flex items-center"
            aria-label={`Connected address: ${address}`}
          >
            {truncateAddress(address)}
          </span>
          {balanceDisplay && (
            <span className="text-[10px] text-muted mt-0.5 hidden lg:block">
              {balanceDisplay}
            </span>
          )}
        </div>
        <button
          onClick={handleDisconnect}
          aria-label="Disconnect wallet"
          className={`rounded-md px-2.5 py-1.5 text-xs text-muted hover:text-red transition-colors min-h-[36px] sm:min-h-0 ${FOCUS_RING_RED}`}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      aria-label="Connect Stacks wallet"
      className={`rounded-md bg-green px-3 py-2 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95 min-h-[36px] sm:min-h-0 ${FOCUS_RING_GREEN}`}
    >
      Connect Wallet
    </button>
  );
});

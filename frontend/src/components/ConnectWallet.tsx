import { useWalletStore } from '../store/wallet';
import { truncateAddress } from '../lib/api';
import { useToast } from '../hooks/useToast';

export function ConnectWallet() {
  const { address, connected, connect, disconnect } = useWalletStore();
  const toast = useToast();

  const handleConnect = () => {
    connect();
    toast.info('Connecting wallet', 'Approve the connection in your wallet extension.');
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  if (connected && address) {
    return (
      <div className="flex items-center gap-2" role="status" aria-label="Wallet connected">
        <span className="rounded-md bg-green/10 px-2.5 py-1 text-xs font-mono text-green" aria-label={`Connected address: ${address}`}>
          {truncateAddress(address)}
        </span>
        <button
          onClick={handleDisconnect}
          aria-label="Disconnect wallet"
          className="rounded-md px-2.5 py-1 text-xs text-muted hover:text-red transition-colors"
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
      className="rounded-md bg-green px-3 py-1.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95"
    >
      Connect Wallet
    </button>
  );
}

import { useWalletStore } from '../store/wallet';
import { truncateAddress } from '../lib/api';

export function ConnectWallet() {
  const { connected, address, loading, connect, disconnect } = useWalletStore();

  if (loading) {
    return (
      <div className="h-9 w-28 animate-pulse rounded-lg bg-border" />
    );
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-mono text-green">
          {truncateAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-red/40 hover:text-red"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95"
    >
      Connect Wallet
    </button>
  );
}

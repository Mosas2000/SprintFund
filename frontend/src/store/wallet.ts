import { create } from 'zustand';
import {
  connect,
  disconnect as stacksDisconnect,
  isConnected as stacksIsConnected,
  getLocalStorage,
} from '@stacks/connect';

/* ── Store ────────────────────────────────────── */

export interface WalletState {
  address: string | null;
  connected: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
  hydrate: () => void;
}

/** Pull persisted STX address from @stacks/connect localStorage */
function getStoredStxAddress(): string | null {
  try {
    const data = getLocalStorage() as {
      addresses?: { stx?: { address: string }[] };
    } | null;
    return data?.addresses?.stx?.[0]?.address ?? null;
  } catch {
    return null;
  }
}

/**
 * Wallet store manages connection state with proper hydration handling.
 * 
 * The store starts with loading=true to prevent race conditions where
 * components render before wallet hydration completes. This eliminates
 * the flash of "Connect Wallet" state for already-connected users.
 * 
 * Flow:
 * 1. Initial state: loading=true, connected=false
 * 2. App.tsx calls hydrate() on mount
 * 3. hydrate() checks localStorage and sets loading=false
 * 4. Pages check loading before rendering wallet-dependent UI
 */
export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  connected: false,
  loading: true,

  connect: async () => {
    set({ loading: true });
    try {
      const result = await connect({ network: 'mainnet' });

      let addr: string | null = null;
      if (result?.addresses?.length) {
        const stx = result.addresses.find(
          (a: { symbol?: string }) => a.symbol === 'STX' || a.symbol === 'stx',
        );
        addr = stx?.address ?? result.addresses[0]?.address ?? null;
      }

      if (!addr) addr = getStoredStxAddress();

      set({ address: addr, connected: !!addr, loading: false });
    } catch (err) {
      console.error('Wallet connect failed:', err);
      set({ loading: false });
    }
  },

  disconnect: () => {
    stacksDisconnect();
    set({ address: null, connected: false });
  },

  hydrate: () => {
    try {
      if (stacksIsConnected()) {
        const addr = getStoredStxAddress();
        set({ address: addr, connected: !!addr, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));

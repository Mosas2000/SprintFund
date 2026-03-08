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

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  connected: false,
  loading: true,

  connect: async () => {
    try {
      const result = await connect({ network: 'mainnet' });

      // result.addresses is AddressEntry[] with { symbol?, address, publicKey }
      let addr: string | null = null;
      if (result?.addresses?.length) {
        // Prefer the STX entry; wallets typically return STX first
        const stx = result.addresses.find(
          (a: { symbol?: string }) => a.symbol === 'STX' || a.symbol === 'stx',
        );
        addr = stx?.address ?? result.addresses[0]?.address ?? null;
      }

      // Fallback to localStorage
      if (!addr) addr = getStoredStxAddress();

      set({ address: addr, connected: !!addr });
    } catch (err) {
      console.error('Wallet connect failed:', err);
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

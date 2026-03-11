import { useWalletStore } from './wallet';
import type { WalletState } from './wallet';

/**
 * Granular selectors for the wallet store.
 *
 * Using individual selectors prevents unnecessary re-renders: a component
 * that only needs `address` will not re-render when `loading` changes.
 *
 * @see https://docs.pmnd.rs/zustand/guides/prevent-rerenders-with-use-shallow
 */

/** Select only the wallet address. */
export const useWalletAddress = () =>
  useWalletStore((s: WalletState) => s.address);

/** Select only the connected flag. */
export const useWalletConnected = () =>
  useWalletStore((s: WalletState) => s.connected);

/** Select only the loading flag. */
export const useWalletLoading = () =>
  useWalletStore((s: WalletState) => s.loading);

/** Select the connect action. Stable reference (never changes). */
export const useWalletConnect = () =>
  useWalletStore((s: WalletState) => s.connect);

/** Select the disconnect action. Stable reference (never changes). */
export const useWalletDisconnect = () =>
  useWalletStore((s: WalletState) => s.disconnect);

/** Select the hydrate action. Stable reference (never changes). */
export const useWalletHydrate = () =>
  useWalletStore((s: WalletState) => s.hydrate);

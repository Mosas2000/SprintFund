import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConnectWallet } from './ConnectWallet';

vi.mock('../store/wallet-selectors', () => ({
  useWalletLoading: vi.fn(),
  useWalletConnected: vi.fn(),
  useWalletAddress: vi.fn(),
  useWalletConnect: vi.fn(),
  useWalletDisconnect: vi.fn(),
}));

vi.mock('../hooks/useToast', () => ({
  useToast: () => ({
    info: vi.fn(),
    success: vi.fn(),
  }),
}));

import * as walletSelectors from '../store/wallet-selectors';

describe('ConnectWallet loading state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while hydrating', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);

    render(<ConnectWallet />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows connect button when not loading and not connected', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(<ConnectWallet />);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows address when connected', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue('SP123...ABC');
    vi.mocked(walletSelectors.useWalletDisconnect).mockReturnValue(vi.fn());

    render(<ConnectWallet />);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('SP123...ABC')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfilePage } from '../Profile';

vi.mock('../../store/wallet-selectors', () => ({
  useWalletLoading: vi.fn(),
  useWalletConnected: vi.fn(),
  useWalletAddress: vi.fn(),
  useWalletConnect: vi.fn(),
}));

vi.mock('../../hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../lib/profile-data', () => ({
  fetchUserProfile: vi.fn(),
}));

import * as walletSelectors from '../../store/wallet-selectors';

describe('ProfilePage hydration flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when wallet is hydrating', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows not connected message after hydration', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Your Profile')).toBeInTheDocument();
  });

  it('prevents flash during hydration', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    const { container } = render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    const connectButtons = container.querySelectorAll('button');
    const hasConnectButton = Array.from(connectButtons).some(
      button => button.textContent?.includes('Connect Wallet')
    );
    
    expect(hasConnectButton).toBe(false);
  });
});

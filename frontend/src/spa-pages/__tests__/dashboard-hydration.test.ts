import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../Dashboard';

vi.mock('../../store/wallet-selectors', () => ({
  useWalletLoading: vi.fn(),
  useWalletConnected: vi.fn(),
  useWalletAddress: vi.fn(),
  useWalletConnect: vi.fn(),
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    tx: vi.fn(),
  }),
}));

vi.mock('../../hooks/useConfirmDialog', () => ({
  useConfirmDialog: () => ({
    isOpen: false,
    open: vi.fn(),
    close: vi.fn(),
    pendingAction: null,
  }),
}));

vi.mock('../../hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../store/comment-selectors', () => ({
  useLoadComments: () => vi.fn(),
}));

import * as walletSelectors from '../../store/wallet-selectors';

describe('DashboardPage hydration flow', () => {
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
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows connect wallet prompt after hydration when not connected', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Connect your wallet/i)).toBeInTheDocument();
  });

  it('does not show connect prompt while hydrating', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletAddress).mockReturnValue(null);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.queryByText(/Connect your wallet/i)).not.toBeInTheDocument();
  });
});

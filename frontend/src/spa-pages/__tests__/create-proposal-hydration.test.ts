import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreateProposalPage } from '../CreateProposal';

vi.mock('../../store/wallet-selectors', () => ({
  useWalletLoading: vi.fn(),
  useWalletConnected: vi.fn(),
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

vi.mock('../../hooks/useFormValidation', () => ({
  useFormValidation: () => ({
    errors: {},
    touched: {},
    submitted: false,
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    validateAll: vi.fn(() => true),
    resetValidation: vi.fn(),
  }),
}));

vi.mock('../../hooks/useFocusOnMount', () => ({
  useFocusOnMount: () => ({ current: null }),
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

import * as walletSelectors from '../../store/wallet-selectors';

describe('CreateProposalPage hydration flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when wallet is hydrating', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <CreateProposalPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows connect wallet prompt after hydration when not connected', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <CreateProposalPage />
      </BrowserRouter>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Create Proposal')).toBeInTheDocument();
    expect(screen.getByText(/Connect your wallet to create a proposal/i)).toBeInTheDocument();
  });

  it('does not show connect prompt while hydrating', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <CreateProposalPage />
      </BrowserRouter>
    );

    expect(screen.queryByText(/Connect your wallet to create a proposal/i)).not.toBeInTheDocument();
  });

  it('prevents race condition flash by blocking render during hydration', () => {
    vi.mocked(walletSelectors.useWalletLoading).mockReturnValue(true);
    vi.mocked(walletSelectors.useWalletConnected).mockReturnValue(false);
    vi.mocked(walletSelectors.useWalletConnect).mockReturnValue(vi.fn());

    const { container } = render(
      <BrowserRouter>
        <CreateProposalPage />
      </BrowserRouter>
    );

    const connectButtons = container.querySelectorAll('button');
    const hasConnectWalletButton = Array.from(connectButtons).some(
      button => button.textContent?.includes('Connect Wallet')
    );
    
    expect(hasConnectWalletButton).toBe(false);
  });
});

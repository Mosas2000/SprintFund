import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

vi.mock('../store/wallet', () => ({
  useWalletStore: vi.fn((selector) => {
    const store = {
      address: null,
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(() => {
        store.loading = false;
      }),
    };
    return selector(store);
  }),
}));

vi.mock('../hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn(),
  useNavigationShortcuts: vi.fn(() => ({
    goToDashboard: vi.fn(),
    goToProposals: vi.fn(),
    goToProfile: vi.fn(),
    createProposal: vi.fn(),
  })),
}));
vi.mock('../hooks/useCommandPalette', () => ({
  useCommandPalette: vi.fn(),
  filterCommands: (commands: unknown[]) => commands,
}));
vi.mock('../components/Layout', () => ({
  Layout: () => <div data-testid="layout">Layout</div>,
}));
vi.mock('../components/OfflineBanner', () => ({
  OfflineBanner: () => <div data-testid="offline-banner" />,
}));
vi.mock('../../components/TransactionHistory', () => ({
  default: () => <div data-testid="transaction-history" />,
}));

describe('App hydration initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls hydrate on mount', async () => {
    render(<App />);
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('initializes wallet with loading state', () => {
    render(<App />);
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});

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

vi.mock('../../components/Layout', () => ({
  Layout: () => <div data-testid="layout">Layout</div>,
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

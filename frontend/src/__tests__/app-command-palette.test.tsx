import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as wallet from './store/wallet';

vi.mock('./store/wallet', () => ({
  useWalletStore: vi.fn(() => ({
    hydrate: vi.fn(),
  })),
}));
vi.mock('./components/OfflineBanner', () => ({
  OfflineBanner: () => <div data-testid="offline-banner" />,
}));

describe('App - Command Palette Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(wallet.useWalletStore).mockImplementation(() => ({
      hydrate: vi.fn(),
    }));
  });

  it('renders without command palette visible initially', () => {
    render(<App />);

    const palette = screen.queryByPlaceholderText('Search commands...');
    expect(palette).not.toBeInTheDocument();
  });

  it('opens command palette with Cmd+K on Mac', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument();
    });
  });

  it('opens command palette with Ctrl+K on non-Mac', async () => {
    const originalPlatform = navigator.platform;
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });

    render(<App />);

    fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search commands...'),
      ).toBeInTheDocument();
    });

    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
  });

  it('displays all available commands', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Create New Proposal')).toBeInTheDocument();
      expect(screen.getByText('Browse Proposals')).toBeInTheDocument();
    });
  });

  it('displays command shortcuts', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      const shortcuts = screen.getAllByText('Cmd+K', { selector: 'div' });
      expect(shortcuts.length).toBeGreaterThan(0);
    });
  });

  it('closes palette on Escape key', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search commands...'),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input, { key: 'Escape' });

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('Search commands...'),
      ).not.toBeInTheDocument();
    });
  });

  it('searches commands as user types', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    const input = screen.getByPlaceholderText('Search commands...');
    await userEvent.type(input, 'dashboard');

    await waitFor(() => {
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Create New Proposal')).not.toBeInTheDocument();
    });
  });

  it('executes command action when selected', async () => {
    const mockNavigate = vi.fn();
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search commands...'),
      ).toBeInTheDocument();
    });

    const dashboardButton = await screen.findByText('Go to Dashboard');
    fireEvent.click(dashboardButton);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('Search commands...'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows keyboard shortcuts in command palette', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(screen.getByText('Cmd+D')).toBeInTheDocument();
      expect(screen.getByText('Cmd+N')).toBeInTheDocument();
      expect(screen.getByText('Cmd+K')).toBeInTheDocument();
    });
  });

  it('navigates with arrow keys in command palette', async () => {
    const { container } = render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search commands...'),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      const options = container.querySelectorAll('[role="option"]');
      expect(options[1]).toHaveClass('bg-green/10');
    });
  });

  it('closes palette when backdrop clicked', async () => {
    render(<App />);

    fireEvent.keyDown(window, { metaKey: true, key: 'k' });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search commands...'),
      ).toBeInTheDocument();
    });

    const backdrop = screen.getByRole('presentation', { hidden: true });
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('Search commands...'),
      ).not.toBeInTheDocument();
    });
  });
});

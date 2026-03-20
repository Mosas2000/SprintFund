import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KeyboardHints } from './KeyboardHints';

describe('KeyboardHints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders keyboard hints button', () => {
    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('toggles help panel visibility', async () => {
    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });

    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('displays all keyboard shortcuts', async () => {
    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Open command palette')).toBeInTheDocument();
      expect(screen.getByText('Go to dashboard')).toBeInTheDocument();
      expect(screen.getByText('Create new proposal')).toBeInTheDocument();
      expect(screen.getByText('Navigate proposals')).toBeInTheDocument();
      expect(screen.getByText('Open selected proposal')).toBeInTheDocument();
      expect(screen.getByText('Close modals')).toBeInTheDocument();
    });
  });

  it('displays platform-specific shortcuts for Mac', async () => {
    const originalPlatform = navigator.platform;
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });

    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      const macShortcuts = screen.getAllByText(/Cmd\+/);
      expect(macShortcuts.length).toBeGreaterThan(0);
    });

    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
  });

  it('displays platform-specific shortcuts for Windows', async () => {
    const originalPlatform = navigator.platform;
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });

    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      const ctrlShortcuts = screen.getAllByText(/Ctrl\+/);
      expect(ctrlShortcuts.length).toBeGreaterThan(0);
    });

    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
  });

  it('has correct aria attributes', async () => {
    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('displays shortcuts in kbd elements', async () => {
    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      const kbdElements = screen.getAllByRole('presentation', { hidden: true });
      expect(kbdElements.length).toBeGreaterThan(0);
    });
  });

  it('renders hint button with settings icon', () => {
    render(<KeyboardHints />);

    const button = screen.getByRole('button', {
      name: /toggle keyboard shortcuts help/i,
    });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});

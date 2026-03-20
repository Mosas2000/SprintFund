import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './CommandPalette';
import type { SearchCommand } from '../hooks/useCommandPalette';

describe('CommandPalette', () => {
  const mockCommands: SearchCommand[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      description: 'Navigate to the main dashboard',
      shortcut: 'Cmd+D',
      action: vi.fn(),
    },
    {
      id: 'create',
      title: 'Create New Proposal',
      description: 'Start creating a new proposal',
      shortcut: 'Cmd+N',
      action: vi.fn(),
    },
    {
      id: 'search',
      title: 'Search Proposals',
      description: 'Open proposal search',
      shortcut: 'Cmd+K',
      action: vi.fn(),
    },
  ];

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <CommandPalette
        isOpen={false}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders command list when open', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create New Proposal')).toBeInTheDocument();
    expect(screen.getByText('Search Proposals')).toBeInTheDocument();
  });

  it('focuses input when opened', async () => {
    const { rerender } = render(
      <CommandPalette
        isOpen={false}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    rerender(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search commands...')).toHaveFocus();
    });
  });

  it('filters commands by search query', async () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const input = screen.getByPlaceholderText('Search commands...');
    await userEvent.type(input, 'dashboard');

    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create New Proposal')).not.toBeInTheDocument();
  });

  it('displays "No commands found" when search has no results', async () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const input = screen.getByPlaceholderText('Search commands...');
    await userEvent.type(input, 'nonexistent');

    expect(screen.getByText('No commands found')).toBeInTheDocument();
  });

  it('closes palette on Escape key', async () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes palette and executes command on Enter key', async () => {
    const onClose = vi.fn();
    const action = mockCommands[0].action as ReturnType<typeof vi.fn>;

    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commands={mockCommands}
      />,
    );

    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(action).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates with arrow keys', async () => {
    const { container } = render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const input = screen.getByPlaceholderText('Search commands...');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await waitFor(() => {
      const buttons = container.querySelectorAll('[role="option"]');
      expect(buttons[1]).toHaveClass('bg-green/10');
    });

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    await waitFor(() => {
      const buttons = container.querySelectorAll('[role="option"]');
      expect(buttons[0]).toHaveClass('bg-green/10');
    });
  });

  it('closes palette when clicking backdrop', async () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const backdrop = screen.getByRole('presentation', { hidden: true });
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('executes command when clicked', async () => {
    const action = mockCommands[0].action as ReturnType<typeof vi.fn>;

    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const button = screen.getByRole('option', {
      selected: false,
    });
    fireEvent.click(button);

    expect(action).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('updates selected index on mouse enter', async () => {
    const { container } = render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const buttons = container.querySelectorAll('[role="option"]');
    fireEvent.mouseEnter(buttons[2]);

    await waitFor(() => {
      expect(buttons[2]).toHaveClass('bg-green/10');
    });
  });

  it('displays command shortcuts', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    expect(screen.getByText('Cmd+D')).toBeInTheDocument();
    expect(screen.getByText('Cmd+N')).toBeInTheDocument();
    expect(screen.getByText('Cmd+K')).toBeInTheDocument();
  });

  it('resets search and selection when palette opens', () => {
    const { rerender } = render(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    const input = screen.getByPlaceholderText(
      'Search commands...',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });

    rerender(
      <CommandPalette
        isOpen={false}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    rerender(
      <CommandPalette
        isOpen={true}
        onClose={mockOnClose}
        commands={mockCommands}
      />,
    );

    expect(input.value).toBe('');
  });
});

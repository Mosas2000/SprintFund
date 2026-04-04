import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCommandPalette, filterCommands, type CommandItem } from './useCommandPalette';

describe('useCommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onOpen when Ctrl+K is pressed on non-Mac', () => {
    const onOpen = vi.fn();
    const commands: CommandItem[] = [];
    
    renderHook(() => useCommandPalette(commands, onOpen, false));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    window.dispatchEvent(event);

    expect(onOpen).toHaveBeenCalled();
  });

  it('calls onOpen when Cmd+K is pressed on Mac', () => {
    const onOpen = vi.fn();
    const commands: CommandItem[] = [];
    
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });

    renderHook(() => useCommandPalette(commands, onOpen, false));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    });
    window.dispatchEvent(event);

    expect(onOpen).toHaveBeenCalled();
  });
});

describe('filterCommands', () => {
  const commands = [
    {
      id: '1',
      title: 'Create Proposal',
      description: 'Create a new proposal',
      category: 'Proposals',
      action: vi.fn(),
    },
    {
      id: '2',
      title: 'Go to Dashboard',
      description: 'Navigate to dashboard',
      category: 'Navigation',
      action: vi.fn(),
    },
    {
      id: '3',
      title: 'Search Proposals',
      description: 'Search through proposals',
      category: 'Search',
      action: vi.fn(),
    },
  ];

  it('returns all commands when query is empty', () => {
    const result = filterCommands(commands, '');
    expect(result).toHaveLength(3);
  });

  it('filters commands by title', () => {
    const result = filterCommands(commands, 'Create');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters commands by description', () => {
    const result = filterCommands(commands, 'dashboard');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters commands by category', () => {
    const result = filterCommands(commands, 'Navigation');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('performs case-insensitive search', () => {
    const result = filterCommands(commands, 'PROPOSAL');
    expect(result).toHaveLength(2);
  });

  it('filters with partial matches', () => {
    const result = filterCommands(commands, 'nav');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});

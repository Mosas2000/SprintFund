import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls action on matching key combination', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrlKey: true, action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });

    window.dispatchEvent(event);
    expect(action).toHaveBeenCalled();
  });

  it('does not call action on non-matching key', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrlKey: true, action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'x',
      ctrlKey: true,
    });

    window.dispatchEvent(event);
    expect(action).not.toHaveBeenCalled();
  });

  it('respects metaKey as alternative to ctrlKey on Mac', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrlKey: true, action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    });

    window.dispatchEvent(event);
    expect(action).toHaveBeenCalled();
  });

  it('handles multiple shortcuts', () => {
    const action1 = vi.fn();
    const action2 = vi.fn();
    const shortcuts = [
      { key: 'k', ctrlKey: true, action: action1 },
      { key: 'n', ctrlKey: true, action: action2 },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event1 = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    window.dispatchEvent(event1);

    const event2 = new KeyboardEvent('keydown', {
      key: 'n',
      ctrlKey: true,
    });
    window.dispatchEvent(event2);

    expect(action1).toHaveBeenCalled();
    expect(action2).toHaveBeenCalled();
  });

  it('prevents default action on shortcut match', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrlKey: true, action },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const action = vi.fn();
    const shortcuts = [
      { key: 'k', ctrlKey: true, action },
    ];

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

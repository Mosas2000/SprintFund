import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

function pressEscape() {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
  document.dispatchEvent(event);
}

function pressEnter() {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
  document.dispatchEvent(event);
}

describe('useEscapeKey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls handler when Escape is pressed and hook is active', () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(true, handler));

    pressEscape();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when hook is inactive', () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(false, handler));

    pressEscape();

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handler for non-Escape keys', () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(true, handler));

    pressEnter();

    expect(handler).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEscapeKey(true, handler));

    unmount();
    pressEscape();

    expect(handler).not.toHaveBeenCalled();
  });

  it('removes listener when toggled to inactive', () => {
    const handler = vi.fn();
    const { rerender } = renderHook(
      ({ active }) => useEscapeKey(active, handler),
      { initialProps: { active: true } },
    );

    rerender({ active: false });
    pressEscape();

    expect(handler).not.toHaveBeenCalled();
  });

  it('attaches listener when toggled from inactive to active', () => {
    const handler = vi.fn();
    const { rerender } = renderHook(
      ({ active }) => useEscapeKey(active, handler),
      { initialProps: { active: false } },
    );

    rerender({ active: true });
    pressEscape();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

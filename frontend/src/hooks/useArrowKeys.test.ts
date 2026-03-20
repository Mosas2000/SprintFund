import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useArrowKeys } from './useArrowKeys';

describe('useArrowKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onDown when ArrowDown is pressed', () => {
    const onDown = vi.fn();
    const callbacks = { onDown };

    renderHook(() => useArrowKeys(callbacks));

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    });
    window.dispatchEvent(event);

    expect(onDown).toHaveBeenCalled();
  });

  it('calls onUp when ArrowUp is pressed', () => {
    const onUp = vi.fn();
    const callbacks = { onUp };

    renderHook(() => useArrowKeys(callbacks));

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
    });
    window.dispatchEvent(event);

    expect(onUp).toHaveBeenCalled();
  });

  it('calls onLeft when ArrowLeft is pressed', () => {
    const onLeft = vi.fn();
    const callbacks = { onLeft };

    renderHook(() => useArrowKeys(callbacks));

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
    });
    window.dispatchEvent(event);

    expect(onLeft).toHaveBeenCalled();
  });

  it('calls onRight when ArrowRight is pressed', () => {
    const onRight = vi.fn();
    const callbacks = { onRight };

    renderHook(() => useArrowKeys(callbacks));

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
    });
    window.dispatchEvent(event);

    expect(onRight).toHaveBeenCalled();
  });

  it('handles multiple arrow keys', () => {
    const onUp = vi.fn();
    const onDown = vi.fn();
    const callbacks = { onUp, onDown };

    renderHook(() => useArrowKeys(callbacks));

    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(upEvent);

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    window.dispatchEvent(downEvent);

    expect(onUp).toHaveBeenCalled();
    expect(onDown).toHaveBeenCalled();
  });

  it('respects enabled flag', () => {
    const onDown = vi.fn();
    const callbacks = { onDown };

    renderHook(() => useArrowKeys(callbacks, false));

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    });
    window.dispatchEvent(event);

    expect(onDown).not.toHaveBeenCalled();
  });

  it('prevents default behavior on arrow key press', () => {
    const onDown = vi.fn();
    const callbacks = { onDown };

    renderHook(() => useArrowKeys(callbacks));

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

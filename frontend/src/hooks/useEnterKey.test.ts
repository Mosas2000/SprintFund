import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEnterKey } from './useEnterKey';

describe('useEnterKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onEnter when Enter key is pressed', () => {
    const onEnter = vi.fn();
    renderHook(() => useEnterKey(onEnter));

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    window.dispatchEvent(event);

    expect(onEnter).toHaveBeenCalled();
  });

  it('does not call onEnter when Enter is combined with Shift', () => {
    const onEnter = vi.fn();
    renderHook(() => useEnterKey(onEnter));

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey: true,
    });
    window.dispatchEvent(event);

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('does not call onEnter when Enter is combined with Ctrl', () => {
    const onEnter = vi.fn();
    renderHook(() => useEnterKey(onEnter));

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      ctrlKey: true,
    });
    window.dispatchEvent(event);

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('does not call onEnter when Enter is combined with Meta', () => {
    const onEnter = vi.fn();
    renderHook(() => useEnterKey(onEnter));

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      metaKey: true,
    });
    window.dispatchEvent(event);

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('respects enabled flag', () => {
    const onEnter = vi.fn();
    renderHook(() => useEnterKey(onEnter, false));

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    window.dispatchEvent(event);

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('prevents default behavior on Enter press', () => {
    const onEnter = vi.fn();
    renderHook(() => useEnterKey(onEnter));

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

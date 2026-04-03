import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('sets body overflow to hidden when active', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('does not modify body overflow when inactive', () => {
    document.body.style.overflow = 'auto';
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe('auto');
  });

  it('restores original overflow on unmount', () => {
    document.body.style.overflow = 'scroll';
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restores original overflow when active changes to false', () => {
    document.body.style.overflow = 'auto';
    const { rerender } = renderHook(
      ({ active }) => useScrollLock(active),
      { initialProps: { active: true } },
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ active: false });
    expect(document.body.style.overflow).toBe('auto');
  });

  it('handles empty string as original overflow', () => {
    document.body.style.overflow = '';
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

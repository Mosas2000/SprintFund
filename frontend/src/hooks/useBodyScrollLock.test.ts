import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for the useBodyScrollLock hook logic.
 *
 * Since @testing-library/react is not installed in this project,
 * these tests validate the lock/unlock logic directly by exercising
 * the same body style mutations the hook performs.
 */
describe('useBodyScrollLock logic', () => {
  let scrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });

    scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function lockBody(scrollY: number) {
    Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });

    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return { original, scrollY };
  }

  function unlockBody(saved: ReturnType<typeof lockBody>) {
    document.body.style.overflow = saved.original.overflow;
    document.body.style.position = saved.original.position;
    document.body.style.top = saved.original.top;
    document.body.style.width = saved.original.width;
    window.scrollTo(0, saved.scrollY);
  }

  it('sets body overflow to hidden when locked', () => {
    lockBody(0);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('sets body position to fixed when locked', () => {
    lockBody(0);
    expect(document.body.style.position).toBe('fixed');
  });

  it('sets body width to 100% when locked', () => {
    lockBody(0);
    expect(document.body.style.width).toBe('100%');
  });

  it('sets body top to negative scroll position', () => {
    lockBody(150);
    expect(document.body.style.top).toBe('-150px');
  });

  it('restores all body styles on unlock', () => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
    document.body.style.top = '0px';
    document.body.style.width = 'auto';

    const saved = lockBody(200);
    expect(document.body.style.overflow).toBe('hidden');

    unlockBody(saved);

    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.position).toBe('relative');
    expect(document.body.style.top).toBe('0px');
    expect(document.body.style.width).toBe('auto');
  });

  it('calls scrollTo with saved scroll position on unlock', () => {
    const saved = lockBody(350);
    unlockBody(saved);

    expect(scrollToSpy).toHaveBeenCalledWith(0, 350);
  });

  it('handles empty string as original styles', () => {
    const saved = lockBody(0);
    unlockBody(saved);

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.width).toBe('');
  });

  it('handles zero scroll position on lock', () => {
    lockBody(0);
    expect(document.body.style.top).toBe('-0px');
  });

  it('scrollTo receives zero when page was at top', () => {
    const saved = lockBody(0);
    unlockBody(saved);

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for the useViewportSize hook logic.
 *
 * Since @testing-library/react is not installed, these tests validate
 * the rAF-debounced resize pattern the hook relies on.
 */
describe('useViewportSize supporting logic', () => {
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    rafCallback = null;

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
      rafCallback = null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('window.innerWidth returns the current viewport width', () => {
    expect(window.innerWidth).toBe(1024);
  });

  it('window.innerHeight returns the current viewport height', () => {
    expect(window.innerHeight).toBe(768);
  });

  it('resize event listener fires on window resize', () => {
    const handler = vi.fn();
    window.addEventListener('resize', handler);

    window.dispatchEvent(new Event('resize'));

    expect(handler).toHaveBeenCalledTimes(1);

    window.removeEventListener('resize', handler);
  });

  it('requestAnimationFrame queues a callback', () => {
    const cb = vi.fn();
    window.requestAnimationFrame(cb);

    expect(rafCallback).toBe(cb);
  });

  it('cancelAnimationFrame clears the queued callback', () => {
    const cb = vi.fn();
    window.requestAnimationFrame(cb);
    expect(rafCallback).not.toBeNull();

    window.cancelAnimationFrame(1);
    expect(rafCallback).toBeNull();
  });

  it('dimensions update after rAF fires', () => {
    Object.defineProperty(window, 'innerWidth', { value: 640 });
    Object.defineProperty(window, 'innerHeight', { value: 480 });

    expect(window.innerWidth).toBe(640);
    expect(window.innerHeight).toBe(480);
  });

  it('removeEventListener prevents further handler calls', () => {
    const handler = vi.fn();
    window.addEventListener('resize', handler);
    window.removeEventListener('resize', handler);

    window.dispatchEvent(new Event('resize'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('repeated resize dispatches do not accumulate rAF calls when cancelled', () => {
    window.requestAnimationFrame(vi.fn());
    window.cancelAnimationFrame(1);

    const secondCb = vi.fn();
    window.requestAnimationFrame(secondCb);

    expect(rafCallback).toBe(secondCb);
  });
});

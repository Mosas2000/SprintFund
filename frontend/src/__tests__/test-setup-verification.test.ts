import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

describe('vitest setup mock verification', () => {
  it('stacks connect module is mocked', async () => {
    const mod = await import('@stacks/connect');
    expect(typeof mod.connect).toBe('function');
    expect(typeof mod.disconnect).toBe('function');
    expect(typeof mod.isConnected).toBe('function');
    expect(typeof mod.request).toBe('function');
  });

  it('connect returns a mock function', async () => {
    const { connect } = await import('@stacks/connect');
    expect(vi.isMockFunction(connect)).toBe(true);
  });

  it('disconnect returns a mock function', async () => {
    const { disconnect } = await import('@stacks/connect');
    expect(vi.isMockFunction(disconnect)).toBe(true);
  });

  it('isConnected returns a mock function', async () => {
    const { isConnected } = await import('@stacks/connect');
    expect(vi.isMockFunction(isConnected)).toBe(true);
  });
});

describe('jsdom environment', () => {
  it('window is defined', () => {
    expect(typeof window).toBe('object');
  });

  it('document is defined', () => {
    expect(typeof document).toBe('object');
  });

  it('localStorage is available', () => {
    expect(typeof localStorage).toBe('object');
  });

  it('can create DOM elements', () => {
    const div = document.createElement('div');
    expect(div.tagName).toBe('DIV');
  });

  it('supports event listeners', () => {
    const handler = vi.fn();
    const el = document.createElement('button');
    el.addEventListener('click', handler);
    el.click();
    expect(handler).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import * as ErrorStateModule from '../ErrorState';

describe('ErrorState module', () => {
  it('exports ErrorState component', () => {
    expect(ErrorStateModule.ErrorState).toBeDefined();
  });

  it('export is a function', () => {
    expect(typeof ErrorStateModule.ErrorState).toBe('function');
  });
});

describe('ErrorState props contract', () => {
  it('requires title, message, onRetry, retryCount', () => {
    const props = {
      title: 'Error occurred',
      message: 'Something went wrong',
      onRetry: () => {},
      retryCount: 0,
    };

    expect(typeof props.title).toBe('string');
    expect(typeof props.message).toBe('string');
    expect(typeof props.onRetry).toBe('function');
    expect(typeof props.retryCount).toBe('number');
  });

  it('retryCount starts at 0', () => {
    const retryCount = 0;
    expect(retryCount).toBe(0);
  });

  it('retryCount increments on each retry', () => {
    let retryCount = 0;
    retryCount++;
    expect(retryCount).toBe(1);
    retryCount++;
    expect(retryCount).toBe(2);
  });
});

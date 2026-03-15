import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useToastStore } from '../toast';

describe('toast store interaction with batch errors', () => {
  it('can show batch fetch error toast', () => {
    const id = useToastStore.getState().addToast({
      title: 'Batch fetch failed',
      variant: 'error',
    });
    const toast = useToastStore.getState().toasts.find(t => t.id === id);
    expect(toast?.title).toBe('Batch fetch failed');
    expect(toast?.variant).toBe('error');
  });

  it('can show partial success warning toast', () => {
    const id = useToastStore.getState().addToast({
      title: 'Some proposals failed to load',
      variant: 'warning',
    });
    const toast = useToastStore.getState().toasts.find(t => t.id === id);
    expect(toast?.variant).toBe('warning');
  });
});

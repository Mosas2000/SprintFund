import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useToastStore } from '../toast';

describe('toast store initial state', () => {
  it('starts with empty toasts array', () => {
    const state = useToastStore.getState();
    expect(state.toasts).toBeDefined();
    expect(Array.isArray(state.toasts)).toBe(true);
  });

  it('exposes addToast action', () => {
    expect(typeof useToastStore.getState().addToast).toBe('function');
  });

  it('exposes removeToast action', () => {
    expect(typeof useToastStore.getState().removeToast).toBe('function');
  });

  it('exposes updateToast action', () => {
    expect(typeof useToastStore.getState().updateToast).toBe('function');
  });
});

describe('toast store operations', () => {
  it('adds a toast', () => {
    const store = useToastStore.getState();
    const id = store.addToast({
      title: 'Test Toast',
      variant: 'info',
    });

    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);

    const toasts = useToastStore.getState().toasts;
    expect(toasts.some(t => t.id === id)).toBe(true);
  });

  it('removes a toast by id', () => {
    const store = useToastStore.getState();
    const id = store.addToast({
      title: 'To Remove',
      variant: 'info',
    });

    useToastStore.getState().removeToast(id);

    const toasts = useToastStore.getState().toasts;
    expect(toasts.some(t => t.id === id)).toBe(false);
  });

  it('preserves other toasts when removing one', () => {
    const store = useToastStore.getState();
    const id1 = store.addToast({ title: 'First', variant: 'info' });
    const id2 = store.addToast({ title: 'Second', variant: 'success' });

    useToastStore.getState().removeToast(id1);

    const toasts = useToastStore.getState().toasts;
    expect(toasts.some(t => t.id === id2)).toBe(true);
  });

  it('toast has correct variant', () => {
    const store = useToastStore.getState();
    const id = store.addToast({
      title: 'Warning Toast',
      variant: 'warning',
    });

    const toast = useToastStore.getState().toasts.find(t => t.id === id);
    expect(toast?.variant).toBe('warning');
  });

  it('toast has title', () => {
    const store = useToastStore.getState();
    const id = store.addToast({
      title: 'My Title',
      variant: 'error',
    });

    const toast = useToastStore.getState().toasts.find(t => t.id === id);
    expect(toast?.title).toBe('My Title');
  });

  it('toast has createdAt timestamp', () => {
    const store = useToastStore.getState();
    const id = store.addToast({
      title: 'Timestamped',
      variant: 'info',
    });

    const toast = useToastStore.getState().toasts.find(t => t.id === id);
    expect(toast?.createdAt).toBeDefined();
    expect(typeof toast?.createdAt).toBe('number');
  });
});

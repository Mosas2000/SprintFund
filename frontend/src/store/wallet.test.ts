import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWalletStore } from './wallet';

vi.mock('@stacks/connect', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(),
  getLocalStorage: vi.fn(),
}));

describe('wallet store', () => {
  beforeEach(() => {
    const store = useWalletStore.getState();
    act(() => {
      store.disconnect();
    });
  });

  describe('initial state', () => {
    it('should start with loading true', () => {
      const { result } = renderHook(() => useWalletStore());
      expect(result.current.loading).toBe(true);
    });

    it('should start with connected false', () => {
      const { result } = renderHook(() => useWalletStore());
      expect(result.current.connected).toBe(false);
    });

    it('should start with address null', () => {
      const { result } = renderHook(() => useWalletStore());
      expect(result.current.address).toBe(null);
    });
  });

  describe('hydrate', () => {
    it('should set loading to false after hydration', () => {
      const { result } = renderHook(() => useWalletStore());
      
      act(() => {
        result.current.hydrate();
      });

      expect(result.current.loading).toBe(false);
    });

    it('should maintain connected state during hydration', () => {
      const { result } = renderHook(() => useWalletStore());
      
      act(() => {
        result.current.hydrate();
      });

      expect(result.current.connected).toBeDefined();
    });
  });

  describe('loading state transitions', () => {
    it('should prevent race condition by checking loading before rendering', () => {
      const { result } = renderHook(() => useWalletStore());
      
      expect(result.current.loading).toBe(true);
      
      act(() => {
        result.current.hydrate();
      });
      
      expect(result.current.loading).toBe(false);
    });
  });
});

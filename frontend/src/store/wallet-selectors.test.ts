import { describe, it, expect } from 'vitest';
import * as selectors from './wallet-selectors';

/**
 * Unit tests for the granular wallet store selectors.
 *
 * These tests verify the selector module's public API surface.
 * Each selector is a custom hook that calls useWalletStore with a
 * specific field selector function — we verify that the module
 * exports the correct set of hooks and that they are callable.
 */

describe('wallet-selectors module exports', () => {
  it('exports useWalletAddress', () => {
    expect(typeof selectors.useWalletAddress).toBe('function');
  });

  it('exports useWalletConnected', () => {
    expect(typeof selectors.useWalletConnected).toBe('function');
  });

  it('exports useWalletLoading', () => {
    expect(typeof selectors.useWalletLoading).toBe('function');
  });

  it('exports useWalletConnect', () => {
    expect(typeof selectors.useWalletConnect).toBe('function');
  });

  it('exports useWalletDisconnect', () => {
    expect(typeof selectors.useWalletDisconnect).toBe('function');
  });

  it('exports useWalletHydrate', () => {
    expect(typeof selectors.useWalletHydrate).toBe('function');
  });

  it('exports exactly six selectors', () => {
    const exportedNames = Object.keys(selectors);
    expect(exportedNames).toHaveLength(6);
    expect(exportedNames).toEqual(
      expect.arrayContaining([
        'useWalletAddress',
        'useWalletConnected',
        'useWalletLoading',
        'useWalletConnect',
        'useWalletDisconnect',
        'useWalletHydrate',
      ]),
    );
  });
});

describe('selector isolation', () => {
  it('each selector is a distinct function reference', () => {
    const fns = [
      selectors.useWalletAddress,
      selectors.useWalletConnected,
      selectors.useWalletLoading,
      selectors.useWalletConnect,
      selectors.useWalletDisconnect,
      selectors.useWalletHydrate,
    ];

    // Verify all unique — a common mistake is exporting the same selector
    // under different names due to copy-paste errors.
    const unique = new Set(fns);
    expect(unique.size).toBe(fns.length);
  });

  it('selector module does not re-export useWalletStore directly', () => {
    const names = Object.keys(selectors);
    expect(names).not.toContain('useWalletStore');
  });
});

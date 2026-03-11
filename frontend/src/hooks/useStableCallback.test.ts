import { describe, it, expect } from 'vitest';
import { useStableCallback } from './useStableCallback';

/**
 * Unit tests for useStableCallback.
 *
 * Since we cannot use renderHook (no @testing-library/react installed),
 * we verify the module's contract at the export level and its type
 * signature.
 */

describe('useStableCallback module', () => {
  it('exports a function named useStableCallback', () => {
    expect(typeof useStableCallback).toBe('function');
  });

  it('function accepts a callback parameter', () => {
    // useStableCallback is a hook that takes one argument (the callback)
    // Function.length reports the number of formal parameters
    expect(useStableCallback.length).toBe(1);
  });

  it('is named useStableCallback (follows React hook naming convention)', () => {
    expect(useStableCallback.name).toBe('useStableCallback');
  });
});

describe('useStableCallback contract', () => {
  it('should be a hook (name starts with "use")', () => {
    // React hooks must start with "use" — this catches accidental renames
    expect(useStableCallback.name).toMatch(/^use/);
  });

  it('should not accidentally re-export a different function', () => {
    // Ensure the export is the actual implementation, not a wrapper
    const src = useStableCallback.toString();
    expect(src).toContain('callbackRef');
  });
});

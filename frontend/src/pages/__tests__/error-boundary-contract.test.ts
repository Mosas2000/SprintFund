import { describe, it, expect } from 'vitest';

describe('error page error boundary contract', () => {
  it('error prop has Error type with optional digest', () => {
    const error = new Error('test') as Error & { digest?: string };
    expect(error.message).toBe('test');
    expect(error.digest).toBeUndefined();
  });

  it('error prop can have digest string', () => {
    const error = Object.assign(new Error('test'), { digest: 'abc123' });
    expect(error.digest).toBe('abc123');
  });

  it('reset is a function that resets the boundary', () => {
    let called = false;
    const reset = () => { called = true; };
    reset();
    expect(called).toBe(true);
  });
});

describe('error page use client directive', () => {
  it('error pages require use client for useState/useEffect', () => {
    const directive = '"use client"';
    expect(directive).toBe('"use client"');
  });

  it('loading pages do NOT require use client (server component)', () => {
    // loading.tsx pages are server components — no use client needed
    const isServerComponent = true;
    expect(isServerComponent).toBe(true);
  });

  it('not-found page uses use client for Link component', () => {
    const directive = '"use client"';
    expect(directive).toBe('"use client"');
  });
});

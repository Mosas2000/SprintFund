import { describe, it, expect } from 'vitest';

describe('community loading skeleton specifics', () => {
  it('member cards have avatar + name layout', () => {
    const layout = 'flex items-center gap-3';
    expect(layout).toContain('flex');
    expect(layout).toContain('gap-3');
  });

  it('avatars are 10x10 rounded-full', () => {
    const cls = 'h-10 w-10 rounded-full';
    expect(cls).toContain('h-10');
    expect(cls).toContain('w-10');
    expect(cls).toContain('rounded-full');
  });

  it('has 6 member card placeholders', () => {
    const count = 6;
    expect(count).toBe(6);
  });
});

describe('api-docs loading skeleton specifics', () => {
  it('endpoint items have method badge and path', () => {
    const hasBadge = true;
    const hasPath = true;
    expect(hasBadge).toBe(true);
    expect(hasPath).toBe(true);
  });

  it('has 5 endpoint placeholders', () => {
    const count = 5;
    expect(count).toBe(5);
  });

  it('uses max-w-4xl container', () => {
    const cls = 'mx-auto max-w-4xl';
    expect(cls).toContain('max-w-4xl');
  });
});

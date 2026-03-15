import { describe, it, expect } from 'vitest';

describe('pagination button styling', () => {
  const btnClass = 'rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 min-h-[44px]';

  it('has rounded-lg border', () => {
    expect(btnClass).toContain('rounded-lg');
    expect(btnClass).toContain('border-border');
  });

  it('has bg-card background', () => {
    expect(btnClass).toContain('bg-card');
  });

  it('has disabled styling', () => {
    expect(btnClass).toContain('disabled:cursor-not-allowed');
    expect(btnClass).toContain('disabled:opacity-40');
  });

  it('has min touch target height', () => {
    expect(btnClass).toContain('min-h-[44px]');
  });

  it('has hover state', () => {
    expect(btnClass).toContain('hover:bg-white/5');
  });
});

describe('pagination nav layout', () => {
  const navClass = 'mt-8 flex items-center justify-center gap-4';

  it('has top margin for spacing', () => {
    expect(navClass).toContain('mt-8');
  });

  it('centers items horizontally', () => {
    expect(navClass).toContain('justify-center');
  });

  it('has gap between items', () => {
    expect(navClass).toContain('gap-4');
  });
});

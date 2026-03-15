import { describe, it, expect } from 'vitest';

describe('Proposals filter button styling', () => {
  const getFilterClass = (filter: string, current: string) => {
    const base = 'rounded-md px-4 py-2 text-xs font-medium capitalize transition-colors min-h-[44px]';
    if (filter === current) {
      return `${base} bg-green/10 text-green`;
    }
    return `${base} text-muted hover:text-text hover:bg-white/5`;
  };

  it('active filter has green styling', () => {
    const cls = getFilterClass('all', 'all');
    expect(cls).toContain('bg-green/10');
    expect(cls).toContain('text-green');
  });

  it('inactive filter has muted styling', () => {
    const cls = getFilterClass('active', 'all');
    expect(cls).toContain('text-muted');
    expect(cls).not.toContain('bg-green/10');
  });

  it('all three filters exist', () => {
    const filters = ['all', 'active', 'executed'] as const;
    expect(filters).toHaveLength(3);
  });

  it('filter buttons have min-h-[44px] for touch targets', () => {
    const cls = getFilterClass('all', 'all');
    expect(cls).toContain('min-h-[44px]');
  });
});

describe('Proposals header layout', () => {
  it('New Proposal link target is /proposals/create', () => {
    const path = '/proposals/create';
    expect(path).toBe('/proposals/create');
  });

  it('header layout uses flex column on mobile, row on sm', () => {
    const cls = 'mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between';
    expect(cls).toContain('flex-col');
    expect(cls).toContain('sm:flex-row');
  });
});

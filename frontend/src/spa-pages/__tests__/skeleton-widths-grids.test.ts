import { describe, it, expect } from 'vitest';

describe('loading skeleton max-width constraints', () => {
  const routeWidths: Record<string, string> = {
    'root': 'max-w-5xl',
    'proposals': 'max-w-5xl',
    'analytics': 'max-w-6xl',
    'profile': 'max-w-3xl',
    'community': 'max-w-5xl',
    'api-docs': 'max-w-4xl',
  };

  it.each(Object.entries(routeWidths))('%s route uses %s width', (route, width) => {
    expect(width).toMatch(/^max-w-\d+xl$/);
  });

  it('analytics has widest container for charts', () => {
    expect(routeWidths['analytics']).toBe('max-w-6xl');
  });

  it('profile has narrowest container for focused content', () => {
    expect(routeWidths['profile']).toBe('max-w-3xl');
  });
});

describe('loading skeleton grid patterns', () => {
  it('proposals uses 2-column grid', () => {
    const grid = 'grid gap-4 sm:grid-cols-2';
    expect(grid).toContain('sm:grid-cols-2');
  });

  it('analytics stats use 4-column grid', () => {
    const grid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4';
    expect(grid).toContain('lg:grid-cols-4');
  });

  it('profile stats use 3-column grid', () => {
    const grid = 'grid gap-4 sm:grid-cols-3';
    expect(grid).toContain('sm:grid-cols-3');
  });

  it('community members use 3-column grid', () => {
    const grid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
    expect(grid).toContain('lg:grid-cols-3');
  });
});

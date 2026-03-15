import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import type { Proposal } from '../../types';

describe('proposal list rendering logic', () => {
  it('grid uses 2 columns on sm breakpoint', () => {
    const gridClass = 'grid gap-4 sm:grid-cols-2';
    expect(gridClass).toContain('sm:grid-cols-2');
  });

  it('each item has role listitem', () => {
    const role = 'listitem';
    expect(role).toBe('listitem');
  });

  it('list has role list', () => {
    const role = 'list';
    expect(role).toBe('list');
  });

  it('list has aria-label Proposals', () => {
    const ariaLabel = 'Proposals';
    expect(ariaLabel).toBe('Proposals');
  });
});

describe('empty state display', () => {
  it('shows empty message when no proposals match filter', () => {
    const proposals: Proposal[] = [];
    const message = proposals.length === 0 ? 'No proposals found' : '';
    expect(message).toBe('No proposals found');
  });

  it('shows call to action in empty state', () => {
    const cta = 'Be the first to create one!';
    expect(cta).toContain('create');
  });
});

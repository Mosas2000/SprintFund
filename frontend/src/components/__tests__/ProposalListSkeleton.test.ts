import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import * as ProposalListSkeletonModule from '../ProposalListSkeleton';

describe('ProposalListSkeleton module', () => {
  it('exports ProposalListSkeleton component', () => {
    expect(ProposalListSkeletonModule.ProposalListSkeleton).toBeDefined();
  });

  it('export is a function', () => {
    expect(typeof ProposalListSkeletonModule.ProposalListSkeleton).toBe('function');
  });
});

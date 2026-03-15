import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import * as DashboardSkeletonModule from '../DashboardSkeleton';

describe('DashboardSkeleton module', () => {
  it('exports DashboardSkeleton component', () => {
    expect(DashboardSkeletonModule.DashboardSkeleton).toBeDefined();
  });

  it('export is a function', () => {
    expect(typeof DashboardSkeletonModule.DashboardSkeleton).toBe('function');
  });
});

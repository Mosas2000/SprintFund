import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Many modules import `@stacks/connect`, which in turn pulls in browser-only
// code paths (Stencil/Connect UI). For unit tests we only need stable stubs.
vi.mock('@stacks/connect', () => {
  return {
    connect: vi.fn(async () => ({ addresses: [] })),
    disconnect: vi.fn(),
    isConnected: vi.fn(() => false),
    getLocalStorage: vi.fn(() => null),
  };
});

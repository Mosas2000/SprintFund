import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

/**
 * Vitest setup file for frontend tests.
 * 
 * This file runs before each test file and configures:
 * - Jest-DOM matchers (toBeInTheDocument, toHaveClass, etc.)
 * - Module mocks for browser-only dependencies
 */

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

// Mock @stacks/connect-react for React components
vi.mock('@stacks/connect-react', () => {
  return {
    useConnect: vi.fn(() => ({
      doContractCall: vi.fn(),
      doSTXTransfer: vi.fn(),
      isConnected: false,
    })),
    Connect: ({ children }: { children: React.ReactNode }) => children,
  };
});

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

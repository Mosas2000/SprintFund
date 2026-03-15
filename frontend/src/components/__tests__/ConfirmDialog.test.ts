import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import * as ConfirmDialogModule from '../ConfirmDialog';

describe('ConfirmDialog module', () => {
  it('exports ConfirmDialog component', () => {
    expect(ConfirmDialogModule.ConfirmDialog).toBeDefined();
  });

  it('export is a function', () => {
    expect(typeof ConfirmDialogModule.ConfirmDialog).toBe('function');
  });
});

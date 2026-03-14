import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { DIALOG_VARIANTS } from '../../lib/dialog-variants';

describe('DIALOG_VARIANTS', () => {
  it('exports dialog variant configurations', () => {
    expect(typeof DIALOG_VARIANTS).toBe('object');
    expect(Object.keys(DIALOG_VARIANTS).length).toBeGreaterThan(0);
  });

  it('has info variant', () => {
    expect(DIALOG_VARIANTS.info).toBeDefined();
  });

  it('has warning variant', () => {
    expect(DIALOG_VARIANTS.warning).toBeDefined();
  });

  it('has danger variant', () => {
    expect(DIALOG_VARIANTS.danger).toBeDefined();
  });

  it('each variant has a label property', () => {
    Object.values(DIALOG_VARIANTS).forEach(variant => {
      expect(variant).toHaveProperty('label');
    });
  });

  it('each variant has a className or color property', () => {
    Object.values(DIALOG_VARIANTS).forEach(variant => {
      const hasStyle = 'className' in variant || 'color' in variant || 'buttonClass' in variant;
      expect(hasStyle).toBe(true);
    });
  });
});

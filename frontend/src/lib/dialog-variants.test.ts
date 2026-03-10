import { describe, it, expect } from 'vitest';
import { VARIANT_CONFIG } from './dialog-variants';
import type { DialogVariant } from '../types/confirm-dialog';

const ALL_VARIANTS: DialogVariant[] = ['warning', 'danger', 'info'];

describe('VARIANT_CONFIG', () => {
  it('has entries for all three variants', () => {
    for (const variant of ALL_VARIANTS) {
      expect(VARIANT_CONFIG[variant]).toBeDefined();
    }
  });

  it('each entry has iconBg, iconColor, and confirmButton strings', () => {
    for (const variant of ALL_VARIANTS) {
      const config = VARIANT_CONFIG[variant];
      expect(typeof config.iconBg).toBe('string');
      expect(config.iconBg.length).toBeGreaterThan(0);
      expect(typeof config.iconColor).toBe('string');
      expect(config.iconColor.length).toBeGreaterThan(0);
      expect(typeof config.confirmButton).toBe('string');
      expect(config.confirmButton.length).toBeGreaterThan(0);
    }
  });

  it('warning variant uses amber colour classes', () => {
    const config = VARIANT_CONFIG.warning;
    expect(config.iconBg).toContain('amber');
    expect(config.iconColor).toContain('amber');
    expect(config.confirmButton).toContain('amber');
  });

  it('danger variant uses red colour classes', () => {
    const config = VARIANT_CONFIG.danger;
    expect(config.iconBg).toContain('red');
    expect(config.iconColor).toContain('red');
    expect(config.confirmButton).toContain('red');
  });

  it('info variant uses green colour classes', () => {
    const config = VARIANT_CONFIG.info;
    expect(config.iconBg).toContain('green');
    expect(config.iconColor).toContain('green');
    expect(config.confirmButton).toContain('green');
  });

  it('each variant has distinct iconBg values', () => {
    const values = ALL_VARIANTS.map((v) => VARIANT_CONFIG[v].iconBg);
    const unique = new Set(values);
    expect(unique.size).toBe(ALL_VARIANTS.length);
  });

  it('each variant has distinct iconColor values', () => {
    const values = ALL_VARIANTS.map((v) => VARIANT_CONFIG[v].iconColor);
    const unique = new Set(values);
    expect(unique.size).toBe(ALL_VARIANTS.length);
  });
});

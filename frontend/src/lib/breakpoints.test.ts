import { describe, it, expect } from 'vitest';
import { BREAKPOINTS, MIN_TOUCH_TARGET, RESPONSIVE } from './breakpoints';

describe('BREAKPOINTS', () => {
  it('defines sm as 640', () => {
    expect(BREAKPOINTS.sm).toBe(640);
  });

  it('defines md as 768', () => {
    expect(BREAKPOINTS.md).toBe(768);
  });

  it('defines lg as 1024', () => {
    expect(BREAKPOINTS.lg).toBe(1024);
  });

  it('defines xl as 1280', () => {
    expect(BREAKPOINTS.xl).toBe(1280);
  });

  it('has exactly four breakpoints', () => {
    const keys = Object.keys(BREAKPOINTS);
    expect(keys).toHaveLength(4);
    expect(keys).toEqual(['sm', 'md', 'lg', 'xl']);
  });

  it('values increase in order', () => {
    expect(BREAKPOINTS.sm).toBeLessThan(BREAKPOINTS.md);
    expect(BREAKPOINTS.md).toBeLessThan(BREAKPOINTS.lg);
    expect(BREAKPOINTS.lg).toBeLessThan(BREAKPOINTS.xl);
  });
});

describe('MIN_TOUCH_TARGET', () => {
  it('is 44 per WCAG 2.5.5', () => {
    expect(MIN_TOUCH_TARGET).toBe(44);
  });
});

describe('RESPONSIVE', () => {
  it('fullWidthMobile includes w-full and sm:w-auto', () => {
    expect(RESPONSIVE.fullWidthMobile).toContain('w-full');
    expect(RESPONSIVE.fullWidthMobile).toContain('sm:w-auto');
  });

  it('containerPadding includes px-4 and sm:px-6', () => {
    expect(RESPONSIVE.containerPadding).toContain('px-4');
    expect(RESPONSIVE.containerPadding).toContain('sm:px-6');
  });

  it('touchButton includes min-h-[44px]', () => {
    expect(RESPONSIVE.touchButton).toContain('min-h-[44px]');
  });

  it('touchInput includes min-h-[44px]', () => {
    expect(RESPONSIVE.touchInput).toContain('min-h-[44px]');
  });

  it('has exactly four utility strings', () => {
    const keys = Object.keys(RESPONSIVE);
    expect(keys).toHaveLength(4);
    expect(keys).toContain('fullWidthMobile');
    expect(keys).toContain('containerPadding');
    expect(keys).toContain('touchButton');
    expect(keys).toContain('touchInput');
  });
});

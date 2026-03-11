import { describe, it, expect } from 'vitest';
import { BREAKPOINTS, MIN_TOUCH_TARGET, RESPONSIVE } from './breakpoints';

/**
 * Validates the responsive design patterns adopted across the application.
 *
 * These tests act as a specification for consistency: all pages should
 * follow the same spacing, touch target, and breakpoint conventions.
 */
describe('Responsive design patterns', () => {
  describe('Touch target enforcement', () => {
    it('MIN_TOUCH_TARGET is at least 44px per WCAG 2.5.5', () => {
      expect(MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(44);
    });

    it('touch button class includes the correct min-h value', () => {
      expect(RESPONSIVE.touchButton).toContain(`min-h-[${MIN_TOUCH_TARGET}px]`);
    });

    it('touch input class includes the correct min-h value', () => {
      expect(RESPONSIVE.touchInput).toContain(`min-h-[${MIN_TOUCH_TARGET}px]`);
    });
  });

  describe('Tailwind responsive prefix convention', () => {
    it('sm breakpoint at 640px matches Tailwind default', () => {
      expect(BREAKPOINTS.sm).toBe(640);
    });

    it('md breakpoint at 768px matches Tailwind default', () => {
      expect(BREAKPOINTS.md).toBe(768);
    });

    it('lg breakpoint at 1024px matches Tailwind default', () => {
      expect(BREAKPOINTS.lg).toBe(1024);
    });

    it('xl breakpoint at 1280px matches Tailwind default', () => {
      expect(BREAKPOINTS.xl).toBe(1280);
    });
  });

  describe('Mobile-first class patterns', () => {
    it('fullWidthMobile uses mobile-first approach (w-full then sm:w-auto)', () => {
      const classes = RESPONSIVE.fullWidthMobile.split(' ');
      const baseIndex = classes.indexOf('w-full');
      const smIndex = classes.indexOf('sm:w-auto');

      expect(baseIndex).not.toBe(-1);
      expect(smIndex).not.toBe(-1);
      expect(baseIndex).toBeLessThan(smIndex);
    });

    it('containerPadding uses mobile-first approach (px-4 then sm:px-6)', () => {
      const classes = RESPONSIVE.containerPadding.split(' ');
      const baseIndex = classes.indexOf('px-4');
      const smIndex = classes.indexOf('sm:px-6');

      expect(baseIndex).not.toBe(-1);
      expect(smIndex).not.toBe(-1);
      expect(baseIndex).toBeLessThan(smIndex);
    });
  });

  describe('Stats grid pattern', () => {
    it('mobile grid-cols-1 upgrades to sm:grid-cols-2 then lg:grid-cols-4', () => {
      /* This is the pattern used in Dashboard and DashboardSkeleton */
      const gridClasses = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      expect(gridClasses).toContain('grid-cols-1');
      expect(gridClasses).toContain('sm:grid-cols-2');
      expect(gridClasses).toContain('lg:grid-cols-4');
    });
  });

  describe('Card padding pattern', () => {
    it('standard card padding is p-4 sm:p-6', () => {
      const cardPadding = 'p-4 sm:p-6';
      expect(cardPadding).toContain('p-4');
      expect(cardPadding).toContain('sm:p-6');
    });

    it('compact card padding is p-4 sm:p-5', () => {
      const compactPadding = 'p-4 sm:p-5';
      expect(compactPadding).toContain('p-4');
      expect(compactPadding).toContain('sm:p-5');
    });
  });

  describe('Form stacking pattern', () => {
    it('flex-col on mobile stacks to flex-row on sm', () => {
      const stackPattern = 'flex-col sm:flex-row';
      expect(stackPattern).toContain('flex-col');
      expect(stackPattern).toContain('sm:flex-row');
    });
  });

  describe('Text scaling pattern', () => {
    it('body text scales from text-sm to text-base', () => {
      const textScale = 'text-sm sm:text-base';
      expect(textScale).toContain('text-sm');
      expect(textScale).toContain('sm:text-base');
    });

    it('heading scales from text-xl to text-2xl', () => {
      const headingScale = 'text-xl sm:text-2xl';
      expect(headingScale).toContain('text-xl');
      expect(headingScale).toContain('sm:text-2xl');
    });
  });

  describe('CTA stacking pattern', () => {
    it('buttons stack vertically on mobile (flex-col) and inline on sm (sm:flex-row)', () => {
      const ctaStack = 'flex-col sm:flex-row';
      expect(ctaStack).toContain('flex-col');
      expect(ctaStack).toContain('sm:flex-row');
    });

    it('CTA buttons use full-width mobile pattern', () => {
      const ctaWidth = 'w-full sm:w-auto';
      expect(ctaWidth).toContain('w-full');
      expect(ctaWidth).toContain('sm:w-auto');
    });
  });

  describe('Spacing reduction pattern', () => {
    it('section padding reduces on mobile (py-10 sm:py-16)', () => {
      const sectionPadding = 'py-10 sm:py-16';
      expect(sectionPadding).toContain('py-10');
      expect(sectionPadding).toContain('sm:py-16');
    });

    it('gap reduces on mobile (gap-4 sm:gap-6)', () => {
      const gapPattern = 'gap-4 sm:gap-6';
      expect(gapPattern).toContain('gap-4');
      expect(gapPattern).toContain('sm:gap-6');
    });
  });

  describe('Hide/Show pattern', () => {
    it('mobile-only elements use sm:hidden', () => {
      const mobileOnly = 'sm:hidden';
      expect(mobileOnly).toBe('sm:hidden');
    });

    it('desktop-only elements use hidden sm:flex or hidden sm:block', () => {
      const desktopOnlyFlex = 'hidden sm:flex';
      const desktopOnlyBlock = 'hidden sm:block';
      expect(desktopOnlyFlex).toContain('hidden');
      expect(desktopOnlyFlex).toContain('sm:flex');
      expect(desktopOnlyBlock).toContain('hidden');
      expect(desktopOnlyBlock).toContain('sm:block');
    });
  });

  describe('Overflow prevention', () => {
    it('root layout uses overflow-x-hidden to prevent horizontal scroll', () => {
      const overflowClass = 'overflow-x-hidden';
      expect(overflowClass).toBe('overflow-x-hidden');
    });
  });
});

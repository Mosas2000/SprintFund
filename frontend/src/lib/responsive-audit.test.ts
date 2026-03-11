import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Reads a source file from the frontend directory and returns its contents.
 */
function readSource(relativePath: string): string {
  const fullPath = resolve(__dirname, '..', relativePath);
  return readFileSync(fullPath, 'utf8');
}

/**
 * Audit tests that verify responsive classes are present in actual source files.
 *
 * These guard against accidental removal of responsive patterns during
 * future refactors.
 */
describe('Touch target audit (min-h-[44px])', () => {
  it('HamburgerButton has 44px minimum touch target', () => {
    const source = readSource('components/HamburgerButton.tsx');
    expect(source).toContain('min-h-[44px]');
    expect(source).toContain('min-w-[44px]');
  });

  it('MobileNavDrawer links have 44px minimum height', () => {
    const source = readSource('components/MobileNavDrawer.tsx');
    expect(source).toContain('min-h-[44px]');
  });

  it('Footer link has 44px minimum touch target', () => {
    const source = readSource('components/Footer.tsx');
    expect(source).toContain('min-h-[44px]');
  });

  it('ProposalCard has responsive padding', () => {
    const source = readSource('components/ProposalCard.tsx');
    expect(source).toContain('p-4 sm:p-5');
  });
});

describe('Responsive class audit', () => {
  it('Header hides desktop nav on small screens', () => {
    const source = readSource('components/Header.tsx');
    expect(source).toContain('hidden sm:flex');
  });

  it('Header includes HamburgerButton', () => {
    const source = readSource('components/Header.tsx');
    expect(source).toContain('HamburgerButton');
  });

  it('Header includes MobileNavDrawer', () => {
    const source = readSource('components/Header.tsx');
    expect(source).toContain('MobileNavDrawer');
  });

  it('Layout prevents horizontal overflow', () => {
    const source = readSource('components/Layout.tsx');
    expect(source).toContain('overflow-x-hidden');
  });

  it('DashboardSkeleton uses responsive grid', () => {
    const source = readSource('components/DashboardSkeleton.tsx');
    expect(source).toContain('grid-cols-1');
    expect(source).toContain('sm:grid-cols-2');
  });

  it('ProposalDetailSkeleton uses responsive padding', () => {
    const source = readSource('components/ProposalDetailSkeleton.tsx');
    expect(source).toContain('p-4 sm:p-6');
  });

  it('ConnectWallet has mobile touch targets', () => {
    const source = readSource('components/ConnectWallet.tsx');
    expect(source).toContain('min-h-[36px]');
  });
});

describe('Mobile menu integration audit', () => {
  it('useMobileMenu imports BREAKPOINTS', () => {
    const source = readSource('hooks/useMobileMenu.ts');
    expect(source).toContain('BREAKPOINTS');
    expect(source).toContain('breakpoints');
  });

  it('useBodyScrollLock locks body position to fixed', () => {
    const source = readSource('hooks/useBodyScrollLock.ts');
    expect(source).toContain("position");
    expect(source).toContain("fixed");
  });

  it('Header imports useBodyScrollLock', () => {
    const source = readSource('components/Header.tsx');
    expect(source).toContain('useBodyScrollLock');
  });
});

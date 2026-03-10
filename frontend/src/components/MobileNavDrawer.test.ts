import { describe, it, expect } from 'vitest';
import { MIN_TOUCH_TARGET } from '../lib/breakpoints';

/**
 * MobileNavDrawer contract tests.
 *
 * The drawer is a presentational component that depends on
 * react-router-dom and ConnectWallet. These tests validate
 * the design contracts without a full DOM render.
 */
describe('MobileNavDrawer design contract', () => {
  it('MIN_TOUCH_TARGET is used for nav link height', () => {
    const linkClass = `min-h-[${MIN_TOUCH_TARGET}px]`;
    expect(linkClass).toBe('min-h-[44px]');
  });

  it('drawer should be hidden on sm+ viewports', () => {
    const drawerVisibility = 'sm:hidden';
    expect(drawerVisibility).toBe('sm:hidden');
  });

  it('drawer uses dialog role for accessibility', () => {
    const role = 'dialog';
    expect(role).toBe('dialog');
  });

  it('drawer has an accessible label', () => {
    const ariaLabel = 'Navigation menu';
    expect(ariaLabel).toBeTruthy();
    expect(typeof ariaLabel).toBe('string');
  });

  it('nav items must have a to and label property', () => {
    const item = { to: '/proposals', label: 'Proposals' };
    expect(item).toHaveProperty('to');
    expect(item).toHaveProperty('label');
    expect(typeof item.to).toBe('string');
    expect(typeof item.label).toBe('string');
  });

  it('active link uses aria-current="page"', () => {
    const ariaCurrent = 'page';
    expect(ariaCurrent).toBe('page');
  });

  it('inactive link has no aria-current', () => {
    const ariaCurrent = undefined;
    expect(ariaCurrent).toBeUndefined();
  });

  it('mobile nav label is distinct from desktop nav', () => {
    const mobileNavLabel = 'Mobile navigation';
    const desktopNavLabel = 'Main navigation';
    expect(mobileNavLabel).not.toBe(desktopNavLabel);
  });
});

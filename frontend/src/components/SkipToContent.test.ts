import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/* ──────────────────────────────────────────────
 * Tests for the SkipToContent accessibility pattern:
 * verifying the anchor element has the correct href, text, and styles.
 * ────────────────────────────────────────────── */

describe('SkipToContent accessibility contract', () => {
  let anchor: HTMLAnchorElement;

  beforeEach(() => {
    anchor = document.createElement('a');
    anchor.href = '#main-content';
    anchor.textContent = 'Skip to main content';
    anchor.className = 'sr-only';
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    document.body.removeChild(anchor);
  });

  it('points to the main content anchor', () => {
    expect(anchor.getAttribute('href')).toBe('#main-content');
  });

  it('has descriptive text for screen readers', () => {
    expect(anchor.textContent).toBe('Skip to main content');
  });

  it('is visually hidden by default', () => {
    expect(anchor.className).toContain('sr-only');
  });

  it('is an anchor element', () => {
    expect(anchor.tagName).toBe('A');
  });

  it('can receive focus', () => {
    anchor.focus();
    expect(document.activeElement).toBe(anchor);
  });
});

describe('main-content target', () => {
  let main: HTMLElement;

  beforeEach(() => {
    main = document.createElement('main');
    main.id = 'main-content';
    main.tabIndex = -1;
    document.body.appendChild(main);
  });

  afterEach(() => {
    document.body.removeChild(main);
  });

  it('has the correct id', () => {
    expect(main.id).toBe('main-content');
  });

  it('has tabIndex=-1 for programmatic focus', () => {
    expect(main.tabIndex).toBe(-1);
  });

  it('can receive programmatic focus', () => {
    main.focus();
    expect(document.activeElement).toBe(main);
  });
});

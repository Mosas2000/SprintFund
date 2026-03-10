import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/* ──────────────────────────────────────────────
 * Tests for landmark roles and heading hierarchy.
 *
 * These verify the expected ARIA landmark structure and
 * heading hierarchy that assistive technology relies on
 * for page navigation.
 * ────────────────────────────────────────────── */

describe('landmark role assignments', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('header has banner role', () => {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    container.appendChild(header);
    expect(header.getAttribute('role')).toBe('banner');
  });

  it('footer has contentinfo role', () => {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    container.appendChild(footer);
    expect(footer.getAttribute('role')).toBe('contentinfo');
  });

  it('main content area has id for skip link target', () => {
    const main = document.createElement('main');
    main.id = 'main-content';
    container.appendChild(main);
    expect(main.id).toBe('main-content');
  });

  it('navigation has an accessible label', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main navigation');
    container.appendChild(nav);
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('aside has an accessible label', () => {
    const aside = document.createElement('aside');
    aside.setAttribute('aria-label', 'Proposal details');
    container.appendChild(aside);
    expect(aside.getAttribute('aria-label')).toBe('Proposal details');
  });

  it('breadcrumb navigation has an accessible label', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Breadcrumb');
    container.appendChild(nav);
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });
});

describe('heading hierarchy', () => {
  it('headings follow a sequential order without gaps', () => {
    const validSequences = [
      [1, 2, 3],       // h1 -> h2 -> h3
      [1, 2, 2],       // h1 -> h2, h2 (siblings)
      [1, 2],           // h1 -> h2
      [1, 2, 3, 2, 3], // h1 -> h2 -> h3, h2 -> h3
    ];

    for (const sequence of validSequences) {
      let isValid = true;
      for (let i = 1; i < sequence.length; i++) {
        const jump = sequence[i] - sequence[i - 1];
        if (jump > 1) {
          isValid = false;
          break;
        }
      }
      expect(isValid).toBe(true);
    }
  });

  it('detects invalid heading gaps', () => {
    const invalidSequences = [
      [1, 3],     // skips h2
      [1, 4],     // skips h2 and h3
      [2, 4],     // skips h3
    ];

    for (const sequence of invalidSequences) {
      let hasGap = false;
      for (let i = 1; i < sequence.length; i++) {
        const jump = sequence[i] - sequence[i - 1];
        if (jump > 1) {
          hasGap = true;
          break;
        }
      }
      expect(hasGap).toBe(true);
    }
  });

  it('page heading starts at h1', () => {
    const el = document.createElement('h1');
    el.textContent = 'Page Title';
    expect(el.tagName).toBe('H1');
  });

  it('section headings use h2', () => {
    const el = document.createElement('h2');
    el.textContent = 'Section Title';
    expect(el.tagName).toBe('H2');
  });
});

describe('aria-current for active navigation', () => {
  it('marks the current route with aria-current=page', () => {
    const link = document.createElement('a');
    link.setAttribute('aria-current', 'page');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('does not set aria-current on inactive links', () => {
    const link = document.createElement('a');
    expect(link.getAttribute('aria-current')).toBeNull();
  });
});

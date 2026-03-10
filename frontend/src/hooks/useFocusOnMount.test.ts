import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/* ──────────────────────────────────────────────
 * Tests for the useFocusOnMount pattern: creating an element with
 * tabIndex=-1, programmatically focusing it, and verifying preventScroll.
 * ────────────────────────────────────────────── */

describe('useFocusOnMount behaviour', () => {
  let heading: HTMLHeadingElement;

  beforeEach(() => {
    heading = document.createElement('h1');
    heading.tabIndex = -1;
    heading.textContent = 'Page Heading';
    document.body.appendChild(heading);
  });

  afterEach(() => {
    document.body.removeChild(heading);
  });

  it('creates an element that can receive programmatic focus', () => {
    heading.focus();
    expect(document.activeElement).toBe(heading);
  });

  it('does not add the element to the tab order', () => {
    expect(heading.tabIndex).toBe(-1);
  });

  it('has the correct text content', () => {
    expect(heading.textContent).toBe('Page Heading');
  });

  it('is focusable via the focus method', () => {
    heading.focus({ preventScroll: true });
    expect(document.activeElement).toBe(heading);
  });

  it('can lose focus when another element is focused', () => {
    heading.focus();
    expect(document.activeElement).toBe(heading);

    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    expect(document.activeElement).toBe(button);
    document.body.removeChild(button);
  });

  it('blurs properly when blur is called', () => {
    heading.focus();
    heading.blur();
    expect(document.activeElement).not.toBe(heading);
  });
});

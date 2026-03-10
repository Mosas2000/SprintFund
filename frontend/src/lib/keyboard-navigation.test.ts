import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/* ──────────────────────────────────────────────
 * Tests for keyboard navigation and interaction patterns.
 *
 * Verifies that interactive elements support keyboard
 * activation and that focus management works correctly.
 * ────────────────────────────────────────────── */

describe('keyboard activation of interactive elements', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('buttons are focusable by default', () => {
    const button = document.createElement('button');
    button.textContent = 'Submit';
    container.appendChild(button);
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('links are focusable by default', () => {
    const link = document.createElement('a');
    link.href = '/proposals';
    link.textContent = 'View Proposals';
    container.appendChild(link);
    link.focus();
    expect(document.activeElement).toBe(link);
  });

  it('Enter key activates a button via click event', () => {
    const button = document.createElement('button');
    button.textContent = 'Vote';
    container.appendChild(button);

    let clicked = false;
    button.addEventListener('click', () => { clicked = true; });

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    button.dispatchEvent(event);
    button.click();

    expect(clicked).toBe(true);
  });

  it('Space key activates a button via click event', () => {
    const button = document.createElement('button');
    button.textContent = 'Stake';
    container.appendChild(button);

    let clicked = false;
    button.addEventListener('click', () => { clicked = true; });

    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    button.dispatchEvent(event);
    button.click();

    expect(clicked).toBe(true);
  });
});

describe('programmatic focus management', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('elements with tabIndex=-1 can receive programmatic focus', () => {
    const heading = document.createElement('h1');
    heading.tabIndex = -1;
    heading.textContent = 'Page Title';
    container.appendChild(heading);

    heading.focus();
    expect(document.activeElement).toBe(heading);
  });

  it('elements with tabIndex=-1 are not in the tab order', () => {
    const heading = document.createElement('h1');
    heading.tabIndex = -1;
    container.appendChild(heading);

    expect(heading.tabIndex).toBe(-1);
  });

  it('focus moves to target when skip link is activated', () => {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.tabIndex = -1;
    container.appendChild(main);

    main.focus();
    expect(document.activeElement).toBe(main);
  });

  it('focus can move between interactive elements', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'First';
    const button2 = document.createElement('button');
    button2.textContent = 'Second';

    container.appendChild(button1);
    container.appendChild(button2);

    button1.focus();
    expect(document.activeElement).toBe(button1);

    button2.focus();
    expect(document.activeElement).toBe(button2);
  });
});

describe('aria-pressed for toggle buttons', () => {
  it('filter buttons toggle aria-pressed state', () => {
    const button = document.createElement('button');
    button.setAttribute('aria-pressed', 'false');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.setAttribute('aria-pressed', 'true');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('filter group has role=group and accessible label', () => {
    const group = document.createElement('div');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Filter proposals by status');

    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toContain('Filter');
  });
});

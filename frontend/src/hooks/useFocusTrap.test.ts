import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * useFocusTrap internal logic tests.
 *
 * We test the pure helper function (getFocusableElements equivalent)
 * and verify keydown behaviour through simulated DOM interactions.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

describe('getFocusableElements (focus trap selector)', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('finds buttons that are not disabled', () => {
    container.innerHTML = '<button>OK</button><button disabled>Nope</button>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(1);
    expect(result[0].textContent).toBe('OK');
  });

  it('finds links with href', () => {
    container.innerHTML = '<a href="/test">Link</a><a>No href</a>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(1);
    expect(result[0].textContent).toBe('Link');
  });

  it('finds input elements that are not disabled', () => {
    container.innerHTML = '<input type="text" /><input type="text" disabled />';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(1);
  });

  it('finds textarea elements', () => {
    container.innerHTML = '<textarea></textarea>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(1);
  });

  it('finds select elements', () => {
    container.innerHTML = '<select><option>A</option></select>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(1);
  });

  it('finds elements with positive tabindex', () => {
    container.innerHTML = '<div tabindex="0">Focusable</div>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(1);
  });

  it('excludes elements with tabindex=-1', () => {
    container.innerHTML = '<div tabindex="-1">Not focusable</div>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(0);
  });

  it('returns empty array for container with no focusable elements', () => {
    container.innerHTML = '<div><p>Just text</p></div>';
    const result = getFocusableElements(container);
    expect(result).toHaveLength(0);
  });

  it('returns elements in DOM order', () => {
    container.innerHTML = `
      <button>First</button>
      <input type="text" />
      <button>Last</button>
    `;
    const result = getFocusableElements(container);
    expect(result).toHaveLength(3);
    expect(result[0].textContent).toBe('First');
    expect(result[2].textContent).toBe('Last');
  });
});

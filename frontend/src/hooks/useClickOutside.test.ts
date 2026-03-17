import { describe, it, expect, vi } from 'vitest';

describe('useClickOutside behavior', () => {
  it('callback is invoked when click target is not within ref element', () => {
    const callback = vi.fn();
    const refElement = document.createElement('div');
    const outsideElement = document.createElement('div');

    document.body.appendChild(refElement);
    document.body.appendChild(outsideElement);

    function handleClick(event: MouseEvent) {
      if (refElement && !refElement.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick);
    outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).toHaveBeenCalledTimes(1);

    document.removeEventListener('mousedown', handleClick);
    document.body.removeChild(refElement);
    document.body.removeChild(outsideElement);
  });

  it('callback is not invoked when click is inside ref element', () => {
    const callback = vi.fn();
    const refElement = document.createElement('div');
    const childElement = document.createElement('span');
    refElement.appendChild(childElement);
    document.body.appendChild(refElement);

    function handleClick(event: MouseEvent) {
      if (refElement && !refElement.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick);
    childElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();

    document.removeEventListener('mousedown', handleClick);
    document.body.removeChild(refElement);
  });

  it('listener is cleaned up when disabled', () => {
    const callback = vi.fn();
    const enabled = false;
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    if (enabled) {
      document.addEventListener('mousedown', callback);
    }

    outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });
});

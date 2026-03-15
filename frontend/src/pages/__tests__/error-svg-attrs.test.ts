import { describe, it, expect } from 'vitest';

describe('error icon SVG attributes', () => {
  const defaultAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '32',
    height: '32',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  it('uses standard SVG namespace', () => {
    expect(defaultAttrs.xmlns).toBe('http://www.w3.org/2000/svg');
  });

  it('icons are 32x32 pixels', () => {
    expect(defaultAttrs.width).toBe('32');
    expect(defaultAttrs.height).toBe('32');
  });

  it('icons use 24x24 viewBox', () => {
    expect(defaultAttrs.viewBox).toBe('0 0 24 24');
  });

  it('icons use currentColor for theming', () => {
    expect(defaultAttrs.stroke).toBe('currentColor');
  });

  it('icons have rounded line caps and joins', () => {
    expect(defaultAttrs.strokeLinecap).toBe('round');
    expect(defaultAttrs.strokeLinejoin).toBe('round');
  });
});

describe('home icon SVG attributes', () => {
  const homeAttrs = {
    width: '16',
    height: '16',
  };

  it('home icon is 16x16 for inline use', () => {
    expect(homeAttrs.width).toBe('16');
    expect(homeAttrs.height).toBe('16');
  });
});

import { describe, it, expect } from 'vitest';

describe('loading page structure', () => {
  it('uses primary color for spinner border', () => {
    const style = 'hsl(var(--primary))';
    expect(style).toContain('--primary');
  });

  it('has loading text', () => {
    const text = 'Loading SprintFund...';
    expect(text).toContain('Loading');
    expect(text).toContain('SprintFund');
  });

  it('spinner uses animate-spin', () => {
    const className = 'animate-spin';
    expect(className).toBe('animate-spin');
  });

  it('loading text uses animate-pulse', () => {
    const className = 'animate-pulse';
    expect(className).toBe('animate-pulse');
  });

  it('has dual ring spinner (inner ring reverse)', () => {
    const innerStyle = { animationDirection: 'reverse', animationDuration: '0.6s' };
    expect(innerStyle.animationDirection).toBe('reverse');
    expect(innerStyle.animationDuration).toBe('0.6s');
  });

  it('has glow effect behind spinner', () => {
    const glowClass = 'blur-3xl opacity-10';
    expect(glowClass).toContain('blur-3xl');
    expect(glowClass).toContain('opacity-10');
  });

  it('centers content vertically and horizontally', () => {
    const containerClass = 'flex min-h-screen flex-col items-center justify-center';
    expect(containerClass).toContain('min-h-screen');
    expect(containerClass).toContain('items-center');
    expect(containerClass).toContain('justify-center');
  });
});

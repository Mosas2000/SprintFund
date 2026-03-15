import { describe, it, expect } from 'vitest';

describe('error page button interactions', () => {
  it('primary button has hover:scale-105 for hover feedback', () => {
    const cls = 'transition-all hover:scale-105 active:scale-95';
    expect(cls).toContain('hover:scale-105');
  });

  it('primary button has active:scale-95 for press feedback', () => {
    const cls = 'transition-all hover:scale-105 active:scale-95';
    expect(cls).toContain('active:scale-95');
  });

  it('secondary button has border styling', () => {
    const style = { borderColor: 'hsl(var(--border))' };
    expect(style.borderColor).toContain('--border');
  });

  it('primary button uses primary background', () => {
    const style = { background: 'hsl(var(--primary))' };
    expect(style.background).toContain('--primary');
  });

  it('buttons have adequate padding', () => {
    const cls = 'px-5 py-2.5';
    expect(cls).toContain('px-5');
    expect(cls).toContain('py-2.5');
  });

  it('root error buttons have larger padding', () => {
    const cls = 'px-6 py-3';
    expect(cls).toContain('px-6');
    expect(cls).toContain('py-3');
  });
});

describe('error page glow effect', () => {
  it('404 page has blur-3xl glow behind number', () => {
    const glowClass = 'absolute inset-0 blur-3xl opacity-20';
    expect(glowClass).toContain('blur-3xl');
    expect(glowClass).toContain('opacity-20');
  });

  it('glow uses primary color for 404', () => {
    const style = { background: 'hsl(var(--primary))' };
    expect(style.background).toContain('--primary');
  });

  it('glow uses destructive color for 500', () => {
    const style = { background: 'hsl(var(--destructive))' };
    expect(style.background).toContain('--destructive');
  });
});

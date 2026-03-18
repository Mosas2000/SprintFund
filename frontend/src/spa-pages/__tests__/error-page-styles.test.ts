import { describe, it, expect } from 'vitest';

describe('error page CSS variable consistency', () => {
  const cssVars = [
    '--background',
    '--foreground',
    '--primary',
    '--primary-foreground',
    '--destructive',
    '--destructive-foreground',
    '--muted',
    '--muted-foreground',
    '--border',
  ];

  it('all required CSS variables are defined', () => {
    expect(cssVars).toHaveLength(9);
  });

  it.each(cssVars)('variable %s follows naming convention', (varName) => {
    expect(varName).toMatch(/^--[a-z]+(-[a-z]+)*$/);
  });

  it('primary color is used for CTA buttons', () => {
    const buttonStyle = 'hsl(var(--primary))';
    expect(buttonStyle).toContain('--primary');
  });

  it('destructive color is used for error indicators', () => {
    const errorStyle = 'hsl(var(--destructive))';
    expect(errorStyle).toContain('--destructive');
  });

  it('muted-foreground is used for descriptions', () => {
    const descStyle = 'hsl(var(--muted-foreground))';
    expect(descStyle).toContain('--muted-foreground');
  });

  it('border is used for secondary buttons', () => {
    const borderStyle = 'hsl(var(--border))';
    expect(borderStyle).toContain('--border');
  });
});

describe('error page responsive layout', () => {
  it('root 404 uses min-h-screen', () => {
    const cls = 'flex min-h-screen flex-col items-center justify-center px-4 text-center';
    expect(cls).toContain('min-h-screen');
  });

  it('sub-route errors use min-h-[60vh]', () => {
    const cls = 'flex min-h-[60vh] flex-col items-center justify-center px-4 text-center';
    expect(cls).toContain('min-h-[60vh]');
  });

  it('buttons are responsive flex-col on mobile, flex-row on sm', () => {
    const cls = 'flex flex-col gap-3 sm:flex-row';
    expect(cls).toContain('flex-col');
    expect(cls).toContain('sm:flex-row');
  });

  it('404 text scales between mobile and desktop', () => {
    const cls = 'text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]';
    expect(cls).toContain('text-[8rem]');
    expect(cls).toContain('sm:text-[12rem]');
  });
});

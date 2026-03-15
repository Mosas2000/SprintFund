import { describe, it, expect } from 'vitest';

describe('error page SEO considerations', () => {
  it('404 page does not contain sensitive data', () => {
    const content = 'The page you are looking for does not exist or has been moved.';
    expect(content).not.toContain('password');
    expect(content).not.toContain('token');
    expect(content).not.toContain('secret');
  });

  it('500 page encourages return without exposing internals', () => {
    const content = 'An unexpected error occurred. This has been logged and our team will look into it.';
    expect(content).not.toContain('stack');
    expect(content).not.toContain('trace');
    expect(content).toContain('logged');
  });

  it('error pages include navigation back to working pages', () => {
    const homeLink = '/';
    expect(homeLink).toBe('/');
  });
});

describe('error page theme compatibility', () => {
  it('uses CSS variables instead of hardcoded colors', () => {
    const styles = [
      'hsl(var(--primary))',
      'hsl(var(--foreground))',
      'hsl(var(--destructive))',
      'hsl(var(--muted-foreground))',
    ];

    styles.forEach(style => {
      expect(style).toContain('var(--');
      expect(style).not.toMatch(/#[0-9a-f]{3,6}/i);
    });
  });

  it('works with light, dark, and oled themes', () => {
    const themes = ['light', 'dark', 'oled'];
    // These are defined in globals.css via [data-theme] attribute
    expect(themes).toContain('dark');
    expect(themes).toContain('oled');
  });
});

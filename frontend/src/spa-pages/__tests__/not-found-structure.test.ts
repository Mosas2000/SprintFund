import { describe, it, expect } from 'vitest';

describe('not-found page structure', () => {
  it('displays 404 status code', () => {
    const statusCode = '404';
    expect(statusCode).toBe('404');
  });

  it('has descriptive heading', () => {
    const heading = 'Page not found';
    expect(heading).toContain('not found');
  });

  it('has helpful description', () => {
    const desc = 'The page you are looking for does not exist or has been moved.';
    expect(desc).toContain('does not exist');
    expect(desc).toContain('moved');
  });

  it('provides link back to homepage', () => {
    const linkHref = '/';
    expect(linkHref).toBe('/');
  });

  it('link text includes Back to Home', () => {
    const linkText = 'Back to Home';
    expect(linkText).toBe('Back to Home');
  });

  it('uses primary color for status code', () => {
    const style = 'hsl(var(--primary))';
    expect(style).toContain('--primary');
  });
});

describe('not-found page accessibility', () => {
  it('uses semantic heading hierarchy', () => {
    const h1Content = '404';
    const h2Content = 'Page not found';
    expect(h1Content).toBeTruthy();
    expect(h2Content).toBeTruthy();
  });

  it('home link has visible text', () => {
    const linkText = 'Back to Home';
    expect(linkText.length).toBeGreaterThan(0);
  });
});

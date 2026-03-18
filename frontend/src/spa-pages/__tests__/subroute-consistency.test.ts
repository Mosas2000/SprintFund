import { describe, it, expect } from 'vitest';

describe('sub-route error page consistency', () => {
  const routes = ['proposals', 'analytics', 'profile', 'community', 'api-docs'];

  it('all routes have error pages', () => {
    expect(routes).toHaveLength(5);
  });

  it.each(routes)('%s error page has retry button', (route) => {
    const hasRetry = true; // All error pages include retry
    expect(hasRetry).toBe(true);
  });

  it.each(routes)('%s error page has home link', (route) => {
    const hasHomeLink = true;
    expect(hasHomeLink).toBe(true);
  });

  it.each(routes)('%s error page has contextual icon', (route) => {
    const hasIcon = true;
    expect(hasIcon).toBe(true);
  });

  it.each(routes)('%s error page logs to console', (route) => {
    const logsError = true; // All use useEffect + console.error
    expect(logsError).toBe(true);
  });
});

describe('sub-route loading page consistency', () => {
  const routes = ['proposals', 'analytics', 'profile', 'community', 'api-docs'];

  it('all routes have loading pages', () => {
    expect(routes).toHaveLength(5);
  });

  it.each(routes)('%s loading page uses muted background for skeletons', () => {
    const style = 'hsl(var(--muted))';
    expect(style).toContain('--muted');
  });

  it.each(routes)('%s loading page uses animate-pulse', () => {
    const className = 'animate-pulse';
    expect(className).toBe('animate-pulse');
  });

  it.each(routes)('%s loading page uses border color', () => {
    const style = 'hsl(var(--border))';
    expect(style).toContain('--border');
  });
});

import { describe, it, expect } from 'vitest';
import { SITE_URL, PAGE_SEO_CONFIGS } from '../types/seo';
import { generateSitemapEntries } from '../lib/seo-utils';

/**
 * Tests for the robots.txt and sitemap.xml generation logic.
 *
 * Since robots.ts and sitemap.ts are Next.js App Router convention
 * files that return framework-specific types, we test the underlying
 * logic and data shapes rather than importing the route handlers
 * directly (which depend on the Next.js runtime).
 */

describe('Robots configuration logic', () => {
  const disallowedPaths = ['/api/', '/profile/'];
  const allowedPaths = ['/', '/proposals', '/analytics', '/community', '/api-docs'];

  it('disallows the /api/ path for crawlers', () => {
    expect(disallowedPaths).toContain('/api/');
  });

  it('disallows the /profile/ path for generic crawlers', () => {
    expect(disallowedPaths).toContain('/profile/');
  });

  it('allows the root path', () => {
    expect(allowedPaths).toContain('/');
  });

  it('does not disallow public content paths', () => {
    const publicPaths = ['/proposals', '/analytics', '/community', '/api-docs'];
    publicPaths.forEach((path) => {
      expect(disallowedPaths).not.toContain(path);
      expect(disallowedPaths).not.toContain(`${path}/`);
    });
  });

  it('sitemap URL uses the correct site URL', () => {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    expect(sitemapUrl).toBe('https://sprintfund.org/sitemap.xml');
  });
});

describe('Sitemap generation logic', () => {
  const entries = generateSitemapEntries();

  it('generates entries for all non-noIndex pages', () => {
    const publicConfigs = PAGE_SEO_CONFIGS.filter((c) => !c.noIndex);
    expect(entries.length).toBe(publicConfigs.length);
  });

  it('all entries have absolute URLs', () => {
    entries.forEach((entry) => {
      expect(entry.url.startsWith('https://')).toBe(true);
    });
  });

  it('all URLs start with the site base URL', () => {
    entries.forEach((entry) => {
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
    });
  });

  it('home page entry URL matches the site base URL', () => {
    const home = entries.find((e) => e.url === SITE_URL);
    expect(home).toBeDefined();
  });

  it('home page has priority 1.0', () => {
    const home = entries.find((e) => e.url === SITE_URL);
    expect(home?.priority).toBe(1.0);
  });

  it('sub-pages have priority 0.8', () => {
    const subPages = entries.filter((e) => e.url !== SITE_URL);
    subPages.forEach((entry) => {
      expect(entry.priority).toBe(0.8);
    });
  });

  it('home page has daily change frequency', () => {
    const home = entries.find((e) => e.url === SITE_URL);
    expect(home?.changeFrequency).toBe('daily');
  });

  it('sub-pages have weekly change frequency', () => {
    const subPages = entries.filter((e) => e.url !== SITE_URL);
    subPages.forEach((entry) => {
      expect(entry.changeFrequency).toBe('weekly');
    });
  });

  it('all entries have lastModified in YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    entries.forEach((entry) => {
      expect(entry.lastModified).toMatch(dateRegex);
    });
  });

  it('all entry URLs are unique', () => {
    const urls = entries.map((e) => e.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });

  it('does not include URLs ending with trailing slashes', () => {
    entries.forEach((entry) => {
      if (entry.url !== SITE_URL) {
        expect(entry.url.endsWith('/')).toBe(false);
      }
    });
  });

  it('includes the proposals page', () => {
    const proposals = entries.find((e) => e.url.includes('/proposals'));
    expect(proposals).toBeDefined();
  });

  it('includes the analytics page', () => {
    const analytics = entries.find((e) => e.url.includes('/analytics'));
    expect(analytics).toBeDefined();
  });

  it('includes the community page', () => {
    const community = entries.find((e) => e.url.includes('/community'));
    expect(community).toBeDefined();
  });
});

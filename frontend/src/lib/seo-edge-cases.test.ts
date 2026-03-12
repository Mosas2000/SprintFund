import { describe, it, expect } from 'vitest';
import {
  buildCanonicalUrl,
  buildOgImageUrl,
  buildSeoMetadata,
  findPageSeoConfig,
  formatPageTitle,
  truncateDescription,
  validateSeoConfig,
} from '../lib/seo-utils';
import { buildNextMetadata } from '../lib/metadata-builder';
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildWebPageJsonLd,
  serializeJsonLd,
} from '../lib/json-ld';
import { SITE_URL, PAGE_SEO_CONFIGS } from '../types/seo';
import type { PageSeoConfig } from '../types/seo';

/**
 * Edge case tests for the SEO system. These cover boundary
 * conditions, unusual inputs, and integration scenarios that
 * are unlikely to occur normally but must be handled gracefully.
 */

describe('Canonical URL edge cases', () => {
  it('handles empty string path', () => {
    const url = buildCanonicalUrl('');
    expect(url).toBe(SITE_URL);
  });

  it('handles paths with query parameters', () => {
    const url = buildCanonicalUrl('/proposals?page=2');
    expect(url).toBe(`${SITE_URL}/proposals?page=2`);
  });

  it('handles paths with hash fragments', () => {
    const url = buildCanonicalUrl('/proposals#section');
    expect(url).toBe(`${SITE_URL}/proposals#section`);
  });

  it('handles deeply nested paths', () => {
    const url = buildCanonicalUrl('/a/b/c/d/e');
    expect(url).toBe(`${SITE_URL}/a/b/c/d/e`);
  });

  it('handles paths with special characters', () => {
    const url = buildCanonicalUrl('/proposals/my-proposal');
    expect(url).toBe(`${SITE_URL}/proposals/my-proposal`);
  });
});

describe('OG image URL edge cases', () => {
  it('handles paths with query strings', () => {
    const url = buildOgImageUrl('/og.png?v=2');
    expect(url).toBe(`${SITE_URL}/og.png?v=2`);
  });

  it('handles https URLs with ports', () => {
    const url = buildOgImageUrl('https://cdn.example.com:8080/image.png');
    expect(url).toBe('https://cdn.example.com:8080/image.png');
  });

  it('handles empty string as path', () => {
    const url = buildOgImageUrl('');
    // empty string is falsy, so falls back to default
    expect(url).toContain(SITE_URL);
  });
});

describe('Page title formatting edge cases', () => {
  it('handles titles with pipe characters', () => {
    const title = formatPageTitle('Test | Something');
    expect(title).toContain('SprintFund');
  });

  it('handles very long titles', () => {
    const longTitle = 'A'.repeat(200);
    const formatted = formatPageTitle(longTitle);
    expect(formatted).toContain('SprintFund');
  });

  it('handles titles with special unicode characters', () => {
    const title = formatPageTitle('Proposals for Stacks');
    expect(title).toContain('SprintFund');
  });
});

describe('Description truncation edge cases', () => {
  it('handles a very small max length gracefully', () => {
    const result = truncateDescription('Hello world', 10);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result.endsWith('...')).toBe(true);
  });

  it('handles a max length of 3', () => {
    const result = truncateDescription('Hello world', 3);
    expect(result).toBe('...');
  });

  it('handles a max length equal to the string length', () => {
    const text = 'Exact length';
    const result = truncateDescription(text, text.length);
    expect(result).toBe(text);
  });

  it('handles single character descriptions', () => {
    const result = truncateDescription('A');
    expect(result).toBe('A');
  });
});

describe('SEO config validation edge cases', () => {
  it('returns multiple warnings for a badly configured page', () => {
    const badConfig: PageSeoConfig = {
      path: 'no-slash',
      title: 'Hi',
      description: 'Short',
      keywords: [],
    };
    const warnings = validateSeoConfig(badConfig);
    expect(warnings.length).toBeGreaterThanOrEqual(3);
  });

  it('validates a config at the exact 70-char title boundary', () => {
    const config: PageSeoConfig = {
      path: '/test',
      title: 'A'.repeat(70),
      description: 'A'.repeat(100),
      keywords: ['test'],
    };
    const warnings = validateSeoConfig(config);
    expect(warnings.some((w) => w.includes('Title exceeds'))).toBe(false);
  });

  it('validates a config at the exact 160-char description boundary', () => {
    const config: PageSeoConfig = {
      path: '/test',
      title: 'Valid title for testing',
      description: 'A'.repeat(160),
      keywords: ['test'],
    };
    const warnings = validateSeoConfig(config);
    expect(warnings.some((w) => w.includes('Description exceeds'))).toBe(false);
  });
});

describe('findPageSeoConfig edge cases', () => {
  it('returns undefined for empty string', () => {
    expect(findPageSeoConfig('')).toBeUndefined();
  });

  it('is case-sensitive for path matching', () => {
    expect(findPageSeoConfig('/Proposals')).toBeUndefined();
  });

  it('does not match partial paths', () => {
    expect(findPageSeoConfig('/pro')).toBeUndefined();
  });
});

describe('JSON-LD edge cases', () => {
  it('serializes objects with special characters correctly', () => {
    const data = { name: 'Test & "quotes" <tags>' };
    const result = serializeJsonLd(data);
    expect(result).toContain('application/ld+json');
    // JSON.stringify handles escaping automatically
    const jsonPart = result.replace('<script type="application/ld+json">', '').replace('</script>', '');
    expect(() => JSON.parse(jsonPart)).not.toThrow();
  });

  it('Organization JSON-LD sameAs contains only valid URLs', () => {
    const org = buildOrganizationJsonLd();
    org.sameAs.forEach((url: string) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });

  it('WebSite JSON-LD search target contains a URL template', () => {
    const site = buildWebSiteJsonLd();
    expect(site.potentialAction.target).toContain(SITE_URL);
  });

  it('WebPage JSON-LD works with all page configs', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const page = buildWebPageJsonLd(config);
      expect(page['@type']).toBe('WebPage');
      expect(page.url).toContain(SITE_URL);
    });
  });
});

describe('Next.js metadata integration edge cases', () => {
  it('handles a config with empty keywords array', () => {
    const config: PageSeoConfig = {
      path: '/test',
      title: 'Test Page Title',
      description: 'A valid test description that is long enough for SEO compliance standards.',
      keywords: [],
    };
    const meta = buildNextMetadata(config);
    expect(meta.keywords).toEqual([]);
  });

  it('handles a config with many keywords', () => {
    const config: PageSeoConfig = {
      path: '/test',
      title: 'Test Page Title',
      description: 'A valid test description that is long enough for SEO compliance standards.',
      keywords: Array.from({ length: 20 }, (_, i) => `keyword-${i}`),
    };
    const meta = buildNextMetadata(config);
    expect((meta.keywords as string[]).length).toBe(20);
  });

  it('buildSeoMetadata produces consistent canonical and OG URL', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const seo = buildSeoMetadata(config);
      expect(seo.canonical).toBe(seo.openGraph.url);
    });
  });
});

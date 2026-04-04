import { describe, it, expect } from 'vitest';
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildWebPageJsonLd,
  serializeJsonLd,
  buildRootJsonLdScripts,
  buildPageJsonLdScript,
  getPageStructuredData,
} from './json-ld';
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  PAGE_SEO_CONFIGS,
} from '../types/seo';
import type { PageSeoConfig } from '../types/seo';

const MOCK_PAGE: PageSeoConfig = {
  path: '/analytics',
  title: 'Analytics Dashboard - SprintFund',
  description: 'Real-time treasury analytics, voting patterns, and funding allocation metrics for SprintFund DAO.',
  keywords: ['analytics', 'treasury', 'metrics'],
  ogType: 'website',
};

describe('buildOrganizationJsonLd', () => {
  it('returns an object with @context and @type', () => {
    const org = buildOrganizationJsonLd();
    expect(org['@context']).toBe('https://schema.org');
    expect(org['@type']).toBe('Organization');
  });

  it('includes the site name and URL', () => {
    const org = buildOrganizationJsonLd();
    expect(org.name).toBe(SITE_NAME);
    expect(org.url).toBe(SITE_URL);
  });

  it('includes a logo URL', () => {
    const org = buildOrganizationJsonLd();
    expect(org.logo).toContain(SITE_URL);
  });

  it('includes a description', () => {
    const org = buildOrganizationJsonLd();
    expect(org.description).toBe(SITE_DESCRIPTION);
  });

  it('lists social profiles in sameAs', () => {
    const org = buildOrganizationJsonLd();
    expect(org.sameAs).toBeInstanceOf(Array);
    expect(org.sameAs!.length).toBeGreaterThan(0);
    org.sameAs!.forEach((url: string) => {
      expect(url.startsWith('https://')).toBe(true);
    });
  });

  it('includes the GitHub repository URL', () => {
    const org = buildOrganizationJsonLd();
    expect(org.sameAs!.some((u: string) => u.includes('github.com'))).toBe(true);
  });
});

describe('buildWebSiteJsonLd', () => {
  it('returns correct @type and @context', () => {
    const site = buildWebSiteJsonLd();
    expect(site['@context']).toBe('https://schema.org');
    expect(site['@type']).toBe('WebSite');
  });

  it('includes the site name, URL, and description', () => {
    const site = buildWebSiteJsonLd();
    expect(site.name).toBe(SITE_NAME);
    expect(site.url).toBe(SITE_URL);
    expect(site.description).toBe(SITE_DESCRIPTION);
  });

  it('includes a SearchAction potential action', () => {
    const site = buildWebSiteJsonLd();
    expect(site.potentialAction).toBeDefined();
    expect(site.potentialAction!['@type']).toBe('SearchAction');
  });

  it('has a target URL with search term placeholder', () => {
    const site = buildWebSiteJsonLd();
    expect(site.potentialAction!.target).toContain('{search_term_string}');
  });

  it('declares the search term input as required', () => {
    const site = buildWebSiteJsonLd();
    expect(site.potentialAction!['query-input']).toContain('required');
  });
});

describe('buildWebPageJsonLd', () => {
  it('returns correct @type and @context', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page['@context']).toBe('https://schema.org');
    expect(page['@type']).toBe('WebPage');
  });

  it('sets the name from the page config title', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page.name).toBe(MOCK_PAGE.title);
  });

  it('sets the description from the page config', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page.description).toBe(MOCK_PAGE.description);
  });

  it('builds the correct canonical URL', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page.url).toBe(`${SITE_URL}/analytics`);
  });

  it('references the parent WebSite', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page.isPartOf).toBeDefined();
    expect(page.isPartOf['@type']).toBe('WebSite');
    expect(page.isPartOf.name).toBe(SITE_NAME);
  });

  it('includes an about reference for the topic', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page.about).toBeDefined();
    expect(page.about!['@type']).toBe('Thing');
  });

  it('includes an image URL', () => {
    const page = buildWebPageJsonLd(MOCK_PAGE);
    expect(page.image).toContain(SITE_URL);
  });

  it('uses custom OG image path when provided', () => {
    const customPage = { ...MOCK_PAGE, ogImagePath: '/custom-og.png' };
    const page = buildWebPageJsonLd(customPage);
    expect(page.image).toContain('/custom-og.png');
  });
});

describe('serializeJsonLd', () => {
  it('wraps the object in a script tag with ld+json type', () => {
    const result = serializeJsonLd({ '@type': 'Thing', name: 'Test' });
    expect(result).toContain('<script type="application/ld+json">');
    expect(result).toContain('</script>');
  });

  it('includes the serialized JSON in the output', () => {
    const data = { '@type': 'Thing', name: 'Test' };
    const result = serializeJsonLd(data);
    expect(result).toContain('"@type":"Thing"');
    expect(result).toContain('"name":"Test"');
  });

  it('produces valid JSON within the script tag', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME };
    const result = serializeJsonLd(data);
    const jsonString = result.replace('<script type="application/ld+json">', '').replace('</script>', '');
    expect(() => JSON.parse(jsonString)).not.toThrow();
  });
});

describe('buildRootJsonLdScripts', () => {
  it('contains both Organization and WebSite script tags', () => {
    const scripts = buildRootJsonLdScripts();
    expect(scripts).toContain('"@type":"Organization"');
    expect(scripts).toContain('"@type":"WebSite"');
  });

  it('produces two separate script tags', () => {
    const scripts = buildRootJsonLdScripts();
    const matches = scripts.match(/<script type="application\/ld\+json">/g);
    expect(matches).toHaveLength(2);
  });

  it('separates script tags with a newline', () => {
    const scripts = buildRootJsonLdScripts();
    const parts = scripts.split('\n');
    expect(parts).toHaveLength(2);
  });
});

describe('buildPageJsonLdScript', () => {
  it('produces a single script tag for the page', () => {
    const script = buildPageJsonLdScript(MOCK_PAGE);
    const matches = script.match(/<script type="application\/ld\+json">/g);
    expect(matches).toHaveLength(1);
  });

  it('contains the WebPage type', () => {
    const script = buildPageJsonLdScript(MOCK_PAGE);
    expect(script).toContain('"@type":"WebPage"');
  });

  it('contains the page title', () => {
    const script = buildPageJsonLdScript(MOCK_PAGE);
    expect(script).toContain(MOCK_PAGE.title);
  });
});

describe('getPageStructuredData', () => {
  it('returns an array of three structured data objects', () => {
    const data = getPageStructuredData(MOCK_PAGE);
    expect(data).toHaveLength(3);
  });

  it('includes Organization, WebSite, and WebPage types in order', () => {
    const data = getPageStructuredData(MOCK_PAGE);
    expect(data[0]['@type']).toBe('Organization');
    expect(data[1]['@type']).toBe('WebSite');
    expect(data[2]['@type']).toBe('WebPage');
  });

  it('all objects have @context set to schema.org', () => {
    const data = getPageStructuredData(MOCK_PAGE);
    data.forEach((obj) => {
      expect(obj['@context']).toBe('https://schema.org');
    });
  });

  it('works with all registered page configs', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const data = getPageStructuredData(config);
      expect(data).toHaveLength(3);
      expect(data[2]['@type']).toBe('WebPage');
      expect(data[2]['name']).toBe(config.title);
    });
  });
});

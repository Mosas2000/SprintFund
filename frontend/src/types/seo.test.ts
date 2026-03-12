import { describe, it, expect } from 'vitest';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_LOCALE,
  SITE_THEME_COLOR,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_ALT,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
  PAGE_SEO_CONFIGS,
} from './seo';
import type {
  OpenGraphMeta,
  OpenGraphImage,
  TwitterCardMeta,
  PageSeoConfig,
  JsonLdOrganization,
  JsonLdWebSite,
  JsonLdWebPage,
  SeoMetadata,
  SitemapEntry,
} from './seo';

/**
 * Tests for SEO type definitions and constants.
 */

describe('site-wide constants', () => {
  it('SITE_NAME is a non-empty string', () => {
    expect(typeof SITE_NAME).toBe('string');
    expect(SITE_NAME.length).toBeGreaterThan(0);
  });

  it('SITE_DESCRIPTION is a non-empty string', () => {
    expect(typeof SITE_DESCRIPTION).toBe('string');
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it('SITE_URL starts with https://', () => {
    expect(SITE_URL.startsWith('https://')).toBe(true);
  });

  it('SITE_URL has no trailing slash', () => {
    expect(SITE_URL.endsWith('/')).toBe(false);
  });

  it('SITE_LOCALE follows xx_XX format', () => {
    expect(SITE_LOCALE).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
  });

  it('SITE_THEME_COLOR is a valid hex color', () => {
    expect(SITE_THEME_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});

describe('Open Graph constants', () => {
  it('OG_IMAGE_WIDTH is 1200 (recommended)', () => {
    expect(OG_IMAGE_WIDTH).toBe(1200);
  });

  it('OG_IMAGE_HEIGHT is 630 (recommended)', () => {
    expect(OG_IMAGE_HEIGHT).toBe(630);
  });

  it('OG_IMAGE_PATH starts with /', () => {
    expect(OG_IMAGE_PATH.startsWith('/')).toBe(true);
  });

  it('OG_IMAGE_PATH ends with an image extension', () => {
    expect(OG_IMAGE_PATH.match(/\.(png|svg|jpg|webp)$/)).not.toBeNull();
  });

  it('OG_IMAGE_ALT is a descriptive string', () => {
    expect(OG_IMAGE_ALT.length).toBeGreaterThan(10);
  });
});

describe('Twitter constants', () => {
  it('TWITTER_HANDLE starts with @', () => {
    expect(TWITTER_HANDLE.startsWith('@')).toBe(true);
  });

  it('TWITTER_CARD_TYPE is summary_large_image', () => {
    expect(TWITTER_CARD_TYPE).toBe('summary_large_image');
  });
});

describe('PAGE_SEO_CONFIGS', () => {
  it('has at least 6 page entries', () => {
    expect(PAGE_SEO_CONFIGS.length).toBeGreaterThanOrEqual(6);
  });

  it('every config has title, description, and path', () => {
    for (const config of PAGE_SEO_CONFIGS) {
      expect(config.title.length).toBeGreaterThan(0);
      expect(config.description.length).toBeGreaterThan(0);
      expect(config.path.startsWith('/')).toBe(true);
    }
  });

  it('every path is unique', () => {
    const paths = PAGE_SEO_CONFIGS.map((c) => c.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('home page is first entry with path /', () => {
    expect(PAGE_SEO_CONFIGS[0].path).toBe('/');
  });

  it('no title exceeds 70 characters (SEO best practice)', () => {
    for (const config of PAGE_SEO_CONFIGS) {
      expect(config.title.length).toBeLessThanOrEqual(70);
    }
  });

  it('no description exceeds 160 characters (SEO best practice)', () => {
    for (const config of PAGE_SEO_CONFIGS) {
      expect(config.description.length).toBeLessThanOrEqual(160);
    }
  });

  it('every config includes keywords array when present', () => {
    const withKeywords = PAGE_SEO_CONFIGS.filter((c) => c.keywords);
    expect(withKeywords.length).toBeGreaterThan(0);
    for (const config of withKeywords) {
      expect(Array.isArray(config.keywords)).toBe(true);
      expect(config.keywords!.length).toBeGreaterThan(0);
    }
  });
});

describe('type contracts', () => {
  it('OpenGraphMeta has required fields', () => {
    const og: OpenGraphMeta = {
      title: 'Test',
      description: 'Test description',
      url: 'https://example.com',
      type: 'website',
      siteName: 'Test Site',
      locale: 'en_US',
      images: [],
    };
    expect(og.title).toBe('Test');
    expect(og.type).toBe('website');
  });

  it('OpenGraphImage has required dimensions', () => {
    const img: OpenGraphImage = {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Test image',
    };
    expect(img.width).toBe(1200);
    expect(img.height).toBe(630);
  });

  it('TwitterCardMeta supports all card types', () => {
    const cards: TwitterCardMeta['card'][] = [
      'summary',
      'summary_large_image',
      'app',
      'player',
    ];
    expect(cards).toHaveLength(4);
  });

  it('PageSeoConfig path must start with /', () => {
    const config: PageSeoConfig = {
      title: 'Test',
      description: 'Test',
      path: '/test',
    };
    expect(config.path.startsWith('/')).toBe(true);
  });

  it('JsonLdOrganization has schema.org context', () => {
    const ld: JsonLdOrganization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SprintFund',
      url: 'https://sprintfund.org',
      logo: 'https://sprintfund.org/icon.png',
      description: 'Test',
    };
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Organization');
  });

  it('SitemapEntry has required fields', () => {
    const entry: SitemapEntry = {
      url: 'https://sprintfund.org/',
      lastModified: '2026-03-12',
      changeFrequency: 'weekly',
      priority: 1.0,
    };
    expect(entry.priority).toBeGreaterThanOrEqual(0);
    expect(entry.priority).toBeLessThanOrEqual(1);
  });

  it('SeoMetadata bundles openGraph and twitter', () => {
    const meta: SeoMetadata = {
      title: 'Test',
      description: 'Test',
      canonical: 'https://example.com',
      openGraph: {
        title: 'Test',
        description: 'Test',
        url: 'https://example.com',
        type: 'website',
        siteName: 'Test',
        locale: 'en_US',
        images: [],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@test',
        title: 'Test',
        description: 'Test',
        images: [],
      },
    };
    expect(meta.openGraph.type).toBe('website');
    expect(meta.twitter.card).toBe('summary_large_image');
  });
});

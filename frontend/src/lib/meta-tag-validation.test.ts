import { describe, it, expect } from 'vitest';
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
  PAGE_SEO_CONFIGS,
} from '../types/seo';
import { buildOpenGraphMeta, buildTwitterCardMeta } from '../lib/seo-utils';

/**
 * Meta tag validation tests ensure that generated Open Graph and
 * Twitter Card tags comply with platform requirements and content
 * policies. These tests catch issues that would result in broken
 * social preview cards or missing metadata in search results.
 */

describe('Open Graph tag compliance', () => {
  it('og:title is under 95 characters for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.title.length).toBeLessThanOrEqual(95);
    });
  });

  it('og:description is under 200 characters for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.description.length).toBeLessThanOrEqual(200);
    });
  });

  it('og:url is an absolute URL for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.url.startsWith('https://')).toBe(true);
    });
  });

  it('og:site_name is consistent across all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.siteName).toBe(SITE_NAME);
    });
  });

  it('og:locale is consistent across all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.locale).toBe(SITE_LOCALE);
    });
  });

  it('og:type is a valid Open Graph type for all pages', () => {
    const validTypes = ['website', 'article', 'profile'];
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(validTypes).toContain(og.type);
    });
  });

  it('og:image has correct dimensions for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.images).toHaveLength(1);
      expect(og.images[0].width).toBe(OG_IMAGE_WIDTH);
      expect(og.images[0].height).toBe(OG_IMAGE_HEIGHT);
    });
  });

  it('og:image URL is absolute for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.images[0].url.startsWith('https://')).toBe(true);
    });
  });

  it('og:image has non-empty alt text for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      expect(og.images[0].alt.length).toBeGreaterThan(0);
    });
  });
});

describe('Twitter Card tag compliance', () => {
  it('twitter:card is a valid card type for all pages', () => {
    const validCards = ['summary', 'summary_large_image', 'app', 'player'];
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(validCards).toContain(twitter.card);
    });
  });

  it('twitter:card uses summary_large_image consistently', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(twitter.card).toBe(TWITTER_CARD_TYPE);
    });
  });

  it('twitter:site starts with @ for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(twitter.site.startsWith('@')).toBe(true);
    });
  });

  it('twitter:title is under 70 characters for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(twitter.title.length).toBeLessThanOrEqual(70);
    });
  });

  it('twitter:description is under 200 characters for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(twitter.description.length).toBeLessThanOrEqual(200);
    });
  });

  it('twitter:image is an absolute URL for all pages', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(twitter.images.length).toBeGreaterThan(0);
      expect(twitter.images[0].startsWith('https://')).toBe(true);
    });
  });

  it('twitter:site handle matches the configured handle', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const twitter = buildTwitterCardMeta(config);
      expect(twitter.site).toBe(TWITTER_HANDLE);
    });
  });
});

describe('Cross-platform consistency', () => {
  it('OG title and Twitter title match for each page', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      const twitter = buildTwitterCardMeta(config);
      expect(og.title).toBe(twitter.title);
    });
  });

  it('OG description and Twitter description match for each page', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      const twitter = buildTwitterCardMeta(config);
      expect(og.description).toBe(twitter.description);
    });
  });

  it('OG image URL and Twitter image URL match for each page', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const og = buildOpenGraphMeta(config);
      const twitter = buildTwitterCardMeta(config);
      expect(og.images[0].url).toBe(twitter.images[0]);
    });
  });
});

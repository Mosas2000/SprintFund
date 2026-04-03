import { describe, it, expect } from 'vitest';
import { buildNextMetadata, buildRootMetadata } from './metadata-builder';
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOCALE,
  SITE_THEME_COLOR,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
  PAGE_SEO_CONFIGS,
} from '../types/seo';
import type { PageSeoConfig } from '../types/seo';

const MOCK_CONFIG: PageSeoConfig = {
  path: '/proposals',
  title: 'Governance - SprintFund',
  description: 'Browse and vote on community proposals for micro-grant funding on Stacks blockchain.',
  keywords: ['governance', 'proposals', 'voting'],
  ogType: 'website',
};

describe('buildNextMetadata', () => {
  it('sets the title from the page config', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    expect(meta.title).toBe(MOCK_CONFIG.title);
  });

  it('sets the description from the page config', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    expect(meta.description).toBe(MOCK_CONFIG.description);
  });

  it('sets keywords from the page config', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    expect(meta.keywords).toEqual(MOCK_CONFIG.keywords);
  });

  it('sets metadataBase to the site URL', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    expect(meta.metadataBase?.toString()).toBe(`${SITE_URL}/`);
  });

  it('sets the canonical alternate URL', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    const alternates = meta.alternates as Record<string, unknown>;
    expect(alternates.canonical).toBe(`${SITE_URL}/proposals`);
  });

  it('includes Open Graph metadata', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og).toBeDefined();
    expect(og.title).toBe(MOCK_CONFIG.title);
    expect(og.description).toBe(MOCK_CONFIG.description);
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.locale).toBe(SITE_LOCALE);
  });

  it('includes Open Graph images with correct dimensions', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    const og = meta.openGraph as Record<string, unknown>;
    const images = og.images as Array<Record<string, unknown>>;
    expect(images).toHaveLength(1);
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
  });

  it('includes Twitter Card metadata', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    const twitter = meta.twitter as Record<string, unknown>;
    expect(twitter).toBeDefined();
    expect(twitter.card).toBe(TWITTER_CARD_TYPE);
    expect(twitter.site).toBe(TWITTER_HANDLE);
    expect(twitter.title).toBe(MOCK_CONFIG.title);
  });

  it('sets robots to index and follow by default', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    const robots = meta.robots as Record<string, boolean>;
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
  });

  it('sets robots to noindex/nofollow when noIndex is true', () => {
    const noIndexConfig = { ...MOCK_CONFIG, noIndex: true };
    const meta = buildNextMetadata(noIndexConfig);
    const robots = meta.robots as Record<string, boolean>;
    expect(robots.index).toBe(false);
    expect(robots.follow).toBe(false);
  });

  it('sets the theme color', () => {
    const meta = buildNextMetadata(MOCK_CONFIG);
    expect(meta.themeColor).toBe(SITE_THEME_COLOR);
  });

  it('works correctly for all registered page configs', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const meta = buildNextMetadata(config);
      expect(meta.title).toBe(config.title);
      expect(meta.description).toBe(config.description);
      expect(meta.openGraph).toBeDefined();
      expect(meta.twitter).toBeDefined();
    });
  });
});

describe('buildRootMetadata', () => {
  it('includes a title template with site name', () => {
    const meta = buildRootMetadata();
    const title = meta.title as Record<string, string>;
    expect(title.template).toContain(SITE_NAME);
    expect(title.template).toContain('%s');
  });

  it('includes a default title', () => {
    const meta = buildRootMetadata();
    const title = meta.title as Record<string, string>;
    expect(title.default).toContain(SITE_NAME);
  });

  it('sets metadataBase for relative URL resolution', () => {
    const meta = buildRootMetadata();
    expect(meta.metadataBase?.toString()).toBe(`${SITE_URL}/`);
  });

  it('includes the application name', () => {
    const meta = buildRootMetadata();
    expect(meta.applicationName).toBe(SITE_NAME);
  });

  it('includes author information', () => {
    const meta = buildRootMetadata();
    const authors = meta.authors as Array<Record<string, string>>;
    expect(authors).toBeDefined();
    expect(authors[0].name).toBe(SITE_NAME);
  });

  it('sets the manifest path', () => {
    const meta = buildRootMetadata();
    expect(meta.manifest).toBe('/manifest.json');
  });

  it('includes Open Graph metadata with site-level defaults', () => {
    const meta = buildRootMetadata();
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.locale).toBe(SITE_LOCALE);
    expect(og.type).toBe('website');
  });

  it('includes Twitter Card metadata', () => {
    const meta = buildRootMetadata();
    const twitter = meta.twitter as Record<string, unknown>;
    expect(twitter.card).toBe(TWITTER_CARD_TYPE);
    expect(twitter.site).toBe(TWITTER_HANDLE);
  });

  it('configures GoogleBot directives', () => {
    const meta = buildRootMetadata();
    const robots = meta.robots as Record<string, unknown>;
    const googleBot = robots.googleBot as Record<string, unknown>;
    expect(googleBot).toBeDefined();
    expect(googleBot.index).toBe(true);
    expect(googleBot['max-image-preview']).toBe('large');
  });

  it('sets icon references', () => {
    const meta = buildRootMetadata();
    const icons = meta.icons as Record<string, string>;
    expect(icons.icon).toBe('/favicon.svg');
    expect(icons.apple).toBe('/favicon.svg');
  });

  it('sets the theme color', () => {
    const meta = buildRootMetadata();
    expect(meta.themeColor).toBe(SITE_THEME_COLOR);
  });

  it('sets the canonical URL in alternates', () => {
    const meta = buildRootMetadata();
    const alternates = meta.alternates as Record<string, string>;
    expect(alternates.canonical).toBe(SITE_URL);
  });

  it('includes a category field', () => {
    const meta = buildRootMetadata();
    expect(meta.category).toBe('technology');
  });

  it('includes a description', () => {
    const meta = buildRootMetadata();
    expect(meta.description).toBeDefined();
    expect(typeof meta.description).toBe('string');
    expect((meta.description as string).length).toBeGreaterThan(50);
  });

  it('includes keywords array', () => {
    const meta = buildRootMetadata();
    expect(meta.keywords).toBeInstanceOf(Array);
    const keywords = meta.keywords as string[];
    expect(keywords.length).toBeGreaterThan(3);
    expect(keywords).toContain('SprintFund');
  });
});

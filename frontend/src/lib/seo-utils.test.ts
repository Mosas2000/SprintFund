import { describe, it, expect } from 'vitest';
import {
  buildCanonicalUrl,
  buildOgImageUrl,
  buildOpenGraphMeta,
  buildTwitterCardMeta,
  buildSeoMetadata,
  findPageSeoConfig,
  formatPageTitle,
  truncateDescription,
  generateSitemapEntries,
  validateSeoConfig,
} from './seo-utils';
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_ALT,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
  PAGE_SEO_CONFIGS,
} from '../types/seo';
import type { PageSeoConfig } from '../types/seo';

const MOCK_CONFIG: PageSeoConfig = {
  path: '/proposals',
  title: 'Governance Proposals',
  description: 'Browse and vote on community proposals for micro-grant funding.',
  keywords: ['proposals', 'voting', 'governance'],
  ogType: 'website',
};

describe('buildCanonicalUrl', () => {
  it('returns the base URL for root path', () => {
    expect(buildCanonicalUrl('/')).toBe(SITE_URL);
  });

  it('appends the path to the base URL', () => {
    expect(buildCanonicalUrl('/proposals')).toBe(`${SITE_URL}/proposals`);
  });

  it('strips trailing slashes from paths', () => {
    expect(buildCanonicalUrl('/analytics/')).toBe(`${SITE_URL}/analytics`);
  });

  it('handles double trailing slashes', () => {
    expect(buildCanonicalUrl('/community//')).toBe(`${SITE_URL}/community`);
  });

  it('preserves nested paths correctly', () => {
    expect(buildCanonicalUrl('/proposals/123')).toBe(`${SITE_URL}/proposals/123`);
  });
});

describe('buildOgImageUrl', () => {
  it('returns the default OG image URL when no path provided', () => {
    expect(buildOgImageUrl()).toBe(`${SITE_URL}${OG_IMAGE_PATH}`);
  });

  it('builds an absolute URL from a relative path', () => {
    expect(buildOgImageUrl('/custom-og.png')).toBe(`${SITE_URL}/custom-og.png`);
  });

  it('returns absolute URLs as-is', () => {
    const externalUrl = 'https://cdn.example.com/image.png';
    expect(buildOgImageUrl(externalUrl)).toBe(externalUrl);
  });

  it('handles http URLs as-is', () => {
    const httpUrl = 'http://cdn.example.com/image.png';
    expect(buildOgImageUrl(httpUrl)).toBe(httpUrl);
  });
});

describe('buildOpenGraphMeta', () => {
  it('returns correct title and description', () => {
    const og = buildOpenGraphMeta(MOCK_CONFIG);
    expect(og.title).toBe(MOCK_CONFIG.title);
    expect(og.description).toBe(MOCK_CONFIG.description);
  });

  it('sets the correct site name and locale', () => {
    const og = buildOpenGraphMeta(MOCK_CONFIG);
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.locale).toBe(SITE_LOCALE);
  });

  it('constructs the canonical URL for the page', () => {
    const og = buildOpenGraphMeta(MOCK_CONFIG);
    expect(og.url).toBe(`${SITE_URL}/proposals`);
  });

  it('sets the OG type from config', () => {
    const og = buildOpenGraphMeta(MOCK_CONFIG);
    expect(og.type).toBe('website');
  });

  it('defaults OG type to website when not specified', () => {
    const configWithoutType = { ...MOCK_CONFIG, ogType: undefined };
    const og = buildOpenGraphMeta(configWithoutType);
    expect(og.type).toBe('website');
  });

  it('includes the default OG image with correct dimensions', () => {
    const og = buildOpenGraphMeta(MOCK_CONFIG);
    expect(og.images).toHaveLength(1);
    expect(og.images[0].width).toBe(OG_IMAGE_WIDTH);
    expect(og.images[0].height).toBe(OG_IMAGE_HEIGHT);
    expect(og.images[0].alt).toBe(OG_IMAGE_ALT);
  });

  it('uses custom OG image path when provided', () => {
    const configWithImage = { ...MOCK_CONFIG, ogImagePath: '/custom.png' };
    const og = buildOpenGraphMeta(configWithImage);
    expect(og.images[0].url).toBe(`${SITE_URL}/custom.png`);
  });
});

describe('buildTwitterCardMeta', () => {
  it('sets the correct card type', () => {
    const twitter = buildTwitterCardMeta(MOCK_CONFIG);
    expect(twitter.card).toBe(TWITTER_CARD_TYPE);
  });

  it('includes the Twitter handle', () => {
    const twitter = buildTwitterCardMeta(MOCK_CONFIG);
    expect(twitter.site).toBe(TWITTER_HANDLE);
  });

  it('includes title and description from config', () => {
    const twitter = buildTwitterCardMeta(MOCK_CONFIG);
    expect(twitter.title).toBe(MOCK_CONFIG.title);
    expect(twitter.description).toBe(MOCK_CONFIG.description);
  });

  it('includes the OG image in the images array', () => {
    const twitter = buildTwitterCardMeta(MOCK_CONFIG);
    expect(twitter.images).toHaveLength(1);
    expect(twitter.images[0]).toContain(SITE_URL);
  });
});

describe('buildSeoMetadata', () => {
  it('returns a complete metadata bundle', () => {
    const seo = buildSeoMetadata(MOCK_CONFIG);
    expect(seo.title).toBe(MOCK_CONFIG.title);
    expect(seo.description).toBe(MOCK_CONFIG.description);
    expect(seo.canonical).toBe(`${SITE_URL}/proposals`);
    expect(seo.openGraph).toBeDefined();
    expect(seo.twitter).toBeDefined();
    expect(seo.keywords).toEqual(MOCK_CONFIG.keywords);
  });

  it('sets robots to index, follow by default', () => {
    const seo = buildSeoMetadata(MOCK_CONFIG);
    expect(seo.robots).toBe('index, follow');
  });

  it('sets robots to noindex, nofollow when noIndex is true', () => {
    const noIndexConfig = { ...MOCK_CONFIG, noIndex: true };
    const seo = buildSeoMetadata(noIndexConfig);
    expect(seo.robots).toBe('noindex, nofollow');
  });
});

describe('findPageSeoConfig', () => {
  it('finds the home page config for root path', () => {
    const config = findPageSeoConfig('/');
    expect(config).toBeDefined();
    expect(config?.path).toBe('/');
  });

  it('finds the proposals page config', () => {
    const config = findPageSeoConfig('/proposals');
    expect(config).toBeDefined();
    expect(config?.path).toBe('/proposals');
  });

  it('returns undefined for unregistered paths', () => {
    expect(findPageSeoConfig('/nonexistent')).toBeUndefined();
  });

  it('normalises trailing slashes before lookup', () => {
    const config = findPageSeoConfig('/analytics/');
    expect(config).toBeDefined();
    expect(config?.path).toBe('/analytics');
  });
});

describe('formatPageTitle', () => {
  it('appends the site name to plain titles', () => {
    expect(formatPageTitle('Governance Proposals')).toBe(`Governance Proposals | ${SITE_NAME}`);
  });

  it('returns the title unchanged when it already includes the site name', () => {
    const title = `SprintFund - Fund Ideas`;
    expect(formatPageTitle(title)).toBe(title);
  });

  it('handles empty strings', () => {
    expect(formatPageTitle('')).toBe(` | ${SITE_NAME}`);
  });
});

describe('truncateDescription', () => {
  it('returns short descriptions unchanged', () => {
    const short = 'A short description.';
    expect(truncateDescription(short)).toBe(short);
  });

  it('truncates descriptions longer than 155 characters', () => {
    const long = 'A'.repeat(200);
    const result = truncateDescription(long);
    expect(result.length).toBeLessThanOrEqual(155);
    expect(result.endsWith('...')).toBe(true);
  });

  it('uses a custom max length when provided', () => {
    const text = 'A'.repeat(100);
    const result = truncateDescription(text, 50);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result.endsWith('...')).toBe(true);
  });

  it('returns exactly max length content when string is at boundary', () => {
    const exact = 'A'.repeat(155);
    expect(truncateDescription(exact)).toBe(exact);
  });
});

describe('generateSitemapEntries', () => {
  it('generates entries for all non-noIndex pages', () => {
    const entries = generateSitemapEntries();
    const nonIndexed = PAGE_SEO_CONFIGS.filter((c) => !c.noIndex);
    expect(entries).toHaveLength(nonIndexed.length);
  });

  it('sets the home page priority to 1.0', () => {
    const entries = generateSitemapEntries();
    const home = entries.find((e) => e.url === SITE_URL);
    expect(home?.priority).toBe(1.0);
  });

  it('sets non-home page priorities to 0.8', () => {
    const entries = generateSitemapEntries();
    const nonHome = entries.filter((e) => e.url !== SITE_URL);
    nonHome.forEach((entry) => {
      expect(entry.priority).toBe(0.8);
    });
  });

  it('sets home page change frequency to daily', () => {
    const entries = generateSitemapEntries();
    const home = entries.find((e) => e.url === SITE_URL);
    expect(home?.changeFrequency).toBe('daily');
  });

  it('sets non-home page change frequency to weekly', () => {
    const entries = generateSitemapEntries();
    const nonHome = entries.filter((e) => e.url !== SITE_URL);
    nonHome.forEach((entry) => {
      expect(entry.changeFrequency).toBe('weekly');
    });
  });

  it('includes lastModified dates in YYYY-MM-DD format', () => {
    const entries = generateSitemapEntries();
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    entries.forEach((entry) => {
      expect(entry.lastModified).toMatch(dateRegex);
    });
  });

  it('generates absolute URLs for all entries', () => {
    const entries = generateSitemapEntries();
    entries.forEach((entry) => {
      expect(entry.url.startsWith('https://')).toBe(true);
    });
  });
});

describe('validateSeoConfig', () => {
  it('returns no warnings for a valid config', () => {
    const warnings = validateSeoConfig(MOCK_CONFIG);
    expect(warnings).toHaveLength(0);
  });

  it('warns when title exceeds 70 characters', () => {
    const longTitle = { ...MOCK_CONFIG, title: 'A'.repeat(71) };
    const warnings = validateSeoConfig(longTitle);
    expect(warnings.some((w) => w.includes('Title exceeds 70'))).toBe(true);
  });

  it('warns when title is too short', () => {
    const shortTitle = { ...MOCK_CONFIG, title: 'Hi' };
    const warnings = validateSeoConfig(shortTitle);
    expect(warnings.some((w) => w.includes('too short'))).toBe(true);
  });

  it('warns when description exceeds 160 characters', () => {
    const longDesc = { ...MOCK_CONFIG, description: 'A'.repeat(161) };
    const warnings = validateSeoConfig(longDesc);
    expect(warnings.some((w) => w.includes('Description exceeds 160'))).toBe(true);
  });

  it('warns when description is too short', () => {
    const shortDesc = { ...MOCK_CONFIG, description: 'Short.' };
    const warnings = validateSeoConfig(shortDesc);
    expect(warnings.some((w) => w.includes('too short'))).toBe(true);
  });

  it('warns when path does not start with /', () => {
    const badPath = { ...MOCK_CONFIG, path: 'proposals' };
    const warnings = validateSeoConfig(badPath);
    expect(warnings.some((w) => w.includes('Path must start with /'))).toBe(true);
  });

  it('validates all registered page configs without warnings', () => {
    PAGE_SEO_CONFIGS.forEach((config) => {
      const warnings = validateSeoConfig(config);
      expect(warnings).toHaveLength(0);
    });
  });
});

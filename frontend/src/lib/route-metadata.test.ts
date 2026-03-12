import { describe, it, expect } from 'vitest';
import { findPageSeoConfig } from '../lib/seo-utils';
import { buildNextMetadata } from '../lib/metadata-builder';
import { SITE_URL, SITE_NAME, PAGE_SEO_CONFIGS } from '../types/seo';

/**
 * These tests validate the per-route metadata generation pipeline.
 * Each application route has a layout.tsx that calls findPageSeoConfig
 * and buildNextMetadata. These tests exercise the same pipeline for
 * every registered page to catch misconfigurations early.
 */

const ROUTE_PATHS = ['/', '/proposals', '/analytics', '/community', '/profile', '/api-docs'];

describe('Per-route metadata pipeline', () => {
  it('has a SEO config registered for every application route', () => {
    ROUTE_PATHS.forEach((path) => {
      const config = findPageSeoConfig(path);
      expect(config).toBeDefined();
    });
  });

  it('produces valid Next.js metadata for every route', () => {
    ROUTE_PATHS.forEach((path) => {
      const config = findPageSeoConfig(path);
      if (!config) return;
      const meta = buildNextMetadata(config);
      expect(meta.title).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.openGraph).toBeDefined();
      expect(meta.twitter).toBeDefined();
    });
  });

  it('generates unique titles for each route', () => {
    const titles = ROUTE_PATHS.map((path) => {
      const config = findPageSeoConfig(path);
      return config?.title;
    });
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('generates unique descriptions for each route', () => {
    const descriptions = ROUTE_PATHS.map((path) => {
      const config = findPageSeoConfig(path);
      return config?.description;
    });
    const uniqueDescriptions = new Set(descriptions);
    expect(uniqueDescriptions.size).toBe(descriptions.length);
  });

  it('generates unique canonical URLs for each route', () => {
    const canonicals = ROUTE_PATHS.map((path) => {
      const config = findPageSeoConfig(path);
      if (!config) return '';
      const meta = buildNextMetadata(config);
      const alternates = meta.alternates as Record<string, string>;
      return alternates.canonical;
    });
    const uniqueCanonicals = new Set(canonicals);
    expect(uniqueCanonicals.size).toBe(canonicals.length);
  });
});

describe('Home page metadata', () => {
  const config = findPageSeoConfig('/');
  const meta = config ? buildNextMetadata(config) : null;

  it('has a title that includes the site name', () => {
    expect(config?.title).toContain(SITE_NAME);
  });

  it('has a description mentioning micro-grants', () => {
    expect(config?.description.toLowerCase()).toContain('micro-grant');
  });

  it('sets the canonical to the site root', () => {
    if (!meta) return;
    const alternates = meta.alternates as Record<string, string>;
    expect(alternates.canonical).toBe(SITE_URL);
  });

  it('uses website as the OG type', () => {
    expect(config?.ogType).toBe('website');
  });
});

describe('Proposals page metadata', () => {
  const config = findPageSeoConfig('/proposals');
  const meta = config ? buildNextMetadata(config) : null;

  it('has a config registered for /proposals', () => {
    expect(config).toBeDefined();
  });

  it('includes governance-related keywords', () => {
    expect(config?.keywords?.some((k) => k.toLowerCase().includes('governance'))).toBe(true);
  });

  it('sets the canonical URL correctly', () => {
    if (!meta) return;
    const alternates = meta.alternates as Record<string, string>;
    expect(alternates.canonical).toBe(`${SITE_URL}/proposals`);
  });
});

describe('Analytics page metadata', () => {
  const config = findPageSeoConfig('/analytics');

  it('has a config registered for /analytics', () => {
    expect(config).toBeDefined();
  });

  it('includes analytics-related keywords', () => {
    expect(config?.keywords?.some((k) => k.toLowerCase().includes('analytics') || k.toLowerCase().includes('treasury'))).toBe(true);
  });

  it('has a description about data and metrics', () => {
    const desc = config?.description.toLowerCase() || '';
    expect(desc.includes('analytics') || desc.includes('metrics') || desc.includes('treasury')).toBe(true);
  });
});

describe('Community page metadata', () => {
  const config = findPageSeoConfig('/community');

  it('has a config registered for /community', () => {
    expect(config).toBeDefined();
  });

  it('includes community-related keywords', () => {
    expect(config?.keywords?.some((k) =>
      k.toLowerCase().includes('community') ||
      k.toLowerCase().includes('delegate') ||
      k.toLowerCase().includes('reputation')
    )).toBe(true);
  });
});

describe('Profile page metadata', () => {
  const config = findPageSeoConfig('/profile');

  it('has a config registered for /profile', () => {
    expect(config).toBeDefined();
  });

  it('includes profile-related keywords', () => {
    expect(config?.keywords?.some((k) =>
      k.toLowerCase().includes('profile') ||
      k.toLowerCase().includes('voting') ||
      k.toLowerCase().includes('staking')
    )).toBe(true);
  });
});

describe('API docs page metadata', () => {
  const config = findPageSeoConfig('/api-docs');
  const meta = config ? buildNextMetadata(config) : null;

  it('has a config registered for /api-docs', () => {
    expect(config).toBeDefined();
  });

  it('includes API-related keywords', () => {
    expect(config?.keywords?.some((k) =>
      k.toLowerCase().includes('api') ||
      k.toLowerCase().includes('rest') ||
      k.toLowerCase().includes('developer')
    )).toBe(true);
  });

  it('sets the canonical URL correctly', () => {
    if (!meta) return;
    const alternates = meta.alternates as Record<string, string>;
    expect(alternates.canonical).toBe(`${SITE_URL}/api-docs`);
  });
});

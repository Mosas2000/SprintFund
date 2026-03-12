import { describe, it, expect } from 'vitest';
import {
  getDocumentTitle,
  getClientMetaTags,
  getDefaultLinkTags,
  getSiteDescription,
} from './client-seo';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '../types/seo';

describe('getDocumentTitle', () => {
  it('returns the site default title when no page title given', () => {
    const title = getDocumentTitle();
    expect(title).toContain(SITE_NAME);
    expect(title).toContain('Fund Ideas');
  });

  it('formats a page title with the site name suffix', () => {
    const title = getDocumentTitle('My Proposal');
    expect(title).toBe(`My Proposal | ${SITE_NAME}`);
  });

  it('returns the title unchanged when it already includes the site name', () => {
    const title = getDocumentTitle(`${SITE_NAME} Dashboard`);
    expect(title).toBe(`${SITE_NAME} Dashboard`);
  });

  it('handles undefined input', () => {
    const title = getDocumentTitle(undefined);
    expect(title).toContain(SITE_NAME);
  });

  it('handles empty string input', () => {
    const title = getDocumentTitle('');
    expect(title).toContain(SITE_NAME);
  });
});

describe('getClientMetaTags', () => {
  it('includes og:title from the provided title', () => {
    const tags = getClientMetaTags({ title: 'Test Page' });
    expect(tags['og:title']).toBe('Test Page');
  });

  it('includes og:site_name', () => {
    const tags = getClientMetaTags({ title: 'Test' });
    expect(tags['og:site_name']).toBe(SITE_NAME);
  });

  it('includes twitter:title from the provided title', () => {
    const tags = getClientMetaTags({ title: 'Test Page' });
    expect(tags['twitter:title']).toBe('Test Page');
  });

  it('includes twitter:card type', () => {
    const tags = getClientMetaTags({ title: 'Test' });
    expect(tags['twitter:card']).toBe('summary_large_image');
  });

  it('includes description tags when description is provided', () => {
    const tags = getClientMetaTags({
      title: 'Test',
      description: 'A test description',
    });
    expect(tags['og:description']).toBe('A test description');
    expect(tags['twitter:description']).toBe('A test description');
    expect(tags['description']).toBe('A test description');
  });

  it('omits description tags when description is not provided', () => {
    const tags = getClientMetaTags({ title: 'Test' });
    expect(tags['og:description']).toBeUndefined();
    expect(tags['twitter:description']).toBeUndefined();
    expect(tags['description']).toBeUndefined();
  });

  it('includes og:url when path is provided', () => {
    const tags = getClientMetaTags({ title: 'Test', path: '/proposals' });
    expect(tags['og:url']).toBe(`${SITE_URL}/proposals`);
  });

  it('omits og:url when path is not provided', () => {
    const tags = getClientMetaTags({ title: 'Test' });
    expect(tags['og:url']).toBeUndefined();
  });

  it('sets og:type to website', () => {
    const tags = getClientMetaTags({ title: 'Test' });
    expect(tags['og:type']).toBe('website');
  });
});

describe('getDefaultLinkTags', () => {
  it('returns an array of link tag objects', () => {
    const links = getDefaultLinkTags();
    expect(links).toBeInstanceOf(Array);
    expect(links.length).toBeGreaterThan(0);
  });

  it('includes a canonical link', () => {
    const links = getDefaultLinkTags();
    const canonical = links.find((l) => l.rel === 'canonical');
    expect(canonical).toBeDefined();
    expect(canonical?.href).toBe(SITE_URL);
  });

  it('includes an icon link', () => {
    const links = getDefaultLinkTags();
    const icon = links.find((l) => l.rel === 'icon');
    expect(icon).toBeDefined();
    expect(icon?.href).toBe('/favicon.svg');
  });

  it('includes an apple-touch-icon link', () => {
    const links = getDefaultLinkTags();
    const apple = links.find((l) => l.rel === 'apple-touch-icon');
    expect(apple).toBeDefined();
  });

  it('includes a manifest link', () => {
    const links = getDefaultLinkTags();
    const manifest = links.find((l) => l.rel === 'manifest');
    expect(manifest).toBeDefined();
    expect(manifest?.href).toBe('/manifest.json');
  });

  it('all links have non-empty href values', () => {
    const links = getDefaultLinkTags();
    links.forEach((link) => {
      expect(link.href.length).toBeGreaterThan(0);
    });
  });
});

describe('getSiteDescription', () => {
  it('returns the centralized site description', () => {
    expect(getSiteDescription()).toBe(SITE_DESCRIPTION);
  });

  it('returns a non-empty string', () => {
    expect(getSiteDescription().length).toBeGreaterThan(0);
  });

  it('mentions micro-grants', () => {
    expect(getSiteDescription().toLowerCase()).toContain('micro-grant');
  });
});

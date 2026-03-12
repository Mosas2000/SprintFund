import type {
  JsonLdOrganization,
  JsonLdWebSite,
  JsonLdWebPage,
  PageSeoConfig,
} from '../types/seo';
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  OG_IMAGE_PATH,
} from '../types/seo';
import { buildCanonicalUrl, buildOgImageUrl } from './seo-utils';

/**
 * Builds the JSON-LD Organization structured data for SprintFund.
 * Used once in the root layout to identify the site operator.
 */
export function buildOrganizationJsonLd(): JsonLdOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: buildOgImageUrl('/favicon.svg'),
    description: SITE_DESCRIPTION,
    sameAs: [
      'https://twitter.com/sprintfund',
      'https://github.com/Mosas2000/SprintFund',
    ],
  };
}

/**
 * Builds the JSON-LD WebSite structured data with site-level search action.
 * This enables the site name and search box in Google results.
 */
export function buildWebSiteJsonLd(): JsonLdWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/proposals?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Builds the JSON-LD WebPage structured data for a specific page.
 * Each page should include its own WebPage structured data.
 */
export function buildWebPageJsonLd(config: PageSeoConfig): JsonLdWebPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.title,
    description: config.description,
    url: buildCanonicalUrl(config.path),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'Thing',
      name: 'Decentralized Governance',
      description: 'Community-driven micro-grant funding on Stacks blockchain',
    },
    image: buildOgImageUrl(config.ogImagePath),
  };
}

/**
 * Serializes a JSON-LD object into a script tag string suitable for
 * injection into HTML. The output is a complete <script> element.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  const json = JSON.stringify(data, null, 0);
  return `<script type="application/ld+json">${json}</script>`;
}

/**
 * Builds the combined JSON-LD script tags for the root layout.
 * Includes both Organization and WebSite schemas.
 */
export function buildRootJsonLdScripts(): string {
  const org = buildOrganizationJsonLd();
  const site = buildWebSiteJsonLd();
  return [serializeJsonLd(org), serializeJsonLd(site)].join('\n');
}

/**
 * Builds the JSON-LD script tag for an individual page.
 */
export function buildPageJsonLdScript(config: PageSeoConfig): string {
  const page = buildWebPageJsonLd(config);
  return serializeJsonLd(page);
}

/**
 * Generates the complete JSON-LD data array for a given page config.
 * This returns the raw objects, useful for Next.js metadata API
 * which accepts structured data as objects rather than script strings.
 */
export function getPageStructuredData(config: PageSeoConfig): Record<string, unknown>[] {
  return [
    buildOrganizationJsonLd() as unknown as Record<string, unknown>,
    buildWebSiteJsonLd() as unknown as Record<string, unknown>,
    buildWebPageJsonLd(config) as unknown as Record<string, unknown>,
  ];
}

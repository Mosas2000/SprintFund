import type {
  PageSeoConfig,
  OpenGraphMeta,
  TwitterCardMeta,
  SeoMetadata,
  SitemapEntry,
} from '../types/seo';
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOCALE,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_ALT,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
  PAGE_SEO_CONFIGS,
} from '../types/seo';

/**
 * Builds the canonical URL for a given path.
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Builds the absolute URL for an OG image path.
 */
export function buildOgImageUrl(imagePath?: string): string {
  const path = imagePath || OG_IMAGE_PATH;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path}`;
}

/**
 * Constructs Open Graph metadata from a page SEO config.
 */
export function buildOpenGraphMeta(config: PageSeoConfig): OpenGraphMeta {
  return {
    title: config.title,
    description: config.description,
    url: buildCanonicalUrl(config.path),
    type: config.ogType || 'website',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [
      {
        url: buildOgImageUrl(config.ogImagePath),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
      },
    ],
  };
}

/**
 * Constructs Twitter Card metadata from a page SEO config.
 */
export function buildTwitterCardMeta(config: PageSeoConfig): TwitterCardMeta {
  return {
    card: TWITTER_CARD_TYPE,
    site: TWITTER_HANDLE,
    title: config.title,
    description: config.description,
    images: [buildOgImageUrl(config.ogImagePath)],
  };
}

/**
 * Builds the complete SEO metadata bundle for a page.
 */
export function buildSeoMetadata(config: PageSeoConfig): SeoMetadata {
  return {
    title: config.title,
    description: config.description,
    canonical: buildCanonicalUrl(config.path),
    openGraph: buildOpenGraphMeta(config),
    twitter: buildTwitterCardMeta(config),
    keywords: config.keywords,
    robots: config.noIndex ? 'noindex, nofollow' : 'index, follow',
  };
}

/**
 * Looks up the SEO config for a given path from the page registry.
 * Returns undefined if the path has no dedicated config.
 */
export function findPageSeoConfig(path: string): PageSeoConfig | undefined {
  const normalised = path === '/' ? '/' : path.replace(/\/+$/, '');
  return PAGE_SEO_CONFIGS.find((c) => c.path === normalised);
}

/**
 * Generates a formatted page title with site name suffix.
 * If the title already contains the site name, returns it as-is.
 */
export function formatPageTitle(title: string): string {
  if (title.includes(SITE_NAME)) return title;
  return `${title} | ${SITE_NAME}`;
}

/**
 * Truncates a description to the SEO-recommended maximum length.
 * Adds ellipsis if truncated.
 */
export function truncateDescription(description: string, maxLength = 155): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength - 3).trimEnd() + '...';
}

/**
 * Generates sitemap entries from the page registry.
 */
export function generateSitemapEntries(): SitemapEntry[] {
  const now = new Date().toISOString().split('T')[0];
  return PAGE_SEO_CONFIGS.filter((c) => !c.noIndex).map((config) => ({
    url: buildCanonicalUrl(config.path),
    lastModified: now,
    changeFrequency: config.path === '/' ? 'daily' as const : 'weekly' as const,
    priority: config.path === '/' ? 1.0 : 0.8,
  }));
}

/**
 * Validates a PageSeoConfig for common SEO issues.
 * Returns an array of warning messages (empty = valid).
 */
export function validateSeoConfig(config: PageSeoConfig): string[] {
  const warnings: string[] = [];

  if (config.title.length > 70) {
    warnings.push(`Title exceeds 70 characters (${config.title.length})`);
  }
  if (config.title.length < 10) {
    warnings.push(`Title is too short (${config.title.length} characters)`);
  }
  if (config.description.length > 160) {
    warnings.push(`Description exceeds 160 characters (${config.description.length})`);
  }
  if (config.description.length < 50) {
    warnings.push(`Description is too short (${config.description.length} characters)`);
  }
  if (!config.path.startsWith('/')) {
    warnings.push('Path must start with /');
  }

  return warnings;
}

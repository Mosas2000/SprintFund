import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
} from '../types/seo';
import { buildCanonicalUrl, formatPageTitle } from './seo-utils';

/**
 * Generates a document head title for client components.
 *
 * Since client components in Next.js App Router cannot export
 * metadata, this function provides a fallback for components
 * that need to set document.title programmatically via useEffect.
 *
 * In most cases, the route layout.tsx handles metadata via the
 * server-side Metadata export. This is only needed for dynamic
 * titles that change based on client-side state.
 */
export function getDocumentTitle(pageTitle?: string): string {
  if (!pageTitle) return `${SITE_NAME} - Fund Ideas in 24 Hours`;
  return formatPageTitle(pageTitle);
}

/**
 * Builds the set of meta tag key-value pairs a client component
 * would need to update programmatically when the server-rendered
 * metadata is insufficient (e.g., dynamic proposal detail pages).
 */
export function getClientMetaTags(options: {
  title: string;
  description?: string;
  path?: string;
}): Record<string, string> {
  const tags: Record<string, string> = {
    'og:title': options.title,
    'og:site_name': SITE_NAME,
    'og:type': 'website',
    'twitter:title': options.title,
    'twitter:card': 'summary_large_image',
  };

  if (options.description) {
    tags['og:description'] = options.description;
    tags['twitter:description'] = options.description;
    tags['description'] = options.description;
  }

  if (options.path) {
    tags['og:url'] = buildCanonicalUrl(options.path);
  }

  return tags;
}

/**
 * Returns the set of default link elements for SEO.
 * Used in components that need to render link tags manually.
 */
export function getDefaultLinkTags(): Array<{ rel: string; href: string }> {
  return [
    { rel: 'canonical', href: SITE_URL },
    { rel: 'icon', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/favicon.svg' },
    { rel: 'manifest', href: '/manifest.json' },
  ];
}

/**
 * Generates a brief site description for use in components
 * that display site information, ensuring consistency with
 * the SEO description.
 */
export function getSiteDescription(): string {
  return SITE_DESCRIPTION;
}

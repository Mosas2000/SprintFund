import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/types/seo';

/**
 * Next.js App Router robots.txt generation.
 *
 * This file is automatically served at /robots.txt by the framework.
 * It instructs search engine crawlers on which paths to index and
 * provides the sitemap URL for discovery.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/profile/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

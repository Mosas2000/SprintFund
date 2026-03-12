import type { MetadataRoute } from 'next';
import { generateSitemapEntries } from '@/lib/seo-utils';

/**
 * Next.js App Router sitemap.xml generation.
 *
 * This file is automatically served at /sitemap.xml by the framework.
 * It generates a sitemap from the centralized page SEO registry,
 * ensuring that all public-facing routes are discoverable by search
 * engines with correct priorities and change frequencies.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = generateSitemapEntries();

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}

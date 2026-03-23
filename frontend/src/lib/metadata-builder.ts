import type { Metadata } from 'next';
import type { PageSeoConfig } from '../types/seo';
import {
  SITE_NAME,
  SITE_URL,
  SITE_LOCALE,
  SITE_THEME_COLOR,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
} from '../types/seo';
import { buildCanonicalUrl, buildOgImageUrl } from './seo-utils';

/**
 * Converts a PageSeoConfig into a Next.js Metadata object.
 *
 * This is the primary integration point between the internal SEO
 * type system and the Next.js App Router metadata API. Each route
 * layout calls this function with its page config to produce the
 * metadata export.
 */
export function buildNextMetadata(config: PageSeoConfig): Metadata {
  const canonical = buildCanonicalUrl(config.path);
  const ogImageUrl = buildOgImageUrl(config.ogImagePath);

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: (config.ogType as 'website' | 'article') || 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${config.title}`,
        },
      ],
    },
    twitter: {
      card: TWITTER_CARD_TYPE as 'summary_large_image',
      site: TWITTER_HANDLE,
      title: config.title,
      description: config.description,
      images: [ogImageUrl],
    },
    robots: config.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    themeColor: SITE_THEME_COLOR,
  };
}

/**
 * Builds the root layout metadata with global defaults.
 * Individual page layouts override specific fields by exporting
 * their own metadata via buildNextMetadata.
 */
export function buildRootMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} - Fund Ideas in 24 Hours`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      'Lightning-fast micro-grants DAO on Stacks blockchain. Propose ideas, vote with quadratic voting, and receive funding within 24 hours.',
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    keywords: [
      'SprintFund',
      'Stacks',
      'DAO',
      'micro-grants',
      'quadratic voting',
      'blockchain governance',
      'decentralized funding',
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    manifest: '/manifest.json',
    openGraph: {
      title: `${SITE_NAME} - Fund Ideas in 24 Hours`,
      description:
        'Lightning-fast micro-grants DAO on Stacks blockchain with quadratic voting.',
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: 'website',
      images: [
        {
          url: buildOgImageUrl(),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Decentralized micro-grants DAO on Stacks`,
        },
      ],
    },
    twitter: {
      card: TWITTER_CARD_TYPE as 'summary_large_image',
      site: TWITTER_HANDLE,
      title: `${SITE_NAME} - Fund Ideas in 24 Hours`,
      description:
        'Lightning-fast micro-grants DAO on Stacks blockchain with quadratic voting.',
      images: [buildOgImageUrl()],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
    },
    themeColor: SITE_THEME_COLOR,
    verification: {},
    alternates: {
      canonical: SITE_URL,
    },
    category: 'technology',
  };
}

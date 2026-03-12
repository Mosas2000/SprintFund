/**
 * SEO type definitions and constants for the SprintFund application.
 *
 * Covers Open Graph, Twitter Card, structured data, and
 * per-page metadata configuration. All types align with the
 * Next.js Metadata API where applicable.
 */

// ── Site-wide constants ─────────────────────────────────────

export const SITE_NAME = 'SprintFund';
export const SITE_DESCRIPTION =
  'Lightning-fast micro-grants DAO on Stacks blockchain with quadratic voting. Fund builders in minutes, not months.';
export const SITE_URL = 'https://sprintfund.org';
export const SITE_LOCALE = 'en_US';
export const SITE_THEME_COLOR = '#00ff88';

// ── Open Graph constants ────────────────────────────────────

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_ALT =
  'SprintFund - Lightning-fast micro-grants DAO on Stacks blockchain';

// ── Twitter / X ────────────────────────────────────────────

export const TWITTER_HANDLE = '@sprintfund';
export const TWITTER_CARD_TYPE = 'summary_large_image' as const;

// ── Type definitions ────────────────────────────────────────

/**
 * Open Graph metadata for a page.
 */
export interface OpenGraphMeta {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article' | 'profile';
  siteName: string;
  locale: string;
  images: OpenGraphImage[];
}

/**
 * Open Graph image specification.
 */
export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

/**
 * Twitter Card metadata.
 */
export interface TwitterCardMeta {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site: string;
  title: string;
  description: string;
  images: string[];
}

/**
 * Per-page SEO configuration that feeds into Next.js Metadata.
 */
export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImagePath?: string;
  noIndex?: boolean;
  keywords?: string[];
}

/**
 * JSON-LD structured data type.
 */
export interface JsonLdOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

export interface JsonLdWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface JsonLdWebPage {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  url: string;
  description: string;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

/**
 * Full SEO metadata bundle for a page.
 */
export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  openGraph: OpenGraphMeta;
  twitter: TwitterCardMeta;
  keywords?: string[];
  robots?: string;
}

/**
 * Sitemap entry for a single URL.
 */
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// ── Page registry ──────────────────────────────────────────

/**
 * Registry of all public pages with their SEO configuration.
 * Used to generate sitemaps and validate page metadata.
 */
export const PAGE_SEO_CONFIGS: PageSeoConfig[] = [
  {
    title: 'SprintFund - Lightning-Fast Micro-Grants DAO',
    description:
      'Fund builders in minutes, not months. SprintFund enables $50-200 STX micro-grants with quadratic voting on the Stacks blockchain.',
    path: '/',
    ogType: 'website',
    keywords: ['dao', 'stacks', 'micro-grants', 'quadratic voting', 'blockchain', 'governance'],
  },
  {
    title: 'Governance - SprintFund',
    description:
      'Transparent governance for the Stacks ecosystem. View proposals, vote with quadratic voting, and track execution on-chain.',
    path: '/proposals',
    ogType: 'website',
    keywords: ['governance', 'proposals', 'voting', 'stacks', 'on-chain'],
  },
  {
    title: 'Analytics - SprintFund',
    description:
      'Real-time analytics dashboard for SprintFund DAO. Track proposal performance, voting trends, and community growth.',
    path: '/analytics',
    ogType: 'website',
    keywords: ['analytics', 'dashboard', 'dao', 'metrics', 'stacks'],
  },
  {
    title: 'Community - SprintFund',
    description:
      'Meet the SprintFund community. Explore member profiles, reputation scores, and contribution history.',
    path: '/community',
    ogType: 'website',
    keywords: ['community', 'members', 'reputation', 'stacks', 'dao'],
  },
  {
    title: 'Profile - SprintFund',
    description:
      'Your SprintFund profile. View badges, delegation stats, voting history, and customize your governance interests.',
    path: '/profile',
    ogType: 'profile',
    keywords: ['profile', 'badges', 'delegation', 'voting history'],
  },
  {
    title: 'API Documentation - SprintFund',
    description:
      'SprintFund open data protocol. REST API endpoints for proposals, votes, treasury, and governance data.',
    path: '/api-docs',
    ogType: 'website',
    keywords: ['api', 'documentation', 'rest', 'data', 'stacks'],
  },
];

/**
 * SEO library barrel exports.
 *
 * Re-exports all SEO-related utility functions from the lib modules
 * for convenient importing throughout the application.
 */

// Core SEO utilities
export {
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

// JSON-LD structured data
export {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildWebPageJsonLd,
  serializeJsonLd,
  buildRootJsonLdScripts,
  buildPageJsonLdScript,
  getPageStructuredData,
} from './json-ld';

// Next.js metadata builders
export {
  buildNextMetadata,
  buildRootMetadata,
} from './metadata-builder';

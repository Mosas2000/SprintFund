# SEO Meta Tags, Open Graph, and Twitter Cards

## Overview

SprintFund implements a comprehensive SEO system built on the Next.js App Router
Metadata API. Every public-facing page includes Open Graph tags, Twitter Cards,
structured data (JSON-LD), canonical URLs, and optimized meta descriptions.

## Architecture

```
frontend/src/types/seo.ts          # Constants and type definitions
frontend/src/lib/seo-utils.ts      # Core utility functions
frontend/src/lib/json-ld.ts        # Schema.org structured data builders
frontend/src/lib/metadata-builder.ts # Next.js Metadata API integration
frontend/src/lib/client-seo.ts     # Client component SEO helpers
frontend/src/lib/index.ts          # Barrel exports for all modules
frontend/app/layout.tsx            # Root metadata + viewport exports
frontend/app/*/layout.tsx          # Per-route metadata exports
frontend/app/robots.ts             # robots.txt generation
frontend/app/sitemap.ts            # sitemap.xml generation
frontend/public/og-image.svg       # Open Graph preview image
frontend/public/manifest.json      # PWA manifest (SEO-aligned)
```

## How It Works

### Centralized Configuration

All SEO constants live in `frontend/src/types/seo.ts`:

- `SITE_NAME`, `SITE_URL`, `SITE_DESCRIPTION`, `SITE_LOCALE`
- `OG_IMAGE_WIDTH`, `OG_IMAGE_HEIGHT`, `OG_IMAGE_PATH`
- `TWITTER_HANDLE`, `TWITTER_CARD_TYPE`
- `PAGE_SEO_CONFIGS` - per-page title, description, path, keywords

### Server-Side Metadata (Layouts)

Each route has a `layout.tsx` that exports a Next.js `Metadata` object:

```typescript
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/proposals');
export const metadata: Metadata = config ? buildNextMetadata(config) : {};
```

The root layout uses `buildRootMetadata()` which includes a title template
(`%s | SprintFund`), so child layouts only need to set the page-specific title.

### Client-Side Metadata (Dynamic)

For pages that need dynamic titles based on client state:

```typescript
import { getDocumentTitle, getClientMetaTags } from '@/lib/client-seo';

// In a useEffect:
document.title = getDocumentTitle('Proposal #42');
```

### Structured Data (JSON-LD)

Three Schema.org types are generated:

- **Organization**: Site identity, logo, social profiles
- **WebSite**: Site-level metadata with SearchAction
- **WebPage**: Per-page metadata linked to parent site

### Robots and Sitemap

- `/robots.txt`: Generated from `frontend/app/robots.ts`
  - Allows all public paths, disallows `/api/` and `/profile/`
  - References `/sitemap.xml` for crawler discovery
- `/sitemap.xml`: Generated from `frontend/app/sitemap.ts`
  - Derives entries from `PAGE_SEO_CONFIGS` registry
  - Excludes pages marked with `noIndex`

## Adding SEO to a New Page

1. Add an entry to `PAGE_SEO_CONFIGS` in `frontend/src/types/seo.ts`
2. Create a `layout.tsx` in the route directory:

```typescript
import type { Metadata } from 'next';
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/your-route');
export const metadata: Metadata = config
  ? buildNextMetadata(config)
  : { title: 'Your Page - SprintFund' };

export default function YourLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

3. Run validation: `npx vitest run --config frontend/vitest.config.ts`

## Test Coverage

245 tests across 9 test files:

| File | Tests | Coverage |
|------|-------|---------|
| types/seo.test.ts | 27 | Constants, type contracts |
| lib/seo-utils.test.ts | 48 | All 10 utility functions |
| lib/json-ld.test.ts | 32 | All 7 JSON-LD builders |
| lib/metadata-builder.test.ts | 27 | Next.js metadata conversion |
| lib/route-metadata.test.ts | 22 | Per-route pipeline validation |
| lib/client-seo.test.ts | 23 | Client-side helpers |
| lib/robots-sitemap.test.ts | 19 | Robots rules, sitemap entries |
| lib/meta-tag-validation.test.ts | 19 | OG/Twitter compliance |
| lib/seo-edge-cases.test.ts | 28 | Boundary conditions |

## Validation

The `validateSeoConfig` function checks:
- Title length (10-70 characters)
- Description length (50-160 characters)
- Path format (must start with `/`)

Meta tag compliance tests verify:
- OG titles under 95 characters
- Twitter titles under 70 characters
- Descriptions under 200 characters
- Absolute URLs for all references
- Cross-platform consistency (OG and Twitter match)

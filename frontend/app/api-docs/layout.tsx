import type { Metadata } from 'next';
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/api-docs');

export const metadata: Metadata = config
  ? buildNextMetadata(config)
  : { title: 'API Documentation - SprintFund' };

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

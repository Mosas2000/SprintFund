import type { Metadata } from 'next';
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/analytics');

export const metadata: Metadata = config
  ? buildNextMetadata(config)
  : { title: 'Analytics - SprintFund' };

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from 'next';
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/community');

export const metadata: Metadata = config
  ? buildNextMetadata(config)
  : { title: 'Community - SprintFund' };

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

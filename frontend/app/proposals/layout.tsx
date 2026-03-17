import type { Metadata } from 'next';
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/proposals');

export const metadata: Metadata = config
  ? buildNextMetadata(config)
  : { title: 'Proposals - SprintFund' };

export default function ProposalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

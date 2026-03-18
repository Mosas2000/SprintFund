import type { Metadata } from 'next';
import { buildNextMetadata } from '@/lib/metadata-builder';
import { findPageSeoConfig } from '@/lib/seo-utils';

const config = findPageSeoConfig('/profile');

export const metadata: Metadata = config
  ? buildNextMetadata(config)
  : { title: 'Profile - SprintFund' };

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

'use client';

import Header from '@/components/Header';
import ProposalList from '@/components/ProposalList';

export default function ProposalsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ProposalList />
      </main>
    </div>
  );
}

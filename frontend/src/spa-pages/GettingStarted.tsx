import React from 'react';
import { OnboardingGuide } from '../components/OnboardingGuide';

export function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="mx-auto max-w-4xl px-6">
        <OnboardingGuide />

        <div className="mt-12 rounded-lg border border-muted/20 bg-surface/30 p-8 text-center">
          <p className="text-muted mb-6">
            Have questions about how SprintFund works?
          </p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/help"
            className="inline-block rounded-lg bg-green px-6 py-3 font-semibold text-dark hover:bg-green-dim transition-colors"
          >
            View Help & Support
          </a>
        </div>
      </div>
    </div>
  );
}

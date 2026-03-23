import React from 'react';
import { OnboardingFAQ } from '../components/OnboardingFAQ';

export function FAQPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="mx-auto max-w-4xl px-6">
        <OnboardingFAQ />
      </div>
    </div>
  );
}

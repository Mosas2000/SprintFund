'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

// Lazy load the Dithering component for performance
const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
);

export default function SprintFundHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToProposalForm = () => {
    const proposalSection = document.querySelector('#create-proposal');
    if (proposalSection) {
      proposalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden rounded-[48px] mx-4 md:mx-8 my-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dithering Shader Background */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-slate-900" />
          }
        >
          <div className="w-full h-full bg-slate-900" />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-800 border border-slate-700">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span className="text-sm font-medium text-slate-200">
            ⚡ Lightning-Fast Funding
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Fund ideas in{' '}
          <span className="text-orange-400">
            24 hours
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-200 mb-6 font-light">
          No paperwork. No delays. Just results.
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join 234 builders using SprintFund to turn proposals into funded projects. 
          Transparent, fast, and community-driven.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToProposalForm}
          aria-label="Create a new proposal"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <span>Create Proposal</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Stats */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm md:text-base text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>1.2M STX Distributed</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>147 Projects Funded</span>
          </div>
        </div>

        {/* Network Status Indicator */}
        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
          <span className="text-xs font-medium text-slate-300">Mainnet Live</span>
        </div>
      </div>
    </section>
  );
}

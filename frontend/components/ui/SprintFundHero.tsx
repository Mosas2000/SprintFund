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
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 animate-pulse" />
          }
        >
          <Dithering
            speed={isHovered ? 0.6 : 0.2}
            colors={{
              background: '#00000000',
              foreground: '#8B5CF6',
            }}
            shape="warp"
            className="w-full h-full mix-blend-multiply dark:mix-blend-screen"
          />
        </Suspense>
      </div>

      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-blue-900/80 dark:from-purple-950/90 dark:via-indigo-950/80 dark:to-blue-950/90" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-sm font-medium text-white">
            ⚡ Lightning-Fast Funding
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Fund ideas in{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            24 hours
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/90 mb-6 font-light">
          No paperwork. No delays. Just results.
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join 234 builders using SprintFund to turn proposals into funded projects. 
          Transparent, fast, and community-driven.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToProposalForm}
          aria-label="Create a new proposal"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 hover:ring-4 hover:ring-purple-500/20"
        >
          <span>Create Proposal</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Stats */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm md:text-base text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span>1.2M STX Distributed</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>147 Projects Funded</span>
          </div>
        </div>

        {/* Network Status Indicator */}
        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-green-400">Mainnet Live</span>
        </div>
      </div>

      {/* Floating Particles Effect (Optional Enhancement) */}
      {isMounted && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

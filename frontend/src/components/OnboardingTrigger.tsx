import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';

interface OnboardingTriggerProps {
  compact?: boolean;
  showBadge?: boolean;
}

export function OnboardingTrigger({
  compact = false,
  showBadge = true,
}: OnboardingTriggerProps) {
  const {
    isFirstTime,
    showModal,
    setShowModal,
    getCompletionPercentage,
    resumeOnboarding,
  } = useOnboarding();

  const handleClick = () => {
    if (!showModal) {
      resumeOnboarding();
    }
  };

  const completionPercentage = getCompletionPercentage();
  const showIndicator = isFirstTime && completionPercentage < 100;

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="relative text-muted hover:text-green transition-colors"
        aria-label="Show onboarding tutorial"
        title="Tutorial"
      >
        <HelpCircle size={20} />
        {showIndicator && showBadge && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-green rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green/30 text-sm font-medium text-green hover:bg-green/10 transition-colors"
      >
        <HelpCircle size={16} />
        <span>Tutorial</span>
        {showIndicator && showBadge && (
          <span className="ml-1 text-xs font-bold bg-green/20 px-2 py-0.5 rounded">
            {completionPercentage}%
          </span>
        )}
      </button>
    </div>
  );
}

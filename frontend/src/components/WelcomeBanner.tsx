import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';

export function WelcomeBanner() {
  const { isFirstTime, resumeOnboarding, skipOnboarding } = useOnboarding();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isFirstTime || dismissed) {
    return null;
  }

  const handleStartTour = () => {
    resumeOnboarding();
    setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="border-b border-green/30 bg-green/5">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center gap-4">
          <AlertCircle size={20} className="text-green flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-text">
              <span className="font-semibold">Welcome to SprintFund!</span>{' '}
              <span className="text-muted">
                Take a quick tour to learn how to participate in DAO governance.
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartTour}
              className="rounded-md border border-green bg-green/10 px-3 py-1.5 text-xs font-medium text-green hover:bg-green/20 transition-colors"
            >
              Start Tour
            </button>
            <button
              onClick={handleDismiss}
              className="text-muted hover:text-text transition-colors"
              aria-label="Dismiss banner"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

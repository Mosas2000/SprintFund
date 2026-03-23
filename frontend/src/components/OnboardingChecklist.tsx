import React, { useState } from 'react';
import { CheckCircle, Circle, X } from 'lucide-react';
import { ONBOARDING_TOUR_STEPS } from '../config/onboarding-tour';

interface OnboardingChecklistProps {
  completedSteps: string[];
  onStepClick: (stepId: string) => void;
  onDismiss: () => void;
}

export function OnboardingChecklist({
  completedSteps,
  onStepClick,
  onDismiss,
}: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completionPercentage = Math.round(
    (completedSteps.length / ONBOARDING_TOUR_STEPS.length) * 100
  );

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark hover:bg-green-dim transition-colors"
        >
          Getting Started ({completionPercentage}%)
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 rounded-lg border border-green/30 bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-text">Getting Started Checklist</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-muted hover:text-text transition-colors"
          aria-label="Collapse checklist"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-3 h-1.5 rounded-full bg-surface/50 overflow-hidden">
        <div
          className="h-full bg-green transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <p className="mb-4 text-xs text-muted">
        {completedSteps.length} of {ONBOARDING_TOUR_STEPS.length} steps completed
      </p>

      <div className="space-y-2">
        {ONBOARDING_TOUR_STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className="w-full flex items-start gap-3 rounded-lg p-2 hover:bg-surface/50 transition-colors text-left"
            >
              {isCompleted ? (
                <CheckCircle size={18} className="text-green flex-shrink-0 mt-0.5" />
              ) : (
                <Circle size={18} className="text-muted flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-muted line-through' : 'text-text'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted line-clamp-1">{step.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {completionPercentage === 100 && (
        <div className="mt-4 rounded-lg bg-green/10 p-3 text-center">
          <p className="text-sm font-semibold text-green">
            Congratulations! You've completed the onboarding.
          </p>
          <button
            onClick={onDismiss}
            className="mt-2 text-xs text-green hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

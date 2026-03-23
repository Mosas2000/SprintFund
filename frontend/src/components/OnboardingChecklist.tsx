import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div
        className="fixed bottom-4 right-4 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark hover:bg-green-dim transition-colors"
        >
          Getting Started ({completionPercentage}%)
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 w-80 rounded-lg border border-green/30 bg-surface p-4 shadow-lg"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
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
        <motion.div
          className="h-full bg-green"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />
      </div>

      <p className="mb-4 text-xs text-muted">
        {completedSteps.length} of {ONBOARDING_TOUR_STEPS.length} steps completed
      </p>

      <motion.div className="space-y-2" layout>
        <AnimatePresence mode="popLayout">
          {ONBOARDING_TOUR_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);

            return (
              <motion.button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className="w-full flex items-start gap-3 rounded-lg p-2 hover:bg-surface/50 transition-colors text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                layout
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <CheckCircle size={18} className="text-green flex-shrink-0 mt-0.5" />
                  </motion.div>
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
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {completionPercentage === 100 && (
        <motion.div
          className="mt-4 rounded-lg bg-green/10 p-3 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <p className="text-sm font-semibold text-green">
            Congratulations! You've completed the onboarding.
          </p>
          <button
            onClick={onDismiss}
            className="mt-2 text-xs text-green hover:underline"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

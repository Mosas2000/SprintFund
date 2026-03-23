import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { DaoConcept } from '../config/onboarding-tour';

interface TooltipProps {
  title: string;
  description: string;
  concepts?: DaoConcept[];
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  onClose?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  stepNumber?: number;
  totalSteps?: number;
}

export function OnboardingTooltip({
  title,
  description,
  concepts = [],
  position = 'bottom',
  onClose,
  onNext,
  onPrev,
  isFirst = false,
  isLast = false,
  stepNumber = 1,
  totalSteps = 1,
}: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-4',
    bottom: 'top-full mt-4',
    left: 'right-full mr-4',
    right: 'left-full ml-4',
    center: 'fixed inset-0 flex items-center justify-center',
  };

  const arrowClasses = {
    top: 'bottom-[-8px] left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-surface',
    bottom: 'top-[-8px] left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-surface',
    left: 'left-[-8px] top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-surface',
    right: 'right-[-8px] top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-surface',
    center: '',
  };

  const tooltipContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="w-96 max-w-sm rounded-lg border border-green/30 bg-surface p-6 shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-green uppercase tracking-wider">
            Step {stepNumber} of {totalSteps}
          </p>
          <h3 className="mt-2 text-lg font-bold text-text">{title}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors"
            aria-label="Close tooltip"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <p className="mb-4 text-sm text-muted leading-relaxed">{description}</p>

      {concepts.length > 0 && (
        <div className="mb-4 space-y-3 border-t border-surface/50 pt-4">
          {concepts.map((concept, idx) => (
            <div key={idx} className="text-sm">
              <h4 className="font-semibold text-text mb-1">{concept.title}</h4>
              <p className="text-xs text-muted mb-1">{concept.explanation}</p>
              {concept.example && (
                <p className="text-xs text-green italic">{concept.example}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        {!isFirst && onPrev && (
          <button
            onClick={onPrev}
            className="flex-1 rounded border border-muted/30 px-3 py-2 text-sm font-medium text-muted hover:bg-surface/50 transition-colors"
          >
            Previous
          </button>
        )}
        {!isLast && onNext && (
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 rounded bg-green px-3 py-2 text-sm font-medium text-dark hover:bg-green-dim transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        )}
        {isLast && (
          <button
            onClick={onClose}
            className="flex-1 rounded bg-green px-3 py-2 text-sm font-medium text-dark hover:bg-green-dim transition-colors"
          >
            Finish Tour
          </button>
        )}
      </div>
    </motion.div>
  );

  if (position === 'center') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="relative z-10">{tooltipContent}</div>
      </motion.div>
    );
  }

  return (
    <div className={`absolute z-50 ${positionClasses[position]}`}>
      {tooltipContent}
      <div className={`pointer-events-none absolute ${arrowClasses[position]}`} />
    </div>
  );
}

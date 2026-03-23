import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SkipOnboardingDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SkipOnboardingDialog({
  isOpen,
  onConfirm,
  onCancel,
}: SkipOnboardingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onCancel} />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-green/30 bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text mb-2">
              Skip Onboarding Tour?
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              The tour helps you understand how to participate in DAO governance,
              stake tokens, and vote on proposals. You can always restart it later
              from the tutorial button in the navigation.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-muted hover:text-text transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-green/30 px-4 py-2 text-sm font-medium text-green hover:bg-green/10 transition-colors"
          >
            Continue Tour
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-muted/20 px-4 py-2 text-sm font-medium text-muted hover:bg-muted/30 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

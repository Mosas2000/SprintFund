import { useState, useCallback } from 'react';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

type StepStatus = 'pending' | 'loading' | 'complete' | 'error';

interface Step {
  id: string;
  name: string;
  status: StepStatus;
  error?: NormalizedError;
}

interface UseMultiStepOptions {
  onStepComplete?: (stepId: string) => void;
  onComplete?: () => void;
  onError?: (stepId: string, error: NormalizedError) => void;
}

export function useMultiStep(
  steps: { id: string; name: string }[],
  options?: UseMultiStepOptions,
) {
  const [stepStates, setStepStates] = useState<Map<string, Step>>(
    new Map(steps.map(s => [s.id, { ...s, status: 'pending' }]))
  );

  const updateStepStatus = useCallback((stepId: string, status: StepStatus, error?: NormalizedError) => {
    setStepStates(prev => {
      const updated = new Map(prev);
      const step = updated.get(stepId);
      if (step) {
        updated.set(stepId, { ...step, status, error });
      }
      return updated;
    });
  }, []);

  const executeStep = useCallback(
    async (stepId: string, fn: () => Promise<void>) => {
      try {
        updateStepStatus(stepId, 'loading');
        await fn();
        updateStepStatus(stepId, 'complete');
        options?.onStepComplete?.(stepId);
      } catch (err) {
        const normalized = normalizeError(err);
        updateStepStatus(stepId, 'error', normalized);
        options?.onError?.(stepId, normalized);
        throw err;
      }
    },
    [updateStepStatus, options]
  );

  const isComplete = useCallback(() => {
    return Array.from(stepStates.values()).every(s => s.status !== 'pending' && s.status !== 'loading');
  }, [stepStates]);

  const hasError = useCallback(() => {
    return Array.from(stepStates.values()).some(s => s.status === 'error');
  }, [stepStates]);

  const allComplete = useCallback(() => {
    return Array.from(stepStates.values()).every(s => s.status === 'complete');
  }, [stepStates]);

  const reset = useCallback(() => {
    setStepStates(prev => {
      const updated = new Map(prev);
      updated.forEach(step => {
        step.status = 'pending';
        delete step.error;
      });
      return updated;
    });
  }, []);

  return {
    steps: Array.from(stepStates.values()),
    executeStep,
    updateStepStatus,
    isComplete,
    hasError,
    allComplete,
    reset,
  };
}

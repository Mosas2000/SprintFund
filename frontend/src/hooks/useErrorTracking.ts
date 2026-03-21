import React, { useCallback } from 'react';
import { errorLogger } from '@/utils/error-logger';

export const useErrorTracking = (componentName: string) => {
  const logError = useCallback(
    (
      error: Error,
      severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    ) => {
      errorLogger.log(componentName, error, undefined, severity);
    },
    [componentName]
  );

  const logInfo = useCallback((message: string) => {
    console.log(`[${componentName}] ${message}`);
  }, [componentName]);

  const logWarning = useCallback((message: string) => {
    console.warn(`[${componentName}] ${message}`);
  }, [componentName]);

  return {
    logError,
    logInfo,
    logWarning,
  };
};

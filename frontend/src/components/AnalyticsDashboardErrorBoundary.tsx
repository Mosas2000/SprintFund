import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { AnalyticsErrorFallback } from '@/components/AnalyticsErrorFallback';

interface AnalyticsDashboardErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const AnalyticsDashboardErrorBoundary: React.FC<
  AnalyticsDashboardErrorBoundaryProps
> = ({ children, onError }) => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = (err: Error, errorInfo: React.ErrorInfo) => {
    setError(err);
    onError?.(err, errorInfo);
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <SectionErrorBoundary
      componentName="AnalyticsDashboard"
      onError={handleError}
      fallback={<AnalyticsErrorFallback error={error ?? undefined} onRetry={handleRetry} />}
    >
      {children}
    </SectionErrorBoundary>
  );
};

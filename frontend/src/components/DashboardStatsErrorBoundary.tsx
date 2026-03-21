import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { DashboardStatsErrorFallback } from '@/components/DashboardStatsErrorFallback';

interface DashboardStatsErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const DashboardStatsErrorBoundary: React.FC<
  DashboardStatsErrorBoundaryProps
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
      componentName="DashboardStats"
      onError={handleError}
      fallback={<DashboardStatsErrorFallback error={error} onRetry={handleRetry} />}
    >
      {children}
    </SectionErrorBoundary>
  );
};

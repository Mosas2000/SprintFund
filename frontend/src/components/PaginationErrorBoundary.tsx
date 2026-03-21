import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { PaginationErrorFallback } from '@/components/PaginationErrorFallback';

interface PaginationErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const PaginationErrorBoundary: React.FC<
  PaginationErrorBoundaryProps
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
      componentName="Pagination"
      onError={handleError}
      fallback={<PaginationErrorFallback error={error} onRetry={handleRetry} />}
    >
      {children}
    </SectionErrorBoundary>
  );
};

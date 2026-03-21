import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { TransactionHistoryErrorFallback } from '@/components/TransactionHistoryErrorFallback';

interface TransactionHistoryErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const TransactionHistoryErrorBoundary: React.FC<
  TransactionHistoryErrorBoundaryProps
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
      componentName="TransactionHistory"
      onError={handleError}
      fallback={
        <TransactionHistoryErrorFallback error={error} onRetry={handleRetry} />
      }
    >
      {children}
    </SectionErrorBoundary>
  );
};

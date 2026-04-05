import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { VotingInterfaceErrorFallback } from '@/components/VotingInterfaceErrorFallback';

interface VotingInterfaceErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const VotingInterfaceErrorBoundary: React.FC<
  VotingInterfaceErrorBoundaryProps
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
      componentName="VotingInterface"
      onError={handleError}
      fallback={
        <VotingInterfaceErrorFallback error={error ?? undefined} onRetry={handleRetry} />
      }
    >
      {children}
    </SectionErrorBoundary>
  );
};

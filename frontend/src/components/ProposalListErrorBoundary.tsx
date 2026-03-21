import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { ProposalListErrorFallback } from '@/components/ProposalListErrorFallback';

interface ProposalListErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ProposalListErrorBoundary: React.FC<
  ProposalListErrorBoundaryProps
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
      componentName="ProposalList"
      onError={handleError}
      fallback={<ProposalListErrorFallback error={error} onRetry={handleRetry} />}
    >
      {children}
    </SectionErrorBoundary>
  );
};

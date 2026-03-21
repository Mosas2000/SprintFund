import React from 'react';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';
import { FormComponentErrorFallback } from '@/components/FormComponentErrorFallback';

interface FormComponentErrorBoundaryProps {
  children: React.ReactNode;
  fieldName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const FormComponentErrorBoundary: React.FC<
  FormComponentErrorBoundaryProps
> = ({ children, fieldName = 'Form', onError }) => {
  return (
    <SectionErrorBoundary
      componentName={fieldName}
      onError={onError}
      fallback={<FormComponentErrorFallback fieldName={fieldName} />}
    >
      {children}
    </SectionErrorBoundary>
  );
};

import React from 'react';

interface FormErrorProps {
  error?: Error;
  fieldName?: string;
}

export const FormComponentErrorFallback: React.FC<FormErrorProps> = ({
  error,
  fieldName = 'Form',
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">
            {fieldName} Error
          </h3>
          <p className="text-sm text-red-700">
            An error occurred while processing this form.
          </p>
          {error && (
            <p className="text-xs text-red-600 mt-2 font-mono break-all">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

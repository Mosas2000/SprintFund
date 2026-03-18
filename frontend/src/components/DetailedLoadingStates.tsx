import React from 'react';
import type { LoadingState } from '../lib/loading-state';

interface DetailedLoadingIndicatorProps {
  loadingState: LoadingState;
  title?: string;
  description?: string;
  showProgress?: boolean;
}

export const DetailedLoadingIndicator: React.FC<DetailedLoadingIndicatorProps> = ({
  loadingState,
  title,
  description,
  showProgress = true,
}) => {
  if (!loadingState.isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <svg
              className="animate-spin h-16 w-16 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              {description}
            </p>
          )}

          {showProgress && loadingState.progress !== undefined && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(loadingState.progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${loadingState.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface LoadingStateDisplayProps {
  loadingState: LoadingState;
  successMessage?: string;
  errorMessage?: string;
}

export const LoadingStateDisplay: React.FC<LoadingStateDisplayProps> = ({
  loadingState,
  successMessage = 'Operation completed successfully!',
  errorMessage = 'Operation failed. Please try again.',
}) => {
  if (loadingState.status === 'idle') return null;

  if (loadingState.isLoading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-sm text-blue-700 dark:text-blue-200">Loading...</span>
        </div>
      </div>
    );
  }

  if (loadingState.isSuccess) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-green-700 dark:text-green-200">{successMessage}</span>
        </div>
      </div>
    );
  }

  if (loadingState.isError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-red-700 dark:text-red-200">{errorMessage}</span>
        </div>
      </div>
    );
  }

  return null;
};

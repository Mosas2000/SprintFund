/**
 * Loading indicator components.
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        className="animate-spin text-blue-500"
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message,
  fullScreen = false,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center justify-center bg-black/20 ${
        fullScreen
          ? 'fixed inset-0 z-50'
          : 'absolute inset-0 rounded-lg'
      }`}
    >
      <div className="flex flex-col items-center space-y-3">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  progress: number;
  animated?: boolean;
  variant?: 'default' | 'success' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = true,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className={`h-full transition-all ${
          animated ? 'duration-500' : ''
        } ${variantClasses[variant]}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
}

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ isLoading, disabled, children, loadingText = 'Loading...', ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    className="relative disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  >
    {isLoading ? (
      <span className="flex items-center justify-center space-x-2">
        <LoadingSpinner size="sm" />
        <span>{loadingText}</span>
      </span>
    ) : (
      children
    )}
  </button>
));

LoadingButton.displayName = 'LoadingButton';

import React, { ReactNode } from 'react';
import { AsyncError, ErrorCode } from '../../src/lib/async-errors';
import { normalizeError } from '../../src/lib/error-normalizer';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: AsyncError) => void;
  fallback?: (error: AsyncError, retry: () => void) => ReactNode;
}

interface AsyncErrorBoundaryState {
  error: AsyncError | null;
}

export class AsyncErrorBoundary extends React.Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    if (error instanceof AsyncError) {
      return { error };
    }
    return {
      error: new AsyncError(error.message, ErrorCode.UNKNOWN),
    };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError && this.state.error) {
      this.props.onError(this.state.error);
    }
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry);
      }

      const normalized = normalizeError(this.state.error);
      const severityStyles = {
        low: 'bg-blue-50 border-blue-200 text-blue-900',
        medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        high: 'bg-red-50 border-red-200 text-red-900',
        critical: 'bg-red-100 border-red-300 text-red-950 font-bold',
      };
      const styles = severityStyles[normalized.severity] || severityStyles.medium;

      return (
        <div role="alert" className={`p-6 border rounded-xl shadow-sm ${styles}`}>
          <h2 className="text-xl font-bold mb-2">
            {normalized.severity === 'critical' ? 'System Error' : 'Something went wrong'}
          </h2>
          <p className="mb-4 opacity-90">{normalized.message}</p>
          
          {normalized.suggestion && (
            <div className="mb-6 p-3 bg-black/5 rounded-lg text-sm">
              <span className="font-semibold">Suggested action:</span> {normalized.suggestion}
            </div>
          )}

          {normalized.retryable && (
            <button
              onClick={this.retry}
              className="px-6 py-2 bg-black/10 hover:bg-black/20 rounded-lg transition-colors font-medium"
            >
              Try again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

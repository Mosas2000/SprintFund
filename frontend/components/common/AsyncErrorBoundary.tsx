import React, { ReactNode } from 'react';
import { AsyncError, ErrorCode, getErrorMessage, isRetryableError } from '../../src/lib/async-errors';

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
      return (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-800 mb-4">{getErrorMessage(this.state.error)}</p>
          {isRetryableError(this.state.error) && (
            <button
              onClick={this.retry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

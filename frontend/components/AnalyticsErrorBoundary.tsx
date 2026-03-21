'use client';

import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AnalyticsErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Analytics Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-2">Analytics Error</h3>
                <p className="text-sm text-red-400/80 mb-3">
                  An error occurred while loading analytics. Please refresh the page to try again.
                </p>
                {this.state.error && (
                  <details className="text-xs text-red-400/60 bg-red-400/5 rounded p-2 mt-2">
                    <summary className="cursor-pointer font-mono">Error details</summary>
                    <pre className="mt-2 overflow-auto text-red-400/60">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

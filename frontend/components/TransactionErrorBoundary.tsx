'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TransactionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Transaction error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>Failed to load transaction history</span>
        </div>
      );
    }

    return this.props.children;
  }
}

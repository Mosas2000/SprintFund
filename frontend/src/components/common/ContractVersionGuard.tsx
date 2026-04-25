import React from 'react';
import { useContractVersion } from '../../hooks/useContractVersion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ContractVersionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ContractVersionGuard({ children, fallback }: ContractVersionGuardProps) {
  const { isSupported, loading, error, isValidated, version } = useContractVersion();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 animate-pulse">
        <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
        <span className="text-sm text-white/60">Verifying contract version...</span>
      </div>
    );
  }

  if (!isValidated || !isSupported) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-semibold">Contract Version Mismatch</h3>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          The app detected an unexpected contract version (v{version || 'unknown'}). 
          Actions are disabled to prevent transaction failures.
        </p>
        {error && (
          <div className="text-xs font-mono p-2 rounded bg-black/20 text-red-300/70 overflow-x-auto">
            {error}
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

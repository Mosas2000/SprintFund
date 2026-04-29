import React, { useEffect, useState } from 'react';
import { contractVersionService } from '../services/contract-version';

export function VersionMismatchWarning() {
  const [versionInfo, setVersionInfo] = useState<{
    isSupported: boolean;
    version: number;
    isValidated: boolean;
  } | null>(null);

  useEffect(() => {
    contractVersionService.getVersionInfo().then(setVersionInfo);
  }, []);

  if (!versionInfo || !versionInfo.isValidated) {
    return null;
  }

  if (versionInfo.isSupported) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Contract Version Mismatch</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              The contract you are connected to (version {versionInfo.version}) is not the expected
              version. This may cause unexpected behavior or errors.
            </p>
            <p className="mt-2">
              Please refresh the page or clear your browser cache. If the issue persists, contact
              support.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

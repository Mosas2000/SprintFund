import React from 'react';
import { useLegacyBalance } from '../hooks/useLegacyBalance';

interface MigrationStatusProps {
  userAddress: string | undefined;
}

export function MigrationStatus({ userAddress }: MigrationStatusProps) {
  const legacyBalance = useLegacyBalance(userAddress);

  if (!userAddress || legacyBalance.isLoading) {
    return null;
  }

  if (!legacyBalance.hasLegacyAssets) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-green-400 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-green-900">Up to Date</h4>
            <p className="text-sm text-green-700">You are using the latest contract version</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Migration Status</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Legacy Stake:</span>
            <span className="font-medium text-gray-900">{legacyBalance.stakedSTX.toFixed(2)} STX</span>
          </div>
          {legacyBalance.reputation > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reputation:</span>
              <span className="font-medium text-gray-900">{legacyBalance.reputation}</span>
            </div>
          )}
          {legacyBalance.hasActiveLocks && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Locked Amount:</span>
              <span className="font-medium text-gray-900">
                {(legacyBalance.lockAmount / 1000000).toFixed(2)} STX
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start">
          {legacyBalance.canMigrateNow ? (
            <>
              <svg
                className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-900">Ready to Migrate</p>
                <p className="text-sm text-green-700">You can migrate your assets now</p>
              </div>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5 text-yellow-400 mr-2 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-900">Migration Locked</p>
                <p className="text-sm text-yellow-700">
                  Active vote locks until block {legacyBalance.unlockHeight}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {legacyBalance.error && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-red-400 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{legacyBalance.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useLegacyBalance } from '../hooks/useLegacyBalance';

interface MigrationBannerProps {
  userAddress: string | undefined;
  onMigrateClick: () => void;
  onDismiss?: () => void;
}

export function MigrationBanner({ userAddress, onMigrateClick, onDismiss }: MigrationBannerProps) {
  const legacyBalance = useLegacyBalance(userAddress);

  if (!legacyBalance.hasLegacyAssets || legacyBalance.isLoading) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Contract Migration Available
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You have <strong>{legacyBalance.stakedSTX.toFixed(2)} STX</strong> staked in the
              previous contract version.
              {legacyBalance.reputation > 0 && (
                <span> You also have <strong>{legacyBalance.reputation} reputation</strong> to preserve.</span>
              )}
            </p>
            {legacyBalance.hasActiveLocks ? (
              <p className="mt-2">
                ⏳ You have active vote locks. Migration will be available after your locks expire
                at block height {legacyBalance.unlockHeight}.
              </p>
            ) : (
              <p className="mt-2">
                Migrate now to continue participating in governance with the latest features.
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onMigrateClick}
              disabled={!legacyBalance.canMigrateNow}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                legacyBalance.canMigrateNow
                  ? 'text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              {legacyBalance.canMigrateNow ? 'Migrate Now' : 'Migration Locked'}
            </button>
            <a
              href="/docs/migration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-800 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Learn More
            </a>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium text-yellow-700 hover:text-yellow-900"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

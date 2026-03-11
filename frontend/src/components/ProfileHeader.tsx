import { memo, useCallback, useState } from 'react';
import { explorerAddressUrl, truncateAddress } from '../lib/api';
import { formatStx } from '../config';
import type { ProfileHeaderProps } from '../types/profile';

/**
 * Displays the user's wallet address, explorer link, and a copy button.
 * Shows the address prominently with quick access to the explorer.
 */
function ProfileHeaderBase({
  address,
  stxBalance,
  stakedAmount,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = address;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [address]);

  const explorerUrl = explorerAddressUrl(address);
  const shortAddress = truncateAddress(address);

  return (
    <header className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Avatar and Address */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0"
            aria-hidden="true"
          >
            {address.slice(-2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {shortAddress}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                aria-label={copied ? 'Address copied' : 'Copy full address'}
              >
                {copied ? 'Copied' : 'Copy address'}
              </button>
              <span className="text-zinc-600" aria-hidden="true">|</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
              >
                View on Explorer
              </a>
            </div>
          </div>
        </div>

        {/* Right: Balance summary */}
        <div className="flex gap-6 sm:text-right">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">
              Balance
            </p>
            <p className="text-lg font-semibold text-white">
              {formatStx(stxBalance)} STX
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">
              Staked
            </p>
            <p className="text-lg font-semibold text-emerald-400">
              {formatStx(stakedAmount)} STX
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

const ProfileHeader = memo(ProfileHeaderBase);
ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;

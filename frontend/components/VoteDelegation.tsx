'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface Delegation {
  delegateTo: string;
  delegatedAt: number;
  voteCount: number;
}

interface VoteDelegationProps {
  userAddress?: string;
}

export default function VoteDelegation({ userAddress }: VoteDelegationProps) {
  const [baseTimestamp] = useState(() => Date.now());
  const [delegateTo, setDelegateTo] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentDelegation, setCurrentDelegation] = useState<Delegation | null>(() => {
    if (!userAddress || typeof window === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem(`delegation-${userAddress}`);
    return stored ? JSON.parse(stored) : null;
  });
  const [delegatedToMe, setDelegatedToMe] = useState<string[]>(() => {
    if (!userAddress || typeof window === 'undefined') {
      return [];
    }

    return Object.keys(localStorage)
      .filter((key) => key.startsWith('delegation-') && key !== `delegation-${userAddress}`)
      .filter((key) => {
        const data = localStorage.getItem(key);
        if (!data) return false;

        return JSON.parse(data).delegateTo === userAddress;
      })
      .map((key) => key.replace('delegation-', ''));
  });
  const [totalDelegatedVotes, setTotalDelegatedVotes] = useState(() => {
    if (!userAddress || typeof window === 'undefined') {
      return 0;
    }

    return Object.keys(localStorage).reduce((total, key) => {
      if (!key.startsWith('delegation-') || key === `delegation-${userAddress}`) {
        return total;
      }

      const data = localStorage.getItem(key);
      if (!data) return total;

      const delegation = JSON.parse(data);
      return delegation.delegateTo === userAddress ? total + (delegation.voteCount || 1) : total;
    }, 0);
  });

  const loadDelegationData = useCallback(() => {
    if (!userAddress) return;

    // Load current delegation
    const stored = localStorage.getItem(`delegation-${userAddress}`);
    if (stored) {
      setCurrentDelegation(JSON.parse(stored));
    }

    // Load delegations to this user
    const allKeys = Object.keys(localStorage);
    const delegators: string[] = [];
    let totalVotes = 0;

    allKeys.forEach(key => {
      if (key.startsWith('delegation-') && key !== `delegation-${userAddress}`) {
        const data = localStorage.getItem(key);
        if (data) {
          const delegation = JSON.parse(data);
          if (delegation.delegateTo === userAddress) {
            const delegator = key.replace('delegation-', '');
            delegators.push(delegator);
            totalVotes += delegation.voteCount || 1;
          }
        }
      }
    });

    setDelegatedToMe(delegators);
    setTotalDelegatedVotes(totalVotes);
  }, [userAddress]);

  const handleDelegate = () => {
    if (!delegateTo.trim()) {
      toast.error('Please enter a valid Stacks address');
      return;
    }

    if (!delegateTo.startsWith('SP') && !delegateTo.startsWith('ST')) {
      toast.error('Invalid Stacks address format');
      return;
    }

    if (delegateTo === userAddress) {
      toast.error('Cannot delegate to yourself');
      return;
    }

    const delegation: Delegation = {
      delegateTo,
      delegatedAt: baseTimestamp,
      voteCount: 1
    };

    localStorage.setItem(`delegation-${userAddress}`, JSON.stringify(delegation));
    setCurrentDelegation(delegation);
    toast.success(`Votes delegated to ${delegateTo.slice(0, 8)}...`);
    setIsOpen(false);
    setDelegateTo('');
    loadDelegationData();
  };

  const handleRevoke = () => {
    if (!userAddress) return;
    
    localStorage.removeItem(`delegation-${userAddress}`);
    setCurrentDelegation(null);
    toast.success('Delegation revoked successfully');
    setIsOpen(false);
    loadDelegationData();
  };

  return (
    <>
      {/* Delegation Status Badge */}
      {currentDelegation && !isOpen && (
        <div className="mb-4 rounded-lg border border-purple-500/30 bg-purple-500/20 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-purple-300">Delegating votes to:</div>
              <div className="break-all font-mono text-white">
                {currentDelegation.delegateTo.slice(0, 12)}...{currentDelegation.delegateTo.slice(-8)}
              </div>
              <div className="text-xs text-purple-400 mt-1">
                Since {new Date(currentDelegation.delegatedAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="w-full rounded bg-purple-600 px-3 py-3 text-sm text-white transition-colors hover:bg-purple-700 sm:w-auto sm:py-2"
            >
              Manage
            </button>
          </div>
        </div>
      )}

      {/* Delegated Votes Counter */}
      {delegatedToMe.length > 0 && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/20 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-bold text-white">{totalDelegatedVotes} Delegated Votes</div>
              <div className="text-sm text-green-300">
                From {delegatedToMe.length} user{delegatedToMe.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-2xl">Votes</div>
          </div>
        </div>
      )}

      {/* Delegate Button */}
      {!currentDelegation && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-purple-700 hover:to-indigo-700"
        >
          Delegate Votes
        </button>
      )}

      {/* Delegation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-2 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-purple-900 to-indigo-900 p-5 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                {currentDelegation ? 'Manage Delegation' : 'Delegate Voting Power'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-2xl text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            {currentDelegation ? (
              <>
                <div className="mb-6 rounded-lg bg-white/10 p-4">
                  <div className="text-sm text-white/70 mb-2">Currently delegated to:</div>
                  <div className="break-all font-mono text-white">
                    {currentDelegation.delegateTo}
                  </div>
                  <div className="text-xs text-white/50 mt-2">
                    Delegated on {new Date(currentDelegation.delegatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleRevoke}
                    className="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-all hover:bg-red-700"
                  >
                    Revoke Delegation
                  </button>
                  <button
                    onClick={() => {
                      handleRevoke();
                      setIsOpen(true);
                    }}
                    className="w-full rounded-lg bg-white/10 px-4 py-3 font-medium text-white transition-all hover:bg-white/20"
                  >
                    Change Delegate
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Delegate Address
                  </label>
                  <input
                    type="text"
                    value={delegateTo}
                    onChange={(e) => setDelegateTo(e.target.value)}
                    placeholder="SP1234..."
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-xs text-white/50 mt-2">
                    Enter a valid Stacks address (starts with SP or ST)
                  </div>
                </div>

                <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/20 p-4">
                  <h4 className="mb-2 font-semibold text-amber-400">Preview Feature</h4>
                  <p className="text-sm text-amber-300/80">
                    Delegation is stored locally in your browser only. On-chain delegation requires a contract upgrade and is planned for a future version.
                  </p>
                </div>

                <div className="mb-6 rounded-lg bg-blue-500/20 p-4">
                  <h4 className="mb-2 font-semibold text-white">About Delegation</h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>Your delegate can vote on your behalf</li>
                    <li>You can revoke delegation anytime</li>
                    <li>Original voting power remains yours</li>
                    <li>Delegation persists until revoked</li>
                  </ul>
                </div>

                <button
                  onClick={handleDelegate}
                  disabled={!delegateTo.trim()}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delegate Votes
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

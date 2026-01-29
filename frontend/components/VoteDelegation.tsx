'use client';

import { useState, useEffect } from 'react';
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
  const [delegateTo, setDelegateTo] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentDelegation, setCurrentDelegation] = useState<Delegation | null>(null);
  const [delegatedToMe, setDelegatedToMe] = useState<string[]>([]);
  const [totalDelegatedVotes, setTotalDelegatedVotes] = useState(0);

  useEffect(() => {
    loadDelegationData();
  }, [userAddress]);

  const loadDelegationData = () => {
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
  };

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
      delegatedAt: Date.now(),
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
        <div className="mb-4 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-300">Delegating votes to:</div>
              <div className="font-mono text-white">
                {currentDelegation.delegateTo.slice(0, 12)}...{currentDelegation.delegateTo.slice(-8)}
              </div>
              <div className="text-xs text-purple-400 mt-1">
                Since {new Date(currentDelegation.delegatedAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
            >
              Manage
            </button>
          </div>
        </div>
      )}

      {/* Delegated Votes Counter */}
      {delegatedToMe.length > 0 && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-white">{totalDelegatedVotes} Delegated Votes</div>
              <div className="text-sm text-green-300">
                From {delegatedToMe.length} user{delegatedToMe.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-3xl">🗳️</div>
          </div>
        </div>
      )}

      {/* Delegate Button */}
      {!currentDelegation && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-medium shadow-lg"
        >
          Delegate Votes
        </button>
      )}

      {/* Delegation Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {currentDelegation ? 'Manage Delegation' : 'Delegate Voting Power'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {currentDelegation ? (
              <>
                <div className="mb-6 p-4 bg-white/10 rounded-lg">
                  <div className="text-sm text-white/70 mb-2">Currently delegated to:</div>
                  <div className="font-mono text-white break-all">
                    {currentDelegation.delegateTo}
                  </div>
                  <div className="text-xs text-white/50 mt-2">
                    Delegated on {new Date(currentDelegation.delegatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleRevoke}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
                  >
                    Revoke Delegation
                  </button>
                  <button
                    onClick={() => {
                      handleRevoke();
                      setIsOpen(true);
                    }}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-medium"
                  >
                    Change Delegate
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Delegate Address
                  </label>
                  <input
                    type="text"
                    value={delegateTo}
                    onChange={(e) => setDelegateTo(e.target.value)}
                    placeholder="SP1234..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-xs text-white/50 mt-2">
                    Enter a valid Stacks address (starts with SP or ST)
                  </div>
                </div>

                <div className="mb-6 p-4 bg-blue-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">ℹ️ About Delegation</h4>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• Your delegate can vote on your behalf</li>
                    <li>• You can revoke delegation anytime</li>
                    <li>• Original voting power remains yours</li>
                    <li>• Delegation persists until revoked</li>
                  </ul>
                </div>

                <button
                  onClick={handleDelegate}
                  disabled={!delegateTo.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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

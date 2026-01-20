'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface VoteDelegationProps {
    userAddress?: string;
}

export default function VoteDelegation({ userAddress }: VoteDelegationProps) {
    const [delegateTo, setDelegateTo] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [delegatedVotes, setDelegatedVotes] = useState(0);

    const handleDelegate = () => {
        if (!delegateTo.trim()) {
            toast.error('Please enter a valid address');
            return;
        }

        // Store delegation in localStorage
        localStorage.setItem(`delegation-${userAddress}`, delegateTo);
        toast.success('Votes delegated successfully!');
        setIsOpen(false);
        setDelegateTo('');
    };

    const handleRevoke = () => {
        localStorage.removeItem(`delegation-${userAddress}`);
        toast.success('Delegation revoked');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm border border-white/20"
            >
                Delegate Votes
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Delegate Voting Power</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                        Delegate To Address
                    </label>
                    <input
                        type="text"
                        value={delegateTo}
                        onChange={(e) => setDelegateTo(e.target.value)}
                        placeholder="SP1ABC..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <p className="text-xs text-purple-300 mt-1">
                        This address will be able to vote on your behalf
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleDelegate}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
                    >
                        Delegate
                    </button>
                    <button
                        onClick={handleRevoke}
                        className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-semibold transition-all border border-red-400/30"
                    >
                        Revoke
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { fetchCallReadOnlyFunction, cvToValue } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import VoteDelegation from './VoteDelegation';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = STACKS_MAINNET;

interface UserDashboardProps {
    userAddress?: string;
}

export default function UserDashboard({ userAddress }: UserDashboardProps) {
    const [stakeBalance, setStakeBalance] = useState(0);
    const [myProposals, setMyProposals] = useState<number[]>([]);
    const [myVotes, setMyVotes] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userAddress) {
            fetchUserData();
        }
    }, [userAddress]);

    const fetchUserData = async () => {
        if (!userAddress) return;

        try {
            setLoading(true);

            // Fetch stake balance
            const stakeResult = await fetchCallReadOnlyFunction({
                network: NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-stake',
                functionArgs: [{ type: 'principal', value: userAddress }],
                senderAddress: CONTRACT_ADDRESS,
            });

            const stakeValue = cvToValue(stakeResult);
            if (stakeValue) {
                const amount = stakeValue.amount?.value || stakeValue.amount;
                setStakeBalance(parseInt(amount));
            }

            // Fetch proposal count to iterate through all proposals
            const countResult = await fetchCallReadOnlyFunction({
                network: NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-proposal-count',
                functionArgs: [],
                senderAddress: CONTRACT_ADDRESS,
            });

            const countValue = cvToValue(countResult);
            const count = typeof countValue === 'number' ? countValue : (countValue?.value || 0);

            // Fetch all proposals and filter user's proposals
            const userProposalIds: number[] = [];
            for (let i = 0; i < count; i++) {
                const proposalResult = await fetchCallReadOnlyFunction({
                    network: NETWORK,
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-proposal',
                    functionArgs: [{ type: 'uint', value: i }],
                    senderAddress: CONTRACT_ADDRESS,
                });

                const proposalValue = cvToValue(proposalResult);
                if (proposalValue) {
                    const proposer = proposalValue.proposer?.value || proposalValue.proposer;
                    if (proposer === userAddress) {
                        userProposalIds.push(i);
                    }
                }
            }

            setMyProposals(userProposalIds);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setLoading(false);
        }
    };

    const formatSTX = (microStx: number) => {
        return (microStx / 1000000).toFixed(6);
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    };

    if (!userAddress) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
                <div className="text-center py-8">
                    <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-slate-300">Connect your wallet to view your dashboard</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
                <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-slate-300">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">My Dashboard</h3>

            {/* Wallet Info */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-slate-400 text-xs mb-1">Connected Wallet</p>
                <p className="text-white font-mono text-sm">{shortenAddress(userAddress)}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Stake Balance */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-400 text-xs mb-1">Stake Balance</p>
                    <p className="text-white font-bold text-lg">{formatSTX(stakeBalance)} STX</p>
                </div>

                {/* My Proposals */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <p className="text-blue-300 text-xs mb-1">My Proposals</p>
                    <p className="text-white font-bold text-lg">{myProposals.length}</p>
                </div>

                {/* My Votes */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <p className="text-green-300 text-xs mb-1">Votes Cast</p>
                    <p className="text-white font-bold text-lg">{myVotes.length}</p>
                </div>

                {/* Participation */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <p className="text-orange-300 text-xs mb-1">Participation</p>
                    <p className="text-white font-bold text-lg">{myProposals.length + myVotes.length}</p>
                </div>
            </div>

            {/* My Proposals Section */}
            {myProposals.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 text-sm">My Proposals</h4>
                    <div className="space-y-2">
                        {myProposals.map((id) => (
                            <div key={id} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                                <span className="text-slate-300 text-sm">Proposal #{id}</span>
                                <span className="text-orange-400 text-xs">View Details →</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {myProposals.length === 0 && myVotes.length === 0 && (
                <div className="text-center py-6">
                    <p className="text-slate-400 text-sm">No activity yet. Create a proposal or vote to get started!</p>
                </div>
            )}

            {/* Vote Delegation */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-3">Vote Delegation</h4>
                <VoteDelegation userAddress={userAddress} />
            </div>
        </div>
    );
}

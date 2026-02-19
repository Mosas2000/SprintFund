'use client';

import { useState, useEffect } from 'react';
import { fetchCallReadOnlyFunction, cvToValue } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { formatSTX } from '@/utils/formatSTX';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = STACKS_MAINNET;

interface Proposal {
    id: number;
    proposer: string;
    amount: number;
    executed: boolean;
}

export default function Stats() {
    const [totalProposals, setTotalProposals] = useState(0);
    const [activeProposals, setActiveProposals] = useState(0);
    const [totalDistributed, setTotalDistributed] = useState(0);
    const [topProposers, setTopProposers] = useState<{ address: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch total proposals
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
            setTotalProposals(count);

            // Fetch all proposals to calculate stats
            const proposals: Proposal[] = [];
            const proposerCounts: { [key: string]: number } = {};
            let distributed = 0;
            let active = 0;

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
                    const proposalData = {
                        id: i,
                        proposer: proposalValue.proposer?.value || proposalValue.proposer,
                        amount: parseInt(proposalValue.amount?.value || proposalValue.amount),
                        executed: proposalValue.executed?.value ?? proposalValue.executed,
                    };

                    proposals.push(proposalData);

                    // Count proposers
                    proposerCounts[proposalData.proposer] = (proposerCounts[proposalData.proposer] || 0) + 1;

                    // Calculate distributed STX
                    if (proposalData.executed) {
                        distributed += proposalData.amount;
                    } else {
                        active++;
                    }
                }
            }

            setActiveProposals(active);
            setTotalDistributed(distributed);

            // Get top proposers
            const sortedProposers = Object.entries(proposerCounts)
                .map(([address, count]) => ({ address, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setTopProposers(sortedProposers);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setLoading(false);
        }
    };

    // Uses centralized formatSTX from utils/formatSTX

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Platform Statistics</h3>
                <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-purple-200">Loading statistics...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Platform Statistics</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {/* Total Proposals */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-purple-300 text-sm mb-1">Total Proposals</p>
                    <p className="text-white font-bold text-3xl">{totalProposals}</p>
                </div>

                {/* Active Proposals */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="text-blue-300 text-sm mb-1">Active Proposals</p>
                    <p className="text-white font-bold text-3xl">{activeProposals}</p>
                </div>

                {/* Total Distributed */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-6 col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-green-300 text-sm mb-1">STX Distributed</p>
                    <p className="text-white font-bold text-3xl">{formatSTX(totalDistributed)}</p>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">Top Proposers</h4>
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>

                {topProposers.length > 0 ? (
                    <div className="space-y-3">
                        {topProposers.map((proposer, index) => (
                            <div key={proposer.address} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                                            index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                index === 2 ? 'bg-orange-500/20 text-orange-300' :
                                                    'bg-purple-500/20 text-purple-300'
                                        }`}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="text-white font-mono text-sm">{shortenAddress(proposer.address)}</p>
                                        <p className="text-purple-300 text-xs">{proposer.count} proposal{proposer.count !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                {index === 0 && (
                                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-purple-300 text-sm text-center py-4">No proposals yet</p>
                )}
            </div>
        </div>
    );
}

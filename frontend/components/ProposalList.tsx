'use client';

import { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV, boolCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import ExecuteProposal from './ExecuteProposal';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = new StacksMainnet();

interface Proposal {
    id: number;
    proposer: string;
    amount: number;
    title: string;
    description: string;
    votesFor: number;
    votesAgainst: number;
    executed: boolean;
    createdAt: number;
}

export default function ProposalList({ userAddress }: { userAddress?: string }) {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            setError('');

            // First, get the proposal count
            const countResult = await callReadOnlyFunction({
                network: NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-proposal-count',
                functionArgs: [],
                senderAddress: CONTRACT_ADDRESS,
            });

            const countJson = cvToJSON(countResult);
            const count = countJson.value?.value || 0;

            if (count === 0) {
                setProposals([]);
                setLoading(false);
                return;
            }

            // Fetch each proposal
            const proposalPromises = [];
            for (let i = 0; i < count; i++) {
                proposalPromises.push(
                    callReadOnlyFunction({
                        network: NETWORK,
                        contractAddress: CONTRACT_ADDRESS,
                        contractName: CONTRACT_NAME,
                        functionName: 'get-proposal',
                        functionArgs: [{ type: 'uint', value: i }],
                        senderAddress: CONTRACT_ADDRESS,
                    })
                );
            }

            const proposalResults = await Promise.all(proposalPromises);

            const fetchedProposals: Proposal[] = proposalResults
                .map((result, index) => {
                    const json = cvToJSON(result);
                    if (json.value) {
                        return {
                            id: index,
                            proposer: json.value.proposer.value,
                            amount: parseInt(json.value.amount.value),
                            title: json.value.title.value,
                            description: json.value.description.value,
                            votesFor: parseInt(json.value['votes-for'].value),
                            votesAgainst: parseInt(json.value['votes-against'].value),
                            executed: json.value.executed.value,
                            createdAt: parseInt(json.value['created-at'].value),
                        };
                    }
                    return null;
                })
                .filter((p): p is Proposal => p !== null);

            setProposals(fetchedProposals);
            setLoading(false);
        } catch (err: any) {
            console.error('Error fetching proposals:', err);
            setError('Failed to load proposals. Please try again.');
            setLoading(false);
        }
    };

    const formatSTX = (microStx: number) => {
        return (microStx / 1000000).toFixed(6);
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Voting Interface Component
    const VotingInterface = ({ proposalId, executed }: { proposalId: number; executed: boolean }) => {
        const [voteWeight, setVoteWeight] = useState('');
        const [isVoting, setIsVoting] = useState(false);
        const [voteSuccess, setVoteSuccess] = useState('');
        const [voteError, setVoteError] = useState('');

        const calculateCost = (weight: number) => {
            return weight * weight;
        };

        const handleVote = async (support: boolean) => {
            setVoteError('');
            setVoteSuccess('');

            const weight = parseInt(voteWeight);
            if (!weight || weight <= 0) {
                setVoteError('Please enter a valid vote weight');
                return;
            }

            setIsVoting(true);

            try {
                const functionArgs = [
                    uintCV(proposalId),
                    boolCV(support),
                    uintCV(weight),
                ];

                const options = {
                    network: NETWORK,
                    anchorMode: AnchorMode.Any,
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'vote',
                    functionArgs,
                    postConditionMode: PostConditionMode.Deny,
                    onFinish: (data: any) => {
                        setVoteSuccess(`Vote submitted! Transaction ID: ${data.txId}`);
                        setVoteWeight('');
                        setIsVoting(false);
                        // Refresh proposals after voting
                        setTimeout(() => fetchProposals(), 3000);
                    },
                    onCancel: () => {
                        setVoteError('Vote was cancelled');
                        setIsVoting(false);
                    },
                };

                await openContractCall(options);
            } catch (err: any) {
                console.error('Error voting:', err);
                if (err.message?.includes('already voted')) {
                    setVoteError('You have already voted on this proposal');
                } else if (err.message?.includes('insufficient')) {
                    setVoteError('Insufficient STX balance for this vote weight');
                } else {
                    setVoteError(err.message || 'Failed to submit vote. Please try again.');
                }
                setIsVoting(false);
            }
        };

        if (executed) {
            return null;
        }

        const weight = parseInt(voteWeight) || 0;
        const cost = calculateCost(weight);

        return (
            <div className="mt-4 pt-4 border-t border-white/10">
                <h5 className="text-white font-semibold mb-3 text-sm">Cast Your Vote</h5>

                {/* Vote Weight Input */}
                <div className="mb-3">
                    <label className="block text-purple-200 text-xs mb-2">Vote Weight</label>
                    <input
                        type="number"
                        value={voteWeight}
                        onChange={(e) => setVoteWeight(e.target.value)}
                        min="1"
                        placeholder="10"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                        disabled={isVoting}
                    />
                    {weight > 0 && (
                        <p className="text-xs text-purple-300 mt-1">
                            Cost: <span className="font-semibold">{cost} STX</span> for {weight} votes (quadratic)
                        </p>
                    )}
                </div>

                {/* Vote Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        onClick={() => handleVote(true)}
                        disabled={isVoting || !voteWeight}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isVoting ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Vote YES'
                        )}
                    </button>
                    <button
                        onClick={() => handleVote(false)}
                        disabled={isVoting || !voteWeight}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg font-semibold transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isVoting ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Vote NO'
                        )}
                    </button>
                </div>

                {/* Success Message */}
                {voteSuccess && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-2">
                        <p className="text-green-200 text-xs break-all">{voteSuccess}</p>
                    </div>
                )}

                {/* Error Message */}
                {voteError && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                        <p className="text-red-200 text-xs">{voteError}</p>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Active Proposals</h3>
                <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-purple-200">Loading proposals...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Active Proposals</h3>
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                    <p className="text-red-200">{error}</p>
                    <button
                        onClick={fetchProposals}
                        className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-white rounded-lg transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (proposals.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Active Proposals</h3>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-purple-200 text-lg">No proposals yet</p>
                    <p className="text-purple-300 text-sm mt-2">Be the first to create a proposal!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Active Proposals</h3>
                <button
                    onClick={fetchProposals}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-4">
                {proposals.map((proposal) => (
                    <div
                        key={proposal.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-400/30 hover:scale-105 hover:shadow-xl transition-transform duration-200"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="text-lg font-bold text-white">{proposal.title}</h4>
                                    {proposal.executed && (
                                        <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded text-green-300 text-xs font-medium">
                                            Executed
                                        </span>
                                    )}
                                </div>
                                <p className="text-purple-200 text-sm">{proposal.description}</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-purple-300 text-xs mb-1">Requested Amount</p>
                                <p className="text-white font-semibold">{formatSTX(proposal.amount)} STX</p>
                            </div>
                            <div>
                                <p className="text-purple-300 text-xs mb-1">Proposer</p>
                                <p className="text-white font-mono text-sm">{shortenAddress(proposal.proposer)}</p>
                            </div>
                        </div>

                        {/* Voting Stats */}
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-purple-200 text-sm">Votes For</span>
                                <span className="text-green-300 font-semibold">{proposal.votesFor}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200 text-sm">Votes Against</span>
                                <span className="text-red-300 font-semibold">{proposal.votesAgainst}</span>
                            </div>
                        </div>

                        {/* Voting Interface */}
                        <VotingInterface proposalId={proposal.id} executed={proposal.executed} />

                        {/* Execute Proposal */}
                        <ExecuteProposal
                            proposalId={proposal.id}
                            proposer={proposal.proposer}
                            userAddress={userAddress}
                            executed={proposal.executed}
                            votesFor={proposal.votesFor}
                            votesAgainst={proposal.votesAgainst}
                            onExecuted={fetchProposals}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

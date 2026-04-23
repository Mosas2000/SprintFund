'use client';

import { useState, useEffect, useCallback } from 'react';
import { boolCV, uintCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { getAllProposals, getStake } from '@/lib/stacks';
import { formatSTX } from '@/utils/formatSTX';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config';
import { getStacksNetwork } from '../src/config/stacks-network';
import ExecuteProposal from './ExecuteProposal';
import LoadingSkeleton from './ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Comments from './Comments';
import FilterDropdown from './FilterDropdown';
import SortDropdown from './SortDropdown';
import SearchBar from './common/SearchBar';
import CategoryBadge from './common/CategoryBadge';
import { PaginationControls } from './PaginationControls';
import { useNextProposalFilters } from '../hooks/useNextProposalFilters';
import { useTransaction } from '@/hooks/useTransaction';
import { useRefreshOnConfirmation } from '@/hooks/useRefreshOnConfirmation';
import { paginateProposals } from '@/lib/proposal-utils';
import type { Proposal } from '@/types';

// Get network configuration
const NETWORK = getStacksNetwork();

interface ProposalListProps {
    userAddress?: string;
}

export default function ProposalList({ userAddress }: ProposalListProps) {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [stakeLoading, setStakeLoading] = useState(false);
    const [userStakeAmount, setUserStakeAmount] = useState<number | null>(null);
    const [error, setError] = useState('');

    const {
        params: filterParams,
        setStatus,
        setCategory,
        setSort,
        setSearch,
        setPage,
        setPageSize,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,
    } = useNextProposalFilters();

    const fetchProposals = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            // Use centralized API with caching
            const fetchedProposals = await getAllProposals();
            setProposals(fetchedProposals);
        } catch (err: unknown) {
            console.error('Error fetching proposals:', err);
            setError('Failed to load proposals. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    useEffect(() => {
        const fetchStake = async () => {
            if (!userAddress) {
                setUserStakeAmount(null);
                return;
            }

            try {
                setStakeLoading(true);
                const stake = await getStake(userAddress);
                setUserStakeAmount(stake);
            } catch (err: unknown) {
                console.error('Error fetching user stake:', err);
                setUserStakeAmount(0);
            } finally {
                setStakeLoading(false);
            }
        };

        fetchStake();
    }, [userAddress]);

    useRefreshOnConfirmation(fetchProposals);

    // Uses centralized formatSTX from utils/formatSTX

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Voting Interface Component
    const VotingInterface = ({ proposalId, executed, proposalTitle }: { proposalId: number; executed: boolean; proposalTitle: string }) => {
        const [voteWeight, setVoteWeight] = useState('');
        const [voteSuccess, setVoteSuccess] = useState('');
        const [voteError, setVoteError] = useState('');

        const { isLoading: isVoting, execute } = useTransaction({
            type: 'vote',
            proposalId,
            title: proposalTitle,
            onSuccess: (txId) => {
                toast.success('Vote submitted successfully!');
                setVoteSuccess(`Vote submitted! Transaction ID: ${txId}`);
                setVoteWeight('');
                setTimeout(() => fetchProposals(), 3000);
            },
            onError: (err) => {
                const message = err.message || '';
                let errorMessage = 'Failed to submit vote. Please try again.';
                if (message.includes('already voted')) {
                    errorMessage = 'You have already voted on this proposal';
                } else if (message.includes('insufficient')) {
                    errorMessage = 'Insufficient STX balance for this vote weight';
                } else {
                    errorMessage = message || errorMessage;
                }
                setVoteError(errorMessage);
                toast.error(errorMessage);
            },
        });

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
            };

            const { openContractCall } = await import('@stacks/connect');
            await execute(async () => {
                return new Promise<string>((resolve, reject) => {
                    openContractCall({
                        ...options,
                        onFinish: (data: { txId: string }) => {
                            console.log('Vote transaction submitted:', data);
                            resolve(data.txId);
                        },
                        onCancel: () => {
                            reject(new Error('Vote was cancelled'));
                        },
                    });
                });
            });
        };

        if (executed) {
            return null;
        }

        const weight = parseInt(voteWeight) || 0;
        const cost = calculateCost(weight);
        const hasStakeData = !!userAddress && userStakeAmount !== null;
        const stakeAmount = userStakeAmount ?? 0;
        const remainingStake = Math.max(stakeAmount - cost, 0);
        const maxAffordableWeight = stakeAmount > 0 ? Math.floor(Math.sqrt(stakeAmount)) : 100;
        const sliderMax = Math.max(10, Math.min(250, maxAffordableWeight || 100));
        const usageRatio = hasStakeData && stakeAmount > 0 ? cost / stakeAmount : 0;
        const isNearLimit = hasStakeData && usageRatio >= 0.8 && usageRatio <= 1;
        const exceedsStake = hasStakeData && cost > stakeAmount;
        const votingPowerPerStx = cost > 0 ? weight / cost : 0;
        const baselineVotingPowerPerStx = 1;
        const efficiencyDrop = weight > 0 ? Math.max(0, (1 - (votingPowerPerStx / baselineVotingPowerPerStx)) * 100) : 0;

        const curveMaxWeight = Math.max(6, Math.min(20, sliderMax));
        const curveMaxCost = curveMaxWeight * curveMaxWeight;
        const curvePoints = Array.from({ length: curveMaxWeight }, (_, index) => {
            const pointWeight = index + 1;
            const pointCost = pointWeight * pointWeight;
            const x = (index / Math.max(1, curveMaxWeight - 1)) * 100;
            const y = 100 - (pointCost / curveMaxCost) * 100;
            return { pointWeight, pointCost, x, y };
        });

        const selectedPoint = weight > 0 && weight <= curveMaxWeight
            ? curvePoints[weight - 1]
            : null;

        const handleWeightInput = (value: string) => {
            const parsed = parseInt(value, 10);
            if (Number.isNaN(parsed)) {
                setVoteWeight('');
                return;
            }
            const clamped = Math.max(1, Math.min(parsed, sliderMax));
            setVoteWeight(String(clamped));
        };

        return (
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h5 className="text-white font-semibold text-sm">Cast Your Vote</h5>
                    <div className="group relative">
                        <button
                            type="button"
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-[11px] text-purple-200 hover:border-white/50"
                            aria-label="Quadratic voting explanation"
                        >
                            i
                        </button>
                        <div className="pointer-events-none absolute right-0 top-7 z-20 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-white/20 bg-black/90 p-3 text-xs text-purple-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:w-64">
                            Quadratic voting uses cost = weight^2. A larger vote carries higher impact but each additional unit of weight costs more stake than the previous one.
                        </div>
                    </div>
                </div>

                <div className="mb-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-purple-200">Quadratic cost curve</span>
                        <span className="text-[11px] text-purple-300">cost = weight^2</span>
                    </div>
                    <div className="h-28 w-full rounded-md bg-black/20 p-2">
                        <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Quadratic voting cost curve">
                            <polyline
                                fill="none"
                                stroke="rgb(129 140 248)"
                                strokeWidth="2"
                                points={curvePoints.map((point) => `${point.x},${point.y}`).join(' ')}
                            />
                            {selectedPoint && (
                                <circle cx={selectedPoint.x} cy={selectedPoint.y} r="3.5" fill="rgb(96 165 250)" />
                            )}
                        </svg>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-purple-300">
                        <span>Weight 1</span>
                        <span>Weight {curveMaxWeight}</span>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between">
                        <label className="block text-purple-200 text-xs">Vote Weight</label>
                        <span className="text-xs font-semibold text-white">{weight || 1}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max={sliderMax}
                        value={weight > 0 ? weight : 1}
                        onChange={(e) => handleWeightInput(e.target.value)}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                        disabled={isVoting || sliderMax <= 1}
                    />
                    <input
                        type="number"
                        value={voteWeight}
                        onChange={(e) => handleWeightInput(e.target.value)}
                        min="1"
                        max={sliderMax}
                        placeholder="10"
                        className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        disabled={isVoting}
                    />

                    {stakeLoading && !!userAddress && (
                        <p className="mt-2 text-xs text-purple-300">Loading stake balance...</p>
                    )}

                    {weight > 0 && (
                        <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-purple-200">
                            <div className="flex items-center justify-between">
                                <span>Quadratic Cost</span>
                                <span className="font-semibold text-white">{cost.toLocaleString()} units</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <span>Cost in STX</span>
                                <span className="font-semibold text-white">{formatSTX(cost, 6)} STX</span>
                            </div>
                            {hasStakeData && (
                                <>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span>Your Stake</span>
                                        <span className="font-semibold text-white">{formatSTX(stakeAmount)} STX</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span>Remaining After Vote</span>
                                        <span className="font-semibold text-white">{formatSTX(remainingStake)} STX</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {weight > 0 && (
                        <div className="mt-2 rounded-lg border border-blue-400/25 bg-blue-500/10 p-3 text-xs text-blue-100">
                            <div className="flex items-center justify-between">
                                <span>Voting power per STX spent</span>
                                <span className="font-semibold">{votingPowerPerStx.toFixed(4)} votes / unit</span>
                            </div>
                            <p className="mt-1 text-blue-200">
                                Efficiency drop vs weight 1: {efficiencyDrop.toFixed(2)}%
                            </p>
                        </div>
                    )}

                    {isNearLimit && (
                        <div className="mt-2 rounded-lg border border-amber-400/30 bg-amber-500/15 p-3">
                            <p className="text-xs text-amber-100">Warning: this vote uses more than 80% of your current staked balance.</p>
                        </div>
                    )}

                    {exceedsStake && (
                        <div className="mt-2 rounded-lg border border-red-400/30 bg-red-500/15 p-3">
                            <p className="text-xs text-red-100">This vote cost exceeds your staked balance. Reduce the vote weight.</p>
                        </div>
                    )}
                </div>

                <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                        onClick={() => handleVote(true)}
                        disabled={isVoting || !voteWeight || exceedsStake}
                        className="flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                        disabled={isVoting || !voteWeight || exceedsStake}
                        className="flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-red-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="space-y-4">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
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

    // Filter proposals based on URL params
    const filteredProposals = proposals.filter(proposal => {
        if (filterParams.status === 'active') return !proposal.executed;
        if (filterParams.status === 'executed') return proposal.executed;
        if (filterParams.category !== 'all' && proposal.category !== filterParams.category) return false;
        return true;
    });

    // Search filter - search in title and description
    const searchedProposals = filteredProposals.filter(proposal => {
        if (!filterParams.q.trim()) return true;
        const search = filterParams.q.toLowerCase();
        return (
            proposal.title.toLowerCase().includes(search) ||
            proposal.description.toLowerCase().includes(search)
        );
    });

    // Sort proposals based on URL sort param
    const sortedProposals = [...searchedProposals].sort((a, b) => {
        switch (filterParams.sort) {
            case 'newest':
                return b.createdAt - a.createdAt;
            case 'oldest':
                return a.createdAt - b.createdAt;
            case 'highest':
                return b.amount - a.amount;
            case 'lowest':
                return a.amount - b.amount;
            case 'most-votes': {
                const totalVotesA = a.votesFor + a.votesAgainst;
                const totalVotesB = b.votesFor + b.votesAgainst;
                return totalVotesB - totalVotesA;
            }
            case 'ending-soon':
                if (a.executed !== b.executed) return a.executed ? 1 : -1;
                return a.createdAt - b.createdAt;
            default:
                return 0;
        }
    });

    // Pagination logic
    const { page, pageSize } = filterParams;
    const totalItems = sortedProposals.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const validPage = Math.max(1, Math.min(page, Math.max(1, totalPages)));
    
    // Auto-correct out-of-bounds page
    useEffect(() => {
        if (totalItems > 0 && page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages, totalItems, setPage]);

    const paginatedProposals = paginateProposals(sortedProposals, validPage, pageSize);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-8 backdrop-blur-sm">
            {/* Search Bar */}
            <div className="mb-4">
                <SearchBar onSearchChange={setSearch} value={filterParams.q} />
            </div>

            {/* Filter, Sort, and Refresh Controls */}
            <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Active Proposals</h3>
                    <p className="text-purple-300 text-sm mt-1">
                        Showing {sortedProposals.length} of {proposals.length} proposals
                    </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                    <FilterDropdown
                        onFilterChange={(s, c) => { setStatus(s); setCategory(c); }}
                        status={filterParams.status}
                        category={filterParams.category}
                    />
                    <SortDropdown
                        onSortChange={setSort}
                        sort={filterParams.sort}
                    />
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="w-full rounded-lg bg-white/10 px-3 py-3 text-xs text-purple-300 transition-all hover:bg-white/20 hover:text-white sm:w-auto sm:py-2"
                            aria-label={`Clear ${activeFilterCount} active filter${activeFilterCount !== 1 ? 's' : ''}`}
                        >
                            Clear ({activeFilterCount})
                        </button>
                    )}
                    <button
                        onClick={fetchProposals}
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm text-white transition-all hover:bg-white/20 sm:w-auto sm:py-2"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {filterParams.sort !== 'newest' && (
                <p className="mb-4 text-xs text-purple-300/70" aria-live="polite" role="status">
                    {{
                        'oldest': 'Sorted by earliest created',
                        'ending-soon': 'Sorted by active proposals closest to their deadline',
                        'highest': 'Sorted by largest funding request',
                        'lowest': 'Sorted by smallest funding request',
                        'most-votes': 'Sorted by highest total vote count',
                    }[filterParams.sort]}
                </p>
            )}

            <div className="space-y-4">
                {sortedProposals.length === 0 && filterParams.q ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-purple-200 text-lg">No proposals found</p>
                        <p className="text-purple-300 text-sm mt-2">Try adjusting your search term</p>
                    </div>
                ) : (
                    paginatedProposals.map((proposal, index) => (
                        <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl sm:p-6 sm:hover:scale-[1.02]"
                        >
                            {/* Header */}
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <h4 className="text-lg font-bold text-white">{proposal.title}</h4>
                                        {proposal.executed && (
                                            <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded text-green-300 text-xs font-medium">
                                                Executed
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-purple-200 text-sm">{proposal.description}</p>
                                </div>

                                {/* Category Badge */}
                                {proposal.category && (
                                    <div className="self-start sm:ml-4" title={`Category: ${proposal.category}`}>
                                        <CategoryBadge category={proposal.category} />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                            <VotingInterface proposalId={proposal.id} executed={proposal.executed} proposalTitle={proposal.title} />

                            {/* Execute Proposal */}
                            <ExecuteProposal
                                proposalId={proposal.id}
                                proposer={proposal.proposer}
                                userAddress={userAddress}
                                executed={proposal.executed}
                                votesFor={proposal.votesFor}
                                votesAgainst={proposal.votesAgainst}
                                onExecuted={fetchProposals}
                                title={proposal.title}
                            />

                            {/* Comments Section */}
                            <Comments proposalId={proposal.id} userAddress={userAddress} />
                        </motion.div>
                    ))
                )}
            </div>

            {totalItems > 0 && (
                <div className="mt-8">
                    <PaginationControls
                        page={validPage}
                        pageSize={pageSize}
                        total={totalItems}
                        totalPages={totalPages}
                        hasNextPage={validPage < totalPages}
                        hasPreviousPage={validPage > 1}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            )}
        </div>
    );
}

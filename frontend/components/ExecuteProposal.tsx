'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
    AnchorMode,
    PostConditionMode,
    uintCV,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = new StacksMainnet();

interface ExecuteProposalProps {
    proposalId: number;
    proposer: string;
    userAddress?: string;
    executed: boolean;
    votesFor: number;
    votesAgainst: number;
    onExecuted?: () => void;
}

export default function ExecuteProposal({
    proposalId,
    proposer,
    userAddress,
    executed,
    votesFor,
    votesAgainst,
    onExecuted,
}: ExecuteProposalProps) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Only show execute button if:
    // 1. User is the proposer
    // 2. Proposal is not already executed
    // 3. Proposal has more votes for than against
    const canExecute =
        userAddress &&
        userAddress === proposer &&
        !executed &&
        votesFor > votesAgainst;

    if (!canExecute) {
        return null;
    }

    const handleExecute = async () => {
        setError('');
        setSuccess('');
        setIsExecuting(true);

        try {
            const functionArgs = [uintCV(proposalId)];

            const options = {
                network: NETWORK,
                anchorMode: AnchorMode.Any,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'execute-proposal',
                functionArgs,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data: any) => {
                    setSuccess(`Proposal executed successfully! Transaction ID: ${data.txId}`);
                    setIsExecuting(false);
                    if (onExecuted) {
                        setTimeout(() => onExecuted(), 3000);
                    }
                },
                onCancel: () => {
                    setError('Execution was cancelled');
                    setIsExecuting(false);
                },
            };

            await openContractCall(options);
        } catch (err: any) {
            console.error('Error executing proposal:', err);

            if (err.message?.includes('not authorized')) {
                setError('Only the proposer can execute this proposal');
            } else if (err.message?.includes('already executed')) {
                setError('This proposal has already been executed');
            } else {
                setError(err.message || 'Failed to execute proposal. Please try again.');
            }

            setIsExecuting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-start space-x-2 mb-3">
                    <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                        <p className="text-green-200 text-sm font-medium">
                            This proposal has passed! You can now execute it.
                        </p>
                        <p className="text-green-300 text-xs mt-1">
                            Votes: {votesFor} for, {votesAgainst} against
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isExecuting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Executing Proposal...</span>
                        </>
                    ) : (
                        'Execute Proposal'
                    )}
                </button>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mt-3">
                        <p className="text-green-200 text-xs break-all">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mt-3">
                        <p className="text-red-200 text-xs">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

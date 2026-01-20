'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
    AnchorMode,
    PostConditionMode,
    stringUtf8CV,
    uintCV,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import CategoryTags from './CategoryTags';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = new StacksMainnet();

interface CreateProposalFormProps {
    userAddress?: string;
}

export default function CreateProposalForm({ userAddress }: CreateProposalFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('development');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!title || title.length > 100) {
            setError('Title is required and must be 100 characters or less');
            return;
        }

        if (!description || description.length > 500) {
            setError('Description is required and must be 500 characters or less');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        if (!userAddress) {
            setError('Please connect your wallet first');
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
            const amountInMicroStx = Math.floor(parseFloat(amount) * 1000000);

            const functionArgs = [
                uintCV(amountInMicroStx),
                stringUtf8CV(title),
                stringUtf8CV(description),
            ];

            const options = {
                network: NETWORK,
                anchorMode: AnchorMode.Any,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-proposal',
                functionArgs,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data: any) => {
                    console.log('Transaction submitted:', data);
                    toast.success('Proposal created successfully!');
                    setSuccess(`Proposal created successfully! Transaction ID: ${data.txId}`);
                    setTitle('');
                    setDescription('');
                    setAmount('');
                    setIsSubmitting(false);
                },
                onCancel: () => {
                    setError('Transaction was cancelled');
                    setIsSubmitting(false);
                },
            };

            await openContractCall(options);
        } catch (err: any) {
            console.error('Error creating proposal:', err);

            let errorMessage = 'Failed to create proposal. Please try again.';
            if (err.message?.includes('insufficient')) {
                errorMessage = 'Insufficient STX balance. You need at least 10 STX staked.';
                setError(errorMessage);
            } else if (err.message?.includes('stake')) {
                errorMessage = 'You must stake at least 10 STX before creating a proposal.';
                setError(errorMessage);
            } else {
                setError(err.message || errorMessage);
            }

            toast.error(errorMessage);
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10"
        >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Create Proposal</h3>

            {/* Stake Requirement Notice */}
            <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-purple-200 text-xs sm:text-sm font-medium">
                        10 STX stake required to create proposals
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Title Field */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-purple-200 mb-2">
                        Proposal Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        placeholder="e.g., Build Community Dashboard"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        disabled={isSubmitting}
                    />
                    <p className="text-xs text-purple-300 mt-1">
                        {title.length}/100 characters
                    </p>
                </div>

                {/* Description Field */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-purple-200 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        rows={4}
                        placeholder="Describe your project and how the funds will be used..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                        disabled={isSubmitting}
                    />
                    <p className="text-xs text-purple-300 mt-1">
                        {description.length}/500 characters
                    </p>
                </div>

                {/* Amount Field */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-purple-200 mb-2">
                        Requested Amount (STX)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.000001"
                            min="0"
                            placeholder="50"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            disabled={isSubmitting}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 text-sm">
                            STX
                        </span>
                    </div>
                    <p className="text-xs text-purple-300 mt-1">
                        Recommended: 50-200 STX for micro-grants
                    </p>
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                        Category
                    </label>
                    <CategoryTags selected={category} onSelect={setCategory} />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-200 text-sm break-all">{success}</p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !userAddress}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating Proposal...</span>
                        </>
                    ) : (
                        <span>{userAddress ? 'Create Proposal' : 'Connect Wallet to Create'}</span>
                    )}
                </button>
            </form>
        </motion.div>
    );
}

'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
    AnchorMode,
    PostConditionMode,
    stringUtf8CV,
    uintCV,
} from '@stacks/transactions';
import { toMicroSTX } from '@/utils/formatSTX';
import { STACKS_MAINNET } from '@stacks/network';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryTags from './CategoryTags';
import { predictProposalSuccess } from '@/utils/successPredictor';
import { Target, AlertCircle, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = STACKS_MAINNET;

interface CreateProposalFormProps {
    userAddress?: string;
}

export default function CreateProposalForm({ userAddress }: CreateProposalFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('development');
    const [voteThreshold, setVoteThreshold] = useState('10');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [amountError, setAmountError] = useState('');
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
            // Convert STX to microSTX
            const amountInMicroStx = toMicroSTX(parseFloat(amount));

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

    const prediction = predictProposalSuccess({
        titleLength: title.length,
        descLength: description.length,
        category: category,
        hasMedia: description.length > 200, // Basic proxy for media/depth
        proposerReputation: 4.2 // Mock user reputation
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Brain className="w-48 h-48 text-orange-500" />
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Manifest Proposal</h3>

                {/* Stake Requirement Notice */}
                <div className="bg-orange-600/10 border border-orange-500/20 rounded-2xl p-4 mb-10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                        <Target className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-white text-xs font-black uppercase tracking-widest">Sovereign Proof Required</p>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">10 STX commitment mandatory for proposal manifest.</p>
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
                        <p className={`text-xs mt-1 ${title.length === 0 ? 'text-purple-300' : title.length >= 90 ? 'text-red-400 font-semibold' : 'text-green-400'}`}>
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
                        <p className={`text-xs mt-1 ${description.length === 0 ? 'text-purple-300' : description.length >= 450 ? 'text-red-400 font-semibold' : 'text-green-400'}`}>
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
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAmount(val);
                                    const numVal = parseFloat(val);
                                    if (val && numVal < 1) {
                                        setAmountError('Amount must be at least 1 STX');
                                    } else if (val && numVal > 200) {
                                        setAmountError('Amount cannot exceed 200 STX');
                                    } else {
                                        setAmountError('');
                                    }
                                }}
                                step="0.000001"
                                min="1"
                                max="200"
                                placeholder="50"
                                className={`w-full px-4 py-3 bg-white/10 border ${amountError ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent`}
                                disabled={isSubmitting}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 text-sm">
                                STX
                            </span>
                        </div>
                        {amountError ? (
                            <p className="text-xs text-red-400 font-semibold mt-1">
                                {amountError}
                            </p>
                        ) : (
                            <p className="text-xs text-purple-300 mt-1">
                                Recommended: 50-200 STX for micro-grants
                            </p>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                            Category
                        </label>
                        <CategoryTags selected={category} onSelect={setCategory} />
                    </div>

                    {/* Vote Threshold */}
                    <div>
                        <label htmlFor="threshold" className="block text-sm font-medium text-purple-200 mb-2">
                            Minimum Vote Threshold
                        </label>
                        <input
                            type="number"
                            id="threshold"
                            value={voteThreshold}
                            onChange={(e) => setVoteThreshold(e.target.value)}
                            min="1"
                            placeholder="10"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-purple-300 mt-1">
                            Minimum total votes required for execution
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 overflow-hidden"
                            >
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-red-200 text-xs font-medium leading-relaxed uppercase tracking-tight">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success Message */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 overflow-hidden"
                            >
                                <div className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-green-200 text-xs font-medium leading-relaxed uppercase tracking-tight break-all">{success}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !userAddress || !!amountError}
                        className="w-full px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:shadow-orange-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>MANIFESTING...</span>
                            </>
                        ) : (
                            <span>{userAddress ? 'MANIFEST PROPOSAL' : 'CONNECT WALLET'}</span>
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Success Forecast Sidebar */}
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consensus Forecast</h4>
                    </div>

                    <div className="text-center mb-8">
                        <div className="text-6xl font-black text-white tabular-nums mb-2">{prediction.probability}%</div>
                        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${prediction.rating === 'EXCELLENT' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                                prediction.rating === 'STRONG' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                                    'bg-orange-500/10 border-orange-500/30 text-orange-500'
                            }`}>
                            {prediction.rating} TRAJECTORY
                        </div>
                    </div>

                    <div className="space-y-3">
                        {prediction.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl">
                                <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{tip}</span>
                            </div>
                        ))}
                        {prediction.tips.length === 0 && (
                            <div className="flex items-start gap-3 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-relaxed">Optimal parameters detected</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-orange-600 border border-orange-500 rounded-[32px] p-8 text-white shadow-2xl shadow-orange-600/20"
                >
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Proposers Tip</h4>
                    <p className="text-sm font-black leading-tight uppercase tracking-tighter mb-4">
                        Industrial-grade specs manifest trust faster.
                    </p>
                    <p className="text-[10px] font-medium opacity-80 uppercase tracking-tight">
                        Proposals with technical diagrams and 500+ words see a 40% higher affirmative voting velocity.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

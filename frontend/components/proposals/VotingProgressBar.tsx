import React from 'react';

interface VotingProgressBarProps {
    votesFor: number;
    votesAgainst: number;
    quorum?: number;
}

export default function VotingProgressBar({ votesFor, votesAgainst, quorum }: VotingProgressBarProps) {
    const totalVotes = votesFor + votesAgainst;
    const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;
    const quorumReached = quorum ? totalVotes >= quorum : true;

    return (
        <div className="space-y-2">
            {/* Progress Bar */}
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Votes For */}
                <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${forPercentage}%` }}
                >
                    {forPercentage > 15 && (
                        <span className="text-white text-xs font-semibold">
                            {forPercentage.toFixed(1)}%
                        </span>
                    )}
                </div>

                {/* Votes Against */}
                <div
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-600 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${againstPercentage}%` }}
                >
                    {againstPercentage > 15 && (
                        <span className="text-white text-xs font-semibold">
                            {againstPercentage.toFixed(1)}%
                        </span>
                    )}
                </div>

                {/* Center divider */}
                {totalVotes > 0 && (
                    <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2" />
                )}
            </div>

            {/* Vote Counts */}
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                        👍 {votesFor.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">For</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Against</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                        {votesAgainst.toLocaleString()} 👎
                    </span>
                </div>
            </div>

            {/* Quorum Indicator */}
            {quorum && (
                <div className="flex items-center gap-2 text-xs">
                    {quorumReached ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            ✅ Quorum reached ({totalVotes.toLocaleString()}/{quorum.toLocaleString()})
                        </span>
                    ) : (
                        <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                            ⏳ Quorum needed: {totalVotes.toLocaleString()}/{quorum.toLocaleString()}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

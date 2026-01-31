import React from 'react';

interface ProposalStatusBadgeProps {
    status: 'pending' | 'active' | 'approved' | 'rejected' | 'executed';
}

export default function ProposalStatusBadge({ status }: ProposalStatusBadgeProps) {
    const getStatusStyles = () => {
        switch (status) {
            case 'pending':
                return {
                    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                    text: 'text-yellow-800 dark:text-yellow-300',
                    border: 'border-yellow-300 dark:border-yellow-700',
                    icon: '⏳'
                };
            case 'active':
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-800 dark:text-blue-300',
                    border: 'border-blue-300 dark:border-blue-700',
                    icon: '🗳️'
                };
            case 'approved':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-800 dark:text-green-300',
                    border: 'border-green-300 dark:border-green-700',
                    icon: '✅'
                };
            case 'rejected':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    text: 'text-red-800 dark:text-red-300',
                    border: 'border-red-300 dark:border-red-700',
                    icon: '❌'
                };
            case 'executed':
                return {
                    bg: 'bg-purple-100 dark:bg-purple-900/30',
                    text: 'text-purple-800 dark:text-purple-300',
                    border: 'border-purple-300 dark:border-purple-700',
                    icon: '🎯'
                };
            default:
                return {
                    bg: 'bg-gray-100 dark:bg-gray-900/30',
                    text: 'text-gray-800 dark:text-gray-300',
                    border: 'border-gray-300 dark:border-gray-700',
                    icon: '📋'
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles.bg} ${styles.text} ${styles.border}`}
        >
            <span className="text-sm">{styles.icon}</span>
            <span className="capitalize">{status}</span>
        </span>
    );
}

export function parseContractError(error: any): string {
    const message = error.message || '';

    // Parse common Clarity errors
    if (message.includes('err-insufficient-balance')) {
        return 'Insufficient STX balance for this transaction.';
    }

    if (message.includes('err-not-authorized')) {
        return 'You are not authorized to perform this action.';
    }

    if (message.includes('err-already-voted')) {
        return 'You have already voted on this proposal.';
    }

    if (message.includes('err-proposal-not-found')) {
        return 'Proposal not found.';
    }

    if (message.includes('err-proposal-executed')) {
        return 'This proposal has already been executed.';
    }

    if (message.includes('err-insufficient-stake')) {
        return 'Insufficient stake. You need at least 10 STX staked.';
    }

    if (message.includes('err-invalid-amount')) {
        return 'Invalid amount specified.';
    }

    // Return original message if no match
    return message || 'Transaction failed. Please try again.';
}

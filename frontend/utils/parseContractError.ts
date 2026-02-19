export function parseContractError(error: any): string {
    const message = error.message || String(error) || '';

    // Match the actual contract error codes (u100 - u103)
    if (message.includes('u100')) {
        return 'You are not authorized to perform this action.';
    }

    if (message.includes('u101')) {
        return 'Proposal not found. It may have been removed or the ID is incorrect.';
    }

    if (message.includes('u102')) {
        return 'Insufficient stake. You need at least 10 STX staked to proceed.';
    }

    if (message.includes('u103')) {
        return 'This proposal has already been executed and cannot be modified.';
    }

    // Return original message if no match
    return message || 'Transaction failed. Please try again.';
}

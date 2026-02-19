const CONTRACT_ERRORS: Record<string, string> = {
    'u100': 'You are not authorized to perform this action.',
    'u101': 'Proposal not found. It may have been removed or the ID is incorrect.',
    'u102': 'Insufficient stake. You need at least 10 STX staked to proceed.',
    'u103': 'This proposal has already been executed and cannot be modified.',
};

const NETWORK_ERRORS: Record<string, string> = {
    'NotEnoughFunds': 'Insufficient STX balance to complete this transaction.',
    'NotEnoughBalance': 'Insufficient STX balance to complete this transaction.',
    'ConflictingNonceInMempool': 'A previous transaction is still pending. Please wait for it to confirm.',
    'BadNonce': 'Transaction nonce mismatch. Please refresh the page and try again.',
};

export function parseContractError(error: any): string {
    const message = error.message || String(error) || '';

    // Check contract-specific error codes
    for (const [code, description] of Object.entries(CONTRACT_ERRORS)) {
        if (message.includes(code)) {
            return description;
        }
    }

    // Check common Stacks network errors
    for (const [key, description] of Object.entries(NETWORK_ERRORS)) {
        if (message.includes(key)) {
            return description;
        }
    }

    // Return original message if no match
    return message || 'Transaction failed. Please try again.';
}

export function handleNetworkError(error: unknown): string {
    if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.';
    }

    const message = error instanceof Error ? error.message : String(error);
    const status = typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status: number }).status
        : undefined;

    if (message.includes('timeout')) {
        return 'Request timed out. Please try again.';
    }

    if (message.includes('network')) {
        return 'Network error occurred. Please check your connection.';
    }

    if (status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
    }

    if (status !== undefined && status >= 500) {
        return 'Server error. Please try again later.';
    }

    return message || 'An unexpected error occurred.';
}

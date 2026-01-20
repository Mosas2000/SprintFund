export function handleNetworkError(error: any): string {
    if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.';
    }

    if (error.message?.includes('timeout')) {
        return 'Request timed out. Please try again.';
    }

    if (error.message?.includes('network')) {
        return 'Network error occurred. Please check your connection.';
    }

    if (error.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
    }

    if (error.status >= 500) {
        return 'Server error. Please try again later.';
    }

    return error.message || 'An unexpected error occurred.';
}

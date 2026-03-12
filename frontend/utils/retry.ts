export async function retryTransaction<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error: unknown) {
            lastError = error;

            // Don't retry if user cancelled
            const message = error instanceof Error ? error.message : '';
            if (message.includes('cancel')) {
                throw error;
            }

            // Don't retry on final attempt
            if (attempt === maxAttempts) {
                throw error;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }

    throw lastError!;
}

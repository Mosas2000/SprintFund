const MICRO_STX_PER_STX = 1_000_000;

/**
 * Convert microSTX to STX with consistent decimal formatting.
 * Uses 2 decimal places by default for display, which matches
 * the practical precision most users care about.
 */
export function formatSTX(microStx: number, decimals: number = 2): string {
    const stx = microStx / MICRO_STX_PER_STX;
    return stx.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Convert a user-entered STX amount to microSTX for contract calls.
 * Floors the result to avoid fractional microSTX values.
 */
export function toMicroSTX(stx: number): number {
    return Math.floor(stx * MICRO_STX_PER_STX);
}

/**
 * Convert microSTX to a raw STX number without formatting.
 * Useful when the value needs further arithmetic before display.
 */
export function toSTX(microStx: number): number {
    return microStx / MICRO_STX_PER_STX;
}

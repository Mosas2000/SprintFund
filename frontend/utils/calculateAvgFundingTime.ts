// Average Stacks block time in minutes (approximately 10 minutes per block)
const STACKS_BLOCK_TIME_MINUTES = 10;

export function calculateAvgFundingTime(proposals: any[]): number {
    if (!proposals || proposals.length === 0) return 0;

    const executedProposals = proposals.filter(
        (p) => p.executed && p.executionBlock && p.creationBlock
    );
    if (executedProposals.length === 0) return 0;

    const totalHours = executedProposals.reduce((sum, proposal) => {
        const blockDifference = proposal.executionBlock - proposal.creationBlock;
        const minutesElapsed = blockDifference * STACKS_BLOCK_TIME_MINUTES;
        return sum + minutesElapsed / 60;
    }, 0);

    return totalHours / executedProposals.length;
}

export function formatFundingTime(hours: number): string {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours < 24) return `${Math.round(hours)} hours`;
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
}

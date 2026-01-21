export function calculateAvgFundingTime(proposals: any[]): number {
    if (!proposals || proposals.length === 0) return 0;

    const executedProposals = proposals.filter(p => p.executed);
    if (executedProposals.length === 0) return 0;

    // Calculate average time from creation to execution
    // In a real implementation, this would use actual timestamps
    // For now, returning a mock average in hours
    return 24; // 24 hours average
}

export function formatFundingTime(hours: number): string {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours < 24) return `${Math.round(hours)} hours`;
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
}

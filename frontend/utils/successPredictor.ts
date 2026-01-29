export interface ProposalMetrics {
    titleLength: number;
    descLength: number;
    category: string;
    hasMedia: boolean;
    proposerReputation: number;
}

export function predictProposalSuccess(metrics: ProposalMetrics) {
    let score = 50; // Base score

    // Title Weight (Optimal 20-60 chars)
    if (metrics.titleLength >= 20 && metrics.titleLength <= 60) score += 15;

    // Description Weight (Optimal > 500 chars)
    if (metrics.descLength > 500) score += 10;

    // Media Weight
    if (metrics.hasMedia) score += 15;

    // Reputation Weight
    score += (metrics.proposerReputation / 5) * 10;

    // Category specific adjustments
    if (metrics.category === 'Infrastructure') score += 5;

    const finalScore = Math.min(Math.max(score, 0), 100);

    return {
        probability: finalScore,
        rating: finalScore > 80 ? 'EXCELLENT' : finalScore > 60 ? 'STRONG' : 'MODERATE',
        tips: [
            metrics.descLength < 500 ? 'Expand technical section' : null,
            !metrics.hasMedia ? 'Add technical diagram' : null,
            metrics.titleLength < 20 ? 'Make title more descriptive' : null
        ].filter(Boolean) as string[]
    };
}

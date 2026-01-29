export interface DAOHealthMetrics {
    participationRate: number; // 0-1
    treasuryBuffer: number; // months
    onboardingVelocity: number; // users/week
    proposalRetention: number; // 0-1
}

export function calculateDAOHealth(metrics: DAOHealthMetrics) {
    const pScore = metrics.participationRate * 40;
    const tScore = Math.min(metrics.treasuryBuffer / 12, 1) * 30;
    const vScore = Math.min(metrics.onboardingVelocity / 50, 1) * 20;
    const rScore = metrics.proposalRetention * 10;

    const total = pScore + tScore + vScore + rScore;

    return {
        score: Math.round(total),
        grade: total > 90 ? 'A+' : total > 80 ? 'A' : total > 70 ? 'B' : 'C',
        status: total > 80 ? 'STABLE' : 'WATCHLIST',
        breakdown: {
            participation: pScore,
            treasury: tScore,
            velocity: vScore,
            retention: rScore
        }
    };
}

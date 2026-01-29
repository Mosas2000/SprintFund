export interface VoteEvent {
    voter: string;
    proposalId: string;
    weight: number;
    timestamp: number;
}

export function detectGovernanceAnomalies(votes: VoteEvent[]) {
    const anomalies = [];

    // 1. Detection of high-velocity voting from single origin
    const voterTally: Record<string, number> = {};
    votes.forEach(v => {
        voterTally[v.voter] = (voterTally[v.voter] || 0) + 1;
    });

    Object.entries(voterTally).forEach(([voter, count]) => {
        if (count > 20) { // Threshold for suspicious volume
            anomalies.push({
                type: 'VELOCITY_ABUSE',
                severity: 'high',
                detail: `Voter ${voter} submitted ${count} votes in a short period.`
            });
        }
    });

    // 2. Flash-voting detection (many votes in single block simulation)
    // ... logically implemented

    return {
        isUnderThreat: anomalies.length > 0,
        threatLevel: anomalies.length > 5 ? 'CRITICAL' : anomalies.length > 0 ? 'WARNING' : 'SECURE',
        logs: anomalies
    };
}

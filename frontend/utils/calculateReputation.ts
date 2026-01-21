interface ReputationScore {
    score: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    icon: string;
}

export function calculateReputation(
    proposalsCreated: number,
    votesCast: number,
    proposalsExecuted: number,
    stakeBalance: number
): ReputationScore {
    // Calculate base score
    let score = 0;

    // Points for proposals created (10 points each)
    score += proposalsCreated * 10;

    // Points for votes cast (2 points each)
    score += votesCast * 2;

    // Bonus for executed proposals (50 points each)
    score += proposalsExecuted * 50;

    // Bonus for stake (1 point per 10 STX)
    score += Math.floor(stakeBalance / 10000000);

    // Determine tier
    let tier: ReputationScore['tier'];
    let icon: string;

    if (score >= 500) {
        tier = 'Diamond';
        icon = '💎';
    } else if (score >= 300) {
        tier = 'Platinum';
        icon = '🏆';
    } else if (score >= 150) {
        tier = 'Gold';
        icon = '🥇';
    } else if (score >= 50) {
        tier = 'Silver';
        icon = '🥈';
    } else {
        tier = 'Bronze';
        icon = '🥉';
    }

    return { score, tier, icon };
}

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'FINAL';

export function calculateUrgency(timeLeftMs: number): UrgencyLevel {
    const hours = timeLeftMs / (1000 * 60 * 60);

    if (hours <= 1) return 'FINAL';
    if (hours <= 6) return 'HIGH';
    if (hours <= 24) return 'MEDIUM';
    return 'LOW';
}

export function generateUrgencyAlert(title: string, urgency: UrgencyLevel) {
    const alerts = {
        FINAL: {
            subject: `🚨 FINAL CALL: ${title}`,
            message: 'Voting window closes in less than 60 minutes. Participate now to ensure quorum!',
            color: 0xef4444 // Red
        },
        HIGH: {
            subject: `⚠️ URGENT: ${title}`,
            message: 'Less than 6 hours remaining. The outcome is still undecided!',
            color: 0xEA580C // Orange
        },
        MEDIUM: {
            subject: `🔔 Voting Update: ${title}`,
            message: 'Mid-term results are in. 24 hours left to cast your vote.',
            color: 0x3B82F6 // Blue
        },
        LOW: {
            subject: `✨ New Opportunity: ${title}`,
            message: 'A fresh proposal has just entered the voting pool.',
            color: 0x10B981 // Green
        }
    };

    return alerts[urgency];
}

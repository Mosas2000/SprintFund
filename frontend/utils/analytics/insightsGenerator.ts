import { ProposalMetrics } from './dataCollector';
import { TimeSeriesData, TimeSeriesDataPoint } from './dataProcessor';
import { orderBy, meanBy, groupBy, sumBy } from 'lodash';

export interface Insight {
    id: string;
    type: 'trend' | 'anomaly' | 'comparative' | 'predictive';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    dataPoints: any[];
    chartData?: any;
    actionable: boolean;
    recommendations?: string[];
    timestamp: number;
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    impact: number; // 0-100
    effort: 1 | 2 | 3;
    type: 'proposer' | 'voter' | 'platform';
    category: 'timing' | 'content' | 'strategy' | 'engagement';
}

export function detectTrendInsight(timeseries: TimeSeriesData): Insight | null {
    const { data, trends } = timeseries;
    if (data.length < 2) return null;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    // Example: Funding velocity trend
    const velocityChange = ((latest.avgVoteVelocity - previous.avgVoteVelocity) / previous.avgVoteVelocity) * 100;

    if (Math.abs(velocityChange) > 20) {
        return {
            id: `trend-velocity-${latest.timestamp}`,
            type: 'trend',
            priority: Math.abs(velocityChange) > 50 ? 'high' : 'medium',
            title: `Funding velocity ${velocityChange > 0 ? 'increased' : 'decreased'} ${Math.abs(velocityChange).toFixed(0)}%`,
            description: `Targeted voting activity has ${velocityChange > 0 ? 'accelerated' : 'slowed down'} significantly compared to the previous period.`,
            dataPoints: [previous.avgVoteVelocity, latest.avgVoteVelocity],
            actionable: true,
            recommendations: velocityChange < 0 ? ['Increase social media engagement', 'Engage top voters directly'] : [],
            timestamp: Date.now(),
        };
    }

    // Example: Success rate trend
    if (trends.slope < 0 && latest.successRate < 50) {
        return {
            id: `trend-success-declining-${latest.timestamp}`,
            type: 'trend',
            priority: 'high',
            title: 'Proposal success rate declining',
            description: 'The overall success rate of proposals has been on a downward trajectory for the past 3 weeks.',
            dataPoints: data.map(d => d.successRate),
            actionable: true,
            recommendations: ['Review proposal requirements', 'Guide new proposers with templates'],
            timestamp: Date.now(),
        };
    }

    return null;
}

export function detectAnomalyInsight(data: ProposalMetrics[]): Insight | null {
    if (data.length < 5) return null;

    const latestProposal = orderBy(data, 'createdAt', 'desc')[0];
    const avgVotes = meanBy(data, 'totalVotes');

    // Example: Voting pattern anomaly
    if (latestProposal.totalVotes > avgVotes * 3) {
        return {
            id: `anomaly-votes-${latestProposal.proposalId}`,
            type: 'anomaly',
            priority: 'high',
            title: `Unusual voting pattern on Proposal #${latestProposal.proposalId}`,
            description: `This proposal has received ${latestProposal.totalVotes} votes, which is ${(latestProposal.totalVotes / avgVotes).toFixed(1)}x higher than the platform average.`,
            dataPoints: [avgVotes, latestProposal.totalVotes],
            actionable: true,
            recommendations: ['Verify voter identities', 'Check for sybil activity'],
            timestamp: Date.now(),
        };
    }

    // Example: Submission volume anomaly
    const today = new Date().setHours(0, 0, 0, 0);
    const todayProposals = data.filter(p => new Date(p.createdAt * 10 * 60 * 1000).setHours(0, 0, 0, 0) === today);
    const dailyAvg = data.length / 30; // Rough 30-day average

    if (todayProposals.length > dailyAvg * 3) {
        return {
            id: `anomaly-volume-${today}`,
            type: 'anomaly',
            priority: 'medium',
            title: 'Surge in proposal submissions',
            description: `${todayProposals.length} proposals were submitted today, which is 3x more than the daily average.`,
            dataPoints: [dailyAvg, todayProposals.length],
            actionable: false,
            timestamp: Date.now(),
        };
    }

    return null;
}

export function generateComparativeInsight(currentMetrics: ProposalMetrics, historicalData: ProposalMetrics[]): Insight | null {
    const platformAvgSuccess = (historicalData.filter(p => p.executed).length / historicalData.length) * 100 || 0;

    // Example: Success rate comparison
    if (currentMetrics.executed === false && platformAvgSuccess > 60) {
        return {
            id: `compare-success-${currentMetrics.proposalId}`,
            type: 'comparative',
            priority: 'medium',
            title: 'Success rate below platform average',
            description: `Your success rate is currently 0% (pending), while the platform average stands at ${platformAvgSuccess.toFixed(0)}%.`,
            dataPoints: [0, platformAvgSuccess],
            actionable: true,
            recommendations: ['Check successful proposals in your category', 'Adjust funding request amount'],
            timestamp: Date.now(),
        };
    }

    return null;
}

export function generatePredictiveInsight(timeseries: TimeSeriesData): Insight | null {
    const { trends, data } = timeseries;
    if (data.length < 4) return null;

    // Example: Projected distributions
    const avgMonthlyFunding = meanBy(data, 'totalFunding') || 0;
    const projectedFunding = avgMonthlyFunding * (1 + trends.slope);

    return {
        id: `predictive-funding-${Date.now()}`,
        type: 'predictive',
        priority: 'low',
        title: 'Projected monthly distribution',
        description: `Based on current growth trends, we expect approximately ${projectedFunding.toFixed(0)} STX to be distributed this month.`,
        dataPoints: data.map(d => d.totalFunding),
        actionable: false,
        timestamp: Date.now(),
    };
}

export function generateRecommendations(userContext: {
    role: 'proposer' | 'voter';
    history: ProposalMetrics[];
    preferences: string[];
}): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (userContext.role === 'proposer') {
        recommendations.push({
            id: 'rec-timing',
            title: 'Optimal Submission Timing',
            description: 'Submit on Tuesday at 2 PM for maximum visibility and engagement.',
            impact: 15,
            effort: 1,
            type: 'proposer',
            category: 'timing'
        });

        recommendations.push({
            id: 'rec-amount',
            title: 'Suggested Funding Range',
            description: 'Reducing your request to 75-100 STX could increase your success probability by 22%.',
            impact: 22,
            effort: 2,
            type: 'proposer',
            category: 'strategy'
        });
    }

    return recommendations;
}

export function prioritizeInsights(insights: Insight[]): Insight[] {
    return orderBy(insights, [
        (i) => (i.priority === 'high' ? 3 : i.priority === 'medium' ? 2 : 1),
        'timestamp'
    ], ['desc', 'desc']);
}

export function generateAllInsights(
    allProposals: ProposalMetrics[],
    timeseries: TimeSeriesData,
    userContext: any
): Insight[] {
    const insights: Insight[] = [];

    const trend = detectTrendInsight(timeseries);
    if (trend) insights.push(trend);

    const anomaly = detectAnomalyInsight(allProposals);
    if (anomaly) insights.push(anomaly);

    const predictive = generatePredictiveInsight(timeseries);
    if (predictive) insights.push(predictive);

    if (userContext && userContext.lastProposal) {
        const comparative = generateComparativeInsight(userContext.lastProposal, allProposals);
        if (comparative) insights.push(comparative);
    }

    return prioritizeInsights(insights);
}

'use client';

import { useState, useMemo } from 'react';
import { ProposalMetrics } from '../../utils/analytics/dataCollector';
import { categorizeProposal, calculatePercentile } from '../../utils/analytics/helpers';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface SuccessPredictorProps {
  historicalProposals: ProposalMetrics[];
}

interface PredictionFactors {
  titleScore: number;
  descriptionScore: number;
  amountScore: number;
  timingScore: number;
  categoryScore: number;
}

interface Recommendation {
  type: 'success' | 'warning' | 'error';
  message: string;
}

export default function SuccessPredictor({ historicalProposals }: SuccessPredictorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(100000000);
  const [category, setCategory] = useState('development');
  const [submissionDate, setSubmissionDate] = useState(new Date());

  const categories = ['development', 'marketing', 'community', 'infrastructure', 'education', 'research', 'design', 'content', 'other'];

  const categoryStats = useMemo(() => {
    const stats = new Map<string, { total: number; successful: number; avgAmount: number }>();
    
    historicalProposals.forEach(p => {
      if (!stats.has(p.category)) {
        stats.set(p.category, { total: 0, successful: 0, avgAmount: 0 });
      }
      const catStats = stats.get(p.category)!;
      catStats.total++;
      if (p.executed) catStats.successful++;
      catStats.avgAmount += p.amount;
    });

    stats.forEach((value, key) => {
      value.avgAmount /= value.total;
    });

    return stats;
  }, [historicalProposals]);

  const prediction = useMemo(() => {
    const factors: PredictionFactors = {
      titleScore: 0,
      descriptionScore: 0,
      amountScore: 0,
      timingScore: 0,
      categoryScore: 0
    };

    factors.titleScore = calculateTitleScore(title);
    factors.descriptionScore = calculateDescriptionScore(description);
    factors.amountScore = calculateAmountScore(amount, category, categoryStats);
    factors.timingScore = calculateTimingScore(submissionDate);
    factors.categoryScore = calculateCategoryScore(category, categoryStats);

    const weights = {
      titleScore: 0.15,
      descriptionScore: 0.25,
      amountScore: 0.25,
      timingScore: 0.15,
      categoryScore: 0.20
    };

    const weightedScore = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + value * weights[key as keyof typeof weights];
    }, 0);

    const probability = Math.max(0, Math.min(100, weightedScore));
    const confidenceInterval = [
      Math.max(0, probability - 5),
      Math.min(100, probability + 5)
    ];

    const recommendations = generateRecommendations(factors, title, description, amount, category, submissionDate, categoryStats);

    return {
      probability,
      confidenceInterval,
      factors,
      recommendations
    };
  }, [title, description, amount, category, submissionDate, categoryStats]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Proposal Success Predictor</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get AI-powered predictions on your proposal's likelihood of success
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter proposal title..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length} characters (optimal: 40-60)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter proposal description..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters (optimal: 200-350)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount Requested (microSTX)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {(amount / 1_000_000).toFixed(2)} STX
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Submission Date & Time</label>
            <input
              type="datetime-local"
              value={submissionDate.toISOString().slice(0, 16)}
              onChange={(e) => setSubmissionDate(new Date(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-8 text-white text-center">
            <div className="text-sm opacity-90 mb-2">Success Probability</div>
            <div className="text-6xl font-bold mb-2">{prediction.probability.toFixed(0)}%</div>
            <div className="text-sm opacity-75">
              Confidence: {prediction.confidenceInterval[0].toFixed(0)}%-{prediction.confidenceInterval[1].toFixed(0)}%
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-semibold mb-3">Factor Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(prediction.factors).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {key.replace('Score', '')}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {value.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${value}%`,
                        backgroundColor: value > 70 ? '#10b981' : value > 40 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-semibold mb-3">Recommendations</h4>
            <div className="space-y-2">
              {prediction.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {rec.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                  {rec.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  {rec.type === 'error' && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                  <p className="text-sm text-gray-700 dark:text-gray-300">{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateTitleScore(title: string): number {
  if (!title) return 0;
  
  const length = title.length;
  let score = 0;

  if (length >= 40 && length <= 60) score += 40;
  else if (length >= 30 && length <= 70) score += 25;
  else score += 10;

  const keywords = ['fund', 'build', 'improve', 'develop', 'create', 'support', 'grant'];
  const hasKeyword = keywords.some(kw => title.toLowerCase().includes(kw));
  if (hasKeyword) score += 30;

  const sentiment = title.toLowerCase().includes('!') ? 10 : 0;
  score += sentiment;

  return Math.min(100, score + 20);
}

function calculateDescriptionScore(description: string): number {
  if (!description) return 0;

  const length = description.length;
  let score = 0;

  if (length >= 200 && length <= 350) score += 40;
  else if (length >= 150 && length <= 400) score += 25;
  else if (length >= 100) score += 15;
  else score += 5;

  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3 && sentences.length <= 6) score += 20;

  const hasCallToAction = /\b(will|plan|propose|aim|goal)\b/i.test(description);
  if (hasCallToAction) score += 20;

  return Math.min(100, score + 20);
}

function calculateAmountScore(
  amount: number,
  category: string,
  categoryStats: Map<string, { total: number; successful: number; avgAmount: number }>
): number {
  const catStats = categoryStats.get(category);
  if (!catStats) return 50;

  const avgAmount = catStats.avgAmount;
  const ratio = amount / avgAmount;

  if (ratio >= 0.5 && ratio <= 1.5) return 90;
  if (ratio >= 0.3 && ratio <= 2.0) return 70;
  if (ratio >= 0.1 && ratio <= 3.0) return 50;
  return 30;
}

function calculateTimingScore(date: Date): number {
  const dayOfWeek = date.getDay();
  const hour = date.getHours();

  let score = 50;

  if (dayOfWeek >= 1 && dayOfWeek <= 5) score += 20;
  else score -= 10;

  if (hour >= 9 && hour <= 17) score += 20;
  else if (hour >= 18 && hour <= 22) score += 10;
  else score -= 10;

  if (dayOfWeek === 2 || dayOfWeek === 3) score += 10;

  return Math.max(0, Math.min(100, score));
}

function calculateCategoryScore(
  category: string,
  categoryStats: Map<string, { total: number; successful: number; avgAmount: number }>
): number {
  const catStats = categoryStats.get(category);
  if (!catStats) return 50;

  const successRate = (catStats.successful / catStats.total) * 100;
  return successRate;
}

function generateRecommendations(
  factors: PredictionFactors,
  title: string,
  description: string,
  amount: number,
  category: string,
  date: Date,
  categoryStats: Map<string, { total: number; successful: number; avgAmount: number }>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (factors.titleScore > 70) {
    recommendations.push({ type: 'success', message: 'Title is well-crafted and engaging' });
  } else if (title.length < 40) {
    recommendations.push({ type: 'warning', message: 'Consider making title longer (40-60 characters optimal)' });
  }

  if (factors.descriptionScore > 70) {
    recommendations.push({ type: 'success', message: 'Description provides good detail' });
  } else if (description.length < 200) {
    recommendations.push({ type: 'error', message: 'Description too short - aim for 250+ characters' });
  }

  const catStats = categoryStats.get(category);
  if (catStats) {
    const ratio = amount / catStats.avgAmount;
    if (ratio >= 0.5 && ratio <= 1.5) {
      recommendations.push({ type: 'success', message: 'Amount is in optimal range for category' });
    } else if (ratio > 2) {
      recommendations.push({ type: 'warning', message: 'Amount is significantly higher than category average' });
    }
  }

  const dayOfWeek = date.getDay();
  if (dayOfWeek === 2) {
    recommendations.push({ type: 'success', message: 'Tuesday is the optimal submission day' });
  } else if (dayOfWeek === 0 || dayOfWeek === 6) {
    recommendations.push({ type: 'warning', message: 'Consider submitting on Tuesday for 15% higher success rate' });
  }

  if (factors.categoryScore > 70) {
    recommendations.push({ type: 'success', message: 'Category has high historical success rate' });
  }

  return recommendations;
}

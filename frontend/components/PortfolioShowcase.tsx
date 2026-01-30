'use client';

import { useState } from 'react';

interface PortfolioItem {
  proposalId: number;
  title: string;
  description: string;
  category: string;
  amount: number;
  status: 'approved' | 'executed';
  impact: {
    stxDistributed: number;
    communitySupport: number;
    completionRate: number;
  };
  metrics: {
    yesVotes: number;
    noVotes: number;
    participationRate: number;
  };
  timeline: {
    created: number;
    approved: number;
    executed?: number;
  };
  outcomes: string[];
  imageUrl?: string;
}

interface PortfolioShowcaseProps {
  userAddress: string;
}

export default function PortfolioShowcase({ userAddress }: PortfolioShowcaseProps) {
  const [portfolioItems] = useState<PortfolioItem[]>([
    {
      proposalId: 42,
      title: 'DeFi Lending Protocol Development',
      description: 'Built a decentralized lending platform enabling users to lend and borrow assets with competitive rates.',
      category: 'DeFi',
      amount: 75000,
      status: 'executed',
      impact: {
        stxDistributed: 75000,
        communitySupport: 89,
        completionRate: 100
      },
      metrics: {
        yesVotes: 450,
        noVotes: 82,
        participationRate: 76
      },
      timeline: {
        created: Date.now() - 120 * 24 * 60 * 60 * 1000,
        approved: Date.now() - 100 * 24 * 60 * 60 * 1000,
        executed: Date.now() - 30 * 24 * 60 * 60 * 1000
      },
      outcomes: [
        '1,200+ active users',
        '$2.5M in total value locked',
        '98% uptime since launch',
        'Featured in 3 major crypto publications'
      ]
    },
    {
      proposalId: 28,
      title: 'Community NFT Marketplace',
      description: 'Created a user-friendly NFT marketplace with low fees and advanced features for creators.',
      category: 'NFT',
      amount: 50000,
      status: 'executed',
      impact: {
        stxDistributed: 50000,
        communitySupport: 92,
        completionRate: 100
      },
      metrics: {
        yesVotes: 380,
        noVotes: 45,
        participationRate: 68
      },
      timeline: {
        created: Date.now() - 150 * 24 * 60 * 60 * 1000,
        approved: Date.now() - 130 * 24 * 60 * 60 * 1000,
        executed: Date.now() - 60 * 24 * 60 * 60 * 1000
      },
      outcomes: [
        '500+ NFTs minted',
        '250+ creators onboarded',
        '$500K in trading volume',
        'Integration with 5 major wallets'
      ]
    },
    {
      proposalId: 15,
      title: 'DAO Governance Dashboard',
      description: 'Developed a comprehensive dashboard for tracking proposals, votes, and treasury analytics.',
      category: 'Infrastructure',
      amount: 35000,
      status: 'approved',
      impact: {
        stxDistributed: 35000,
        communitySupport: 85,
        completionRate: 75
      },
      metrics: {
        yesVotes: 320,
        noVotes: 58,
        participationRate: 72
      },
      timeline: {
        created: Date.now() - 90 * 24 * 60 * 60 * 1000,
        approved: Date.now() - 70 * 24 * 60 * 60 * 1000
      },
      outcomes: [
        '800+ daily active users',
        '15 new features launched',
        'Mobile app in development'
      ]
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const totalImpact = {
    stxDistributed: portfolioItems.reduce((sum, item) => sum + item.impact.stxDistributed, 0),
    avgSupport: portfolioItems.reduce((sum, item) => sum + item.impact.communitySupport, 0) / portfolioItems.length,
    totalVotes: portfolioItems.reduce((sum, item) => sum + item.metrics.yesVotes + item.metrics.noVotes, 0)
  };

  const shareableURL = `https://sprintfund.io/portfolio/${userAddress}`;

  const downloadPDF = () => {
    alert('PDF download would be implemented here');
  };

  const sharePortfolio = () => {
    navigator.clipboard.writeText(shareableURL);
    alert('Portfolio URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">🎨 Portfolio Showcase</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Highlighting {portfolioItems.length} successful proposals
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sharePortfolio}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            📤 Share
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            📄 Download PDF
          </button>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total STX Distributed</div>
          <div className="text-3xl font-bold">{totalImpact.stxDistributed.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Avg Community Support</div>
          <div className="text-3xl font-bold">{totalImpact.avgSupport.toFixed(0)}%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Votes Received</div>
          <div className="text-3xl font-bold">{totalImpact.totalVotes.toLocaleString()}</div>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolioItems.map(item => (
          <div
            key={item.proposalId}
            onClick={() => setSelectedItem(item)}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                     hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer overflow-hidden"
          >
            {/* Image/Banner */}
            <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-5xl mb-2">
                  {item.category === 'DeFi' ? '💰' : item.category === 'NFT' ? '🎨' : '🏗️'}
                </div>
                <div className="text-sm opacity-90">{item.category}</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 
                               rounded text-xs font-medium">
                  {item.status === 'executed' ? '✓ Executed' : 'Approved'}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  <div className="text-xl font-bold text-green-600">{item.impact.communitySupport}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Support</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  <div className="text-xl font-bold text-blue-600">
                    {item.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">STX</div>
                </div>
              </div>

              {/* Top Outcomes */}
              <div className="space-y-1">
                {item.outcomes.slice(0, 2).map((outcome, idx) => (
                  <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                    <span>✓</span>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium 
                               hover:bg-blue-700 transition">
                View Case Study →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Case Study Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedItem.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Proposal #{selectedItem.proposalId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedItem.description}</p>

              {/* Impact Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedItem.impact.stxDistributed.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">STX Distributed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedItem.impact.communitySupport}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Community Support</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedItem.impact.completionRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Created: {new Date(selectedItem.timeline.created).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">
                      Approved: {new Date(selectedItem.timeline.approved).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedItem.timeline.executed && (
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">
                        Executed: {new Date(selectedItem.timeline.executed).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Outcomes */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Outcomes</h3>
                <div className="space-y-2">
                  {selectedItem.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voting Stats */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="font-semibold mb-3">Voting Statistics</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-green-600 font-medium">
                    ✓ {selectedItem.metrics.yesVotes} Yes
                  </span>
                  <span className="text-red-600 font-medium">
                    ✗ {selectedItem.metrics.noVotes} No
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedItem.metrics.participationRate}% participation
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(selectedItem.metrics.yesVotes / (selectedItem.metrics.yesVotes + selectedItem.metrics.noVotes)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

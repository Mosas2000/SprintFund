import React from 'react';
import { BookOpen, Zap, Users, Coins } from 'lucide-react';

interface GuideSection {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    icon: <BookOpen size={20} />,
    title: 'Understanding DAO Governance',
    items: [
      'DAOs are organizations governed by their members through smart contracts',
      'Decisions are made collectively through voting by stakeholders',
      'Transparency is built into the blockchain, ensuring fairness',
      'All members can propose and vote on initiatives',
    ],
  },
  {
    icon: <Coins size={20} />,
    title: 'Voting Power & Staking',
    items: [
      'Staking STX tokens gives you voting power in the DAO',
      'Your voting power uses quadratic voting to prevent whale dominance',
      'More staked tokens = more voting power (but with diminishing returns)',
      'Staked tokens remain in your wallet, fully under your control',
    ],
  },
  {
    icon: <Users size={20} />,
    title: 'Community Participation',
    items: [
      'Create proposals for new initiatives or policy changes',
      'Vote on proposals that align with your values',
      'Comment and discuss proposals with the community',
      'Help the DAO make informed, collective decisions',
    ],
  },
  {
    icon: <Zap size={20} />,
    title: 'Getting Started Tips',
    items: [
      'Start by connecting your wallet to join the community',
      'Review existing proposals to understand governance',
      'Stake a small amount of STX to begin voting',
      'Participate actively to build your reputation',
    ],
  },
];

export function OnboardingGuide() {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green mb-3">Getting Started with SprintFund</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Learn how to participate in decentralized governance and make a difference in the DAO.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDE_SECTIONS.map((section, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-green/20 bg-surface/50 p-6 hover:border-green/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-green">{section.icon}</div>
              <h2 className="text-lg font-semibold text-text">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-sm text-muted flex gap-2">
                  <span className="text-green font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-green/10 border border-green/30 p-6 mt-8">
        <h3 className="text-lg font-semibold text-green mb-3">Quick Start Steps</h3>
        <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
          <li>Connect your Stacks wallet to authenticate</li>
          <li>Review your current STX balance and voting power</li>
          <li>Stake STX to participate in governance</li>
          <li>Browse and read active proposals</li>
          <li>Cast your first vote on a proposal</li>
          <li>Check your profile for voting history and reputation</li>
        </ol>
      </div>
    </div>
  );
}

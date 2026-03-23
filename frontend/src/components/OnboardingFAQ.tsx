import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I connect my wallet?',
    answer:
      'Click the "Connect Wallet" button in the top navigation. Select your wallet provider (Hiro Wallet or Leather) and approve the connection request. Your wallet will then be linked to SprintFund.',
  },
  {
    category: 'Getting Started',
    question: 'What wallet providers are supported?',
    answer:
      'SprintFund supports Hiro Wallet and Leather Wallet, which are designed for the Stacks blockchain. Make sure you have STX tokens in your wallet before connecting.',
  },
  {
    category: 'Staking',
    question: 'Why do I need to stake STX?',
    answer:
      'Staking demonstrates your commitment to the DAO and gives you voting power. Your staked STX determines your influence over governance decisions.',
  },
  {
    category: 'Staking',
    question: 'How much STX do I need to stake?',
    answer:
      'There is no minimum or maximum staking requirement. Start with whatever amount you are comfortable with. Your voting power is calculated using quadratic voting based on your stake.',
  },
  {
    category: 'Voting',
    question: 'What is quadratic voting?',
    answer:
      'Quadratic voting means your voting power increases with the square root of your staked tokens. This prevents large token holders from dominating decisions while still giving them more influence than smaller holders.',
  },
  {
    category: 'Voting',
    question: 'Can I change my vote after submitting it?',
    answer:
      'Vote changes depend on the specific proposal settings. Most proposals allow vote changes during the voting period. Check the proposal details for specific voting rules.',
  },
  {
    category: 'Proposals',
    question: 'How do I create a proposal?',
    answer:
      'Navigate to the Proposals section and click "Create Proposal". Fill in the title, description, and other required details. Submit your proposal for community review and voting.',
  },
  {
    category: 'Proposals',
    question: 'What happens after a proposal is voted on?',
    answer:
      'Once the voting period ends, results are tallied using the community votes. If approved, the proposal moves to implementation. You can track its progress in the Proposals section.',
  },
  {
    category: 'DAO Basics',
    question: 'What is a DAO?',
    answer:
      'A Decentralized Autonomous Organization is a digital organization governed by smart contracts and community members rather than traditional management. Decisions are made collectively through voting.',
  },
  {
    category: 'DAO Basics',
    question: 'Can I lose my staked tokens?',
    answer:
      'Your staked tokens are not at risk in SprintFund. They remain in your wallet and under your control. You can unstake them at any time.',
  },
];

export function OnboardingFAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = Array.from(
    new Set(FAQ_ITEMS.map((item) => item.category))
  ) as string[];

  return (
    <div className="space-y-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-lg">
          Find answers to common questions about SprintFund and DAO governance.
        </p>
      </div>

      {categories.map((category) => {
        const categoryItems = FAQ_ITEMS.filter((item) => item.category === category);

        return (
          <div key={category} className="space-y-3">
            <h2 className="text-xl font-bold text-green mb-4">{category}</h2>

            <div className="space-y-2">
              {categoryItems.map((item, idx) => {
                const itemId = FAQ_ITEMS.indexOf(item);
                const isExpanded = expandedId === itemId;

                return (
                  <div
                    key={itemId}
                    className="rounded-lg border border-green/20 bg-surface/50 overflow-hidden hover:border-green/40 transition-colors"
                  >
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : itemId)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors"
                    >
                      <span className="text-left font-semibold text-text">
                        {item.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-green flex-shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-green/20 px-4 py-3 bg-surface/30">
                        <p className="text-sm text-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-12 rounded-lg border border-muted/20 bg-surface/30 p-8 text-center">
        <p className="text-muted mb-4">
          Didn't find what you're looking for?
        </p>
        <a
          href="/getting-started"
          className="display inline-block rounded-lg bg-green px-6 py-3 font-semibold text-dark hover:bg-green-dim transition-colors"
        >
          View Full Getting Started Guide
        </a>
      </div>
    </div>
  );
}

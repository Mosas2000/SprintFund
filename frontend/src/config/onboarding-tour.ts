export interface TourStep {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  action: string;
  targetElement: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  concepts?: DaoConcept[];
}

export interface DaoConcept {
  title: string;
  explanation: string;
  example?: string;
}

export const ONBOARDING_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SprintFund',
    description: 'A decentralized autonomous organization (DAO) platform for collaborative decision-making.',
    tooltip: 'SprintFund enables community members to propose and vote on initiatives using blockchain technology.',
    action: 'Begin Tour',
    targetElement: 'root',
    position: 'center',
    concepts: [
      {
        title: 'What is a DAO?',
        explanation: 'A Decentralized Autonomous Organization where decisions are made collectively by members.',
        example: 'Members vote on fund allocation, policy changes, and strategic initiatives.',
      },
      {
        title: 'How SprintFund Works',
        explanation: 'Members stake tokens to gain voting power and participate in governance.',
        example: 'The more tokens you stake, the more voting power you gain (quadratic voting).',
      },
    ],
  },
  {
    id: 'wallet-connect',
    title: 'Connect Your Wallet',
    description: 'To participate in SprintFund, you need to connect your Stacks wallet.',
    tooltip: 'Your wallet is your identity in the DAO. It holds your tokens and voting records.',
    action: 'Connect Wallet',
    targetElement: 'wallet-connect-button',
    position: 'bottom',
    concepts: [
      {
        title: 'What is a Web3 Wallet?',
        explanation: 'A digital wallet that stores your cryptocurrency and manages your blockchain identity.',
        example: 'Popular Stacks wallets include Hiro Wallet and Leather.',
      },
      {
        title: 'Security',
        explanation: 'Never share your private keys or seed phrases. Your wallet is your responsibility.',
        example: 'Always verify you\'re on the official SprintFund domain before connecting.',
      },
    ],
  },
  {
    id: 'staking',
    title: 'Stake Your STX',
    description: 'Stake STX tokens to gain voting power in the DAO.',
    tooltip: 'Staking demonstrates your commitment to the DAO and gives you influence over decisions.',
    action: 'View Staking',
    targetElement: 'staking-section',
    position: 'top',
    concepts: [
      {
        title: 'STX Token',
        explanation: 'STX is the native token of the Stacks blockchain and represents voting power in SprintFund.',
        example: 'You can acquire STX through exchanges or by participating in network activities.',
      },
      {
        title: 'Quadratic Voting',
        explanation: 'Your voting power increases with the square root of your staked tokens - preventing whale dominance.',
        example: 'If you stake 100 STX, your voting power = √100 = 10 units. If you stake 400 STX, your voting power = √400 = 20 units.',
      },
      {
        title: 'Staking Rewards',
        explanation: 'Earn rewards by helping secure the network and participate in governance.',
        example: 'Your staked STX continues to work for you even while locked in the contract.',
      },
    ],
  },
  {
    id: 'proposals',
    title: 'Browse Active Proposals',
    description: 'Explore proposals being discussed and voted on in the community.',
    tooltip: 'Proposals are the heart of DAO governance. They represent ideas and initiatives being considered.',
    action: 'View Proposals',
    targetElement: 'proposals-nav',
    position: 'bottom',
    concepts: [
      {
        title: 'What is a Proposal?',
        explanation: 'A proposal is a formal suggestion for action presented to the DAO for community vote.',
        example: 'Examples: Increase funding for a project, change contract parameters, or introduce new features.',
      },
      {
        title: 'Proposal Lifecycle',
        explanation: 'Discussion → Voting → Resolution → Implementation',
        example: 'Members discuss, vote during voting period, results are tallied, then executed on-chain.',
      },
      {
        title: 'Proposal Types',
        explanation: 'Different types exist: standard votes, budget allocations, parameter changes, etc.',
        example: 'Check each proposal\'s details to understand its specific implications.',
      },
    ],
  },
  {
    id: 'voting',
    title: 'Cast Your Vote',
    description: 'Vote on proposals using your staked voting power.',
    tooltip: 'Your vote shapes the future direction of the DAO.',
    action: 'Learn About Voting',
    targetElement: 'voting-section',
    position: 'top',
    concepts: [
      {
        title: 'How to Vote',
        explanation: 'Select a proposal, review the details, and submit your vote by choosing For or Against.',
        example: 'Your voting power is proportionally distributed among your selected choices.',
      },
      {
        title: 'Voting Power',
        explanation: 'Your voting power is determined by how much STX you have staked.',
        example: 'A member with 100 staked STX has more voting power than one with 50 staked STX.',
      },
      {
        title: 'Vote Transparency',
        explanation: 'All votes are recorded on the blockchain and publicly verifiable.',
        example: 'You can see voting results and individual vote weights in real-time.',
      },
      {
        title: 'Voting Incentives',
        explanation: 'Active voters contribute to DAO health and may receive recognition or rewards.',
        example: 'High participation demonstrates community engagement and commitment.',
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'Monitor Your Activity',
    description: 'Track your voting history, staked tokens, and DAO participation.',
    tooltip: 'Your dashboard shows your contributions to the DAO at a glance.',
    action: 'View Dashboard',
    targetElement: 'dashboard-nav',
    position: 'bottom',
    concepts: [
      {
        title: 'Voting History',
        explanation: 'See all your past votes and how you contributed to DAO decisions.',
        example: 'Filter votes by date, proposal category, or outcome.',
      },
      {
        title: 'Voting Power Calculation',
        explanation: 'Your voting power is calculated using quadratic voting based on staked amount.',
        example: 'Visit the voting info section for detailed calculation examples.',
      },
    ],
  },
];

export const DAO_CONCEPTS: Record<string, DaoConcept[]> = {
  governance: [
    {
      title: 'Governance',
      explanation: 'The process of making decisions for the DAO through community voting.',
      example: 'Members propose changes, discuss them, and vote on implementation.',
    },
  ],
  voting_power: [
    {
      title: 'Voting Power',
      explanation: 'Your influence in DAO decisions based on staked tokens.',
      example: 'More tokens staked = more voting power, but with quadratic scaling.',
    },
  ],
  tokenomics: [
    {
      title: 'Tokenomics',
      explanation: 'The economic model of the DAO token and incentive structure.',
      example: 'STX holders gain voting rights and potential rewards through participation.',
    },
  ],
  delegation: [
    {
      title: 'Vote Delegation',
      explanation: 'Temporarily transfer your voting power to another community member.',
      example: 'Delegate to experts who align with your values.',
    },
  ],
};

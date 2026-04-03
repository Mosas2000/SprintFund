// Comprehensive component inventory and placement tracker
// Used for migration planning and organization verification

interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  dependencies: string[];
  status: 'migrated' | 'pending' | 'review';
}

export const componentInventory: ComponentInfo[] = [
  // Common Components
  { name: 'CopyButton', category: 'common', description: 'Generic copy-to-clipboard button', dependencies: [], status: 'pending' },
  { name: 'DarkModeToggle', category: 'common', description: 'Dark/light theme toggle', dependencies: [], status: 'pending' },
  { name: 'SearchBar', category: 'common', description: 'Global search input', dependencies: [], status: 'pending' },
  { name: 'BadgeGallery', category: 'common', description: 'Badge display showcase', dependencies: [], status: 'pending' },
  { name: 'CategoryBadge', category: 'common', description: 'Category display badge', dependencies: [], status: 'pending' },
  { name: 'GlassBackground', category: 'common', description: 'Glass morphism background', dependencies: [], status: 'pending' },
  { name: 'DataRefreshIndicator', category: 'common', description: 'Data sync status indicator', dependencies: [], status: 'pending' },
  { name: 'NotificationCenter', category: 'common', description: 'Centralized notifications', dependencies: [], status: 'pending' },

  // Proposal Components
  { name: 'ProposalList', category: 'proposals', description: 'List of governance proposals with pagination', dependencies: ['pagination', 'filters'], status: 'pending' },
  { name: 'ProposalForm', category: 'proposals', description: 'Create new proposal form', dependencies: ['forms'], status: 'pending' },
  { name: 'PaginatedProposalList', category: 'proposals', description: 'Proposal list with pagination controls', dependencies: ['ProposalList'], status: 'pending' },
  { name: 'RelatedProposals', category: 'proposals', description: 'Show related proposals', dependencies: ['ProposalList'], status: 'pending' },
  { name: 'ProposalArchive', category: 'proposals', description: 'Historical proposal archive', dependencies: ['ProposalList'], status: 'pending' },

  // Voting Components
  { name: 'VoteDelegation', category: 'voting', description: 'Vote delegation interface', dependencies: [], status: 'pending' },
  { name: 'DelegatorCard', category: 'voting', description: 'Individual delegator display', dependencies: [], status: 'pending' },
  { name: 'VoterInfluence', category: 'voting', description: 'Voter influence metrics', dependencies: [], status: 'pending' },
  { name: 'VotingProgressBar', category: 'voting', description: 'Voting progress visualization', dependencies: [], status: 'pending' },

  // Dashboard Components
  { name: 'UserDashboard', category: 'dashboard', description: 'Main user dashboard', dependencies: [], status: 'pending' },
  { name: 'UserProfile', category: 'dashboard', description: 'User profile display', dependencies: [], status: 'pending' },
  { name: 'ActivityFeed', category: 'dashboard', description: 'User activity timeline', dependencies: [], status: 'pending' },
  { name: 'AuditTrail', category: 'dashboard', description: 'Action audit trail', dependencies: [], status: 'pending' },

  // Chart Components
  { name: 'CategoryChart', category: 'charts', description: 'Category distribution chart', dependencies: [], status: 'pending' },
  { name: 'SuccessRateChart', category: 'charts', description: 'Proposal success rate visualization', dependencies: [], status: 'pending' },
  { name: 'VotingTrendsChart', category: 'charts', description: 'Voting trends over time', dependencies: [], status: 'pending' },

  // Wallet Components
  { name: 'WalletConnection', category: 'wallet', description: 'Wallet connection interface', dependencies: [], status: 'pending' },

  // Form Components
  { name: 'CreateProposalForm', category: 'forms', description: 'Form for creating proposals', dependencies: [], status: 'pending' },
  { name: 'MarkdownEditor', category: 'forms', description: 'Markdown editor for proposals', dependencies: [], status: 'pending' },
];

export const getComponentsByCategory = (category: string): ComponentInfo[] => {
  return componentInventory.filter(c => c.category === category);
};

export const getComponentsByStatus = (status: string): ComponentInfo[] => {
  return componentInventory.filter(c => c.status === status);
};

export const getCategoryStats = () => {
  const categories = new Set(componentInventory.map(c => c.category));
  const stats: Record<string, { total: number; migrated: number; pending: number; review: number }> = {};

  categories.forEach(cat => {
    const items = getComponentsByCategory(cat);
    stats[cat] = {
      total: items.length,
      migrated: items.filter(i => i.status === 'migrated').length,
      pending: items.filter(i => i.status === 'pending').length,
      review: items.filter(i => i.status === 'review').length,
    };
  });

  return stats;
};

export const getMigrationProgress = () => {
  const total = componentInventory.length;
  const migrated = componentInventory.filter(c => c.status === 'migrated').length;
  const percentage = Math.round((migrated / total) * 100);

  return { total, migrated, pending: total - migrated, percentage };
};

export const getComponentInfo = (name: string): ComponentInfo | undefined => {
  return componentInventory.find(c => c.name === name);
};

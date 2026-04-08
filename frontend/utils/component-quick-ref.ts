// Component organization quick reference
// Fast lookup for component categorization

export const componentQuickRef = {
  'ProposalList': { category: 'proposals', description: 'Governance proposals list' },
  'ProposalForm': { category: 'proposals', description: 'Create proposal form' },
  'ProposalDetails': { category: 'proposals', description: 'Single proposal details' },
  'CreateProposalForm': { category: 'proposals', description: 'Proposal creation interface' },
  'ProposalStatusBadge': { category: 'proposals', description: 'Status indicator for proposals' },
  'ProposalSearch': { category: 'proposals', description: 'Search proposals interface' },
  'ProposalSort': { category: 'proposals', description: 'Sort proposals controls' },
  'VotingProgressBar': { category: 'voting', description: 'Voting progress visualization' },
  'PaginatedProposalList': { category: 'proposals', description: 'Paginated proposal list' },
  'RelatedProposals': { category: 'proposals', description: 'Show related proposals' },

  'VoteDelegation': { category: 'voting', description: 'Vote delegation interface' },
  'DelegatorCard': { category: 'voting', description: 'Delegator profile card' },
  'DelegatorMarketplace': { category: 'voting', description: 'Delegator marketplace' },
  'VoterInfluence': { category: 'voting', description: 'Voting power metrics' },
  'BulkVotingQueue': { category: 'voting', description: 'Batch voting interface' },

  'UserDashboard': { category: 'dashboard', description: 'User main dashboard' },
  'UserProfile': { category: 'dashboard', description: 'User profile page' },
  'ActivityFeed': { category: 'dashboard', description: 'Activity timeline' },
  'UserInsights': { category: 'dashboard', description: 'User analytics and insights' },
  'AuditTrail': { category: 'dashboard', description: 'Audit trail display' },
  'DashboardCustomizer': { category: 'dashboard', description: 'Dashboard layout customizer' },

  'WalletConnection': { category: 'wallet', description: 'Wallet connection UI' },

  'CategoryChart': { category: 'charts', description: 'Category distribution chart' },
  'SuccessRateChart': { category: 'charts', description: 'Success rate visualization' },
  'TreasuryBalanceChart': { category: 'charts', description: 'Treasury balance over time' },
  'ProposerActivityChart': { category: 'charts', description: 'Proposer activity trends' },
  'VotingTrendsChart': { category: 'charts', description: 'Voting trends visualization' },

  'MarkdownEditor': { category: 'forms', description: 'Markdown text editor' },
  'CommentInput': { category: 'forms', description: 'Comment input field' },
  'DateRangeFilter': { category: 'forms', description: 'Date range selection form' },

  'CopyButton': { category: 'common', description: 'Copy to clipboard button' },
  'DarkModeToggle': { category: 'common', description: 'Dark/light theme toggle' },
  'SearchBar': { category: 'common', description: 'Global search input' },
  'BadgeGallery': { category: 'common', description: 'Badge components showcase' },
  'CategoryBadge': { category: 'common', description: 'Category display badge' },
  'CategoryTags': { category: 'common', description: 'Category tags display' },
  'LoadingSkeleton': { category: 'common', description: 'Loading placeholder' },
};

export const getCategoryForComponent = (componentName: string): string | null => {
  const ref = componentQuickRef[componentName as keyof typeof componentQuickRef];
  return ref?.category || null;
};

export const getComponentDescription = (componentName: string): string | null => {
  const ref = componentQuickRef[componentName as keyof typeof componentQuickRef];
  return ref?.description || null;
};

interface ComponentInfo {
  category: string;
  description: string;
}

export const getAllComponentsByCategory = (category: string): Array<[string, ComponentInfo]> => {
  return Object.entries(componentQuickRef).filter(([_, info]) => info.category === category);
};

export const categories = ['common', 'proposals', 'voting', 'dashboard', 'wallet', 'charts', 'forms'];

export const categoryColorMap: Record<string, string> = {
  common: '#6b7280',      // gray
  proposals: '#3b82f6',   // blue
  voting: '#8b5cf6',      // purple
  dashboard: '#10b981',   // emerald
  wallet: '#f59e0b',      // amber
  charts: '#ec4899',      // pink
  forms: '#06b6d4',       // cyan
};

export const getComponentCategory = (component: string): {
  category: string;
  color: string;
  description: string;
} | null => {
  const info = componentQuickRef[component as keyof typeof componentQuickRef];
  if (!info) return null;

  return {
    category: info.category,
    color: categoryColorMap[info.category] || '#9ca3af',
    description: info.description,
  };
};

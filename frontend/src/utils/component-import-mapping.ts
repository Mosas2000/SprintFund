// Component import path reference for easier migration
// Maps old import paths to new organized paths

export const componentImportMapping = {
  // Common components
  'CopyButton': 'components/common',
  'DarkModeToggle': 'components/common',
  'SearchBar': 'components/common',
  'BadgeGallery': 'components/common',
  'CategoryBadge': 'components/common',
  'CategoryTags': 'components/common',
  'GlassBackground': 'components/common',
  'DataRefreshIndicator': 'components/common',
  'NotificationCenter': 'components/common',
  'ToastProvider': 'components/common',

  // Proposal components
  'ProposalList': 'components/proposals',
  'ProposalDetailError': 'components/proposals',
  'ProposalSortbar': 'components/proposals',
  'ProposalLink': 'components/proposals',
  'PaginatedProposalList': 'components/proposals',
  'RelatedProposals': 'components/proposals',
  'ProposalArchive': 'components/proposals',
  'ProposalCollaboration': 'components/proposals',
  'ProposalRevocation': 'components/proposals',
  'ProposalAnalytics': 'components/proposals',

  // Voting components
  'VoteDelegation': 'components/voting',
  'DelegatorCard': 'components/voting',
  'DelegatorMarketplace': 'components/voting',
  'BulkVotingQueue': 'components/voting',
  'VoterInfluence': 'components/voting',
  'DelegationStats': 'components/voting',
  'VotingAnalyticsDashboard': 'components/voting',
  'VotingTrendsChart': 'components/voting',
  'VotingProgressBar': 'components/voting',
  'QuorumMonitor': 'components/voting',

  // Dashboard components
  'UserDashboard': 'components/dashboard',
  'DashboardCustomizer': 'components/dashboard',
  'UserProfile': 'components/dashboard',
  'UserInsights': 'components/dashboard',
  'UserNetwork': 'components/dashboard',
  'ActivityFeed': 'components/dashboard',
  'AuditTrail': 'components/dashboard',
  'PerformanceMetricsPanel': 'components/dashboard',
  'AnalyticsKPIPanel': 'components/dashboard',
  'ImpactAssessment': 'components/dashboard',

  // Wallet components
  'WalletConnection': 'components/wallet',

  // Chart components
  'CategoryChart': 'components/charts',
  'VotingTrendsChart': 'components/charts',
  'TreasuryBalanceChart': 'components/charts',
  'ProposerActivityChart': 'components/charts',
  'SuccessRateChart': 'components/charts',
  'SocialGraph': 'components/charts',
  'EcosystemBenchmarks': 'components/charts',
  'BudgetAllocator': 'components/charts',
  'ExpenseTracker': 'components/charts',

  // Form components
  'CreateProposalForm': 'components/forms',
  'MarkdownEditor': 'components/forms',
  'CommentInput': 'components/forms',
  'DiscussionComment': 'components/forms',
  'DiscussionSearch': 'components/forms',
  'CategoryManager': 'components/forms',
  'DateRangeFilter': 'components/forms',
};

export const getNewImportPath = (componentName: string): string | null => {
  return componentImportMapping[componentName as keyof typeof componentImportMapping] || null;
};

export const generateImportStatement = (componentName: string, destructured = true): string => {
  const path = getNewImportPath(componentName);
  if (!path) return '';

  if (destructured) {
    return `import { ${componentName} } from '${path}';`;
  } else {
    return `import ${componentName} from '${path}/${componentName}';`;
  }
};

export const getAllComponentImports = (): Map<string, string> => {
  return new Map(Object.entries(componentImportMapping));
};

export const getComponentsByNewPath = (path: string): string[] => {
  return Object.entries(componentImportMapping)
    .filter(([_, importPath]) => importPath === path)
    .map(([component]) => component);
};

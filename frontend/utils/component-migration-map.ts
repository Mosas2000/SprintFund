// Migration script helpers for component reorganization
// This helps track which components should be moved where

export const componentMigrationMap = {
  common: {
    description: 'Shared UI components',
    components: [
      'CopyButton.tsx',
      'DarkModeToggle.tsx',
      'SearchBar.tsx',
      'BadgeGallery.tsx',
      'CategoryBadge.tsx',
      'CategoryTags.tsx',
      'GlassBackground.tsx',
      'DataRefreshIndicator.tsx',
      'NotificationCenter.tsx',
      'ToastProvider.tsx',
    ],
  },

  proposals: {
    description: 'Proposal-related components',
    components: [
      'ProposalList.tsx',
      'ProposalDetailError.tsx',
      'ProposalSortbar.tsx',
      'ProposalLink.tsx',
      'PaginatedProposalList.tsx',
      'RelatedProposals.tsx',
      'ProposalArchive.tsx',
      'ProposalCollaboration.tsx',
      'ProposalRevocation.tsx',
      'ProposalAnalytics.tsx',
    ],
  },

  voting: {
    description: 'Voting and delegation components',
    components: [
      'VoteDelegation.tsx',
      'DelegatorCard.tsx',
      'DelegatorMarketplace.tsx',
      'BulkVotingQueue.tsx',
      'VoterInfluence.tsx',
      'DelegationStats.tsx',
      'VotingAnalyticsDashboard.tsx',
      'VotingTrendsChart.tsx',
      'VotingProgressBar.tsx',
      'QuorumMonitor.tsx',
    ],
  },

  dashboard: {
    description: 'Dashboard and user interface components',
    components: [
      'UserDashboard.tsx',
      'DashboardCustomizer.tsx',
      'UserProfile.tsx',
      'UserInsights.tsx',
      'UserNetwork.tsx',
      'ActivityFeed.tsx',
      'AuditTrail.tsx',
      'PerformanceMetricsPanel.tsx',
      'AnalyticsKPIPanel.tsx',
      'ImpactAssessment.tsx',
    ],
  },

  wallet: {
    description: 'Wallet-related components',
    components: [
      'WalletConnection.tsx',
    ],
  },

  charts: {
    description: 'Data visualization components',
    components: [
      'CategoryChart.tsx',
      'VotingTrendsChart.tsx',
      'TreasuryBalanceChart.tsx',
      'ProposerActivityChart.tsx',
      'SuccessRateChart.tsx',
      'SocialGraph.tsx',
      'EcosystemBenchmarks.tsx',
      'BudgetAllocator.tsx',
      'ExpenseTracker.tsx',
    ],
  },

  forms: {
    description: 'Form and input components',
    components: [
      'CreateProposalForm.tsx',
      'MarkdownEditor.tsx',
      'CommentInput.tsx',
      'DiscussionComment.tsx',
      'DiscussionSearch.tsx',
      'CategoryManager.tsx',
      'DateRangeFilter.tsx',
    ],
  },
};

export const getMigrationPath = (componentName: string): string | null => {
  for (const [category, data] of Object.entries(componentMigrationMap)) {
    if (data.components.includes(componentName)) {
      return category;
    }
  }
  return null;
};

export const getTotalComponentsToMigrate = (): number => {
  return Object.values(componentMigrationMap).reduce(
    (total, category) => total + category.components.length,
    0
  );
};

export const getComponentsByCategory = (category: string) => {
  return componentMigrationMap[category as keyof typeof componentMigrationMap]?.components || [];
};

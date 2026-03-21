export const ComponentOrganizationRules = {
  guidelines: {
    singleResponsibility: 'Each component should have one primary responsibility',
    naming: 'Use descriptive PascalCase names that indicate the component purpose',
    location: 'Place components in the directory matching their feature domain',
    exports: 'Always export from the category index.ts file',
    documentation: 'Add JSDoc comments for component props and usage',
    typescript: 'Use TypeScript interfaces for all props',
  },

  directoriesAndPurpose: {
    common: {
      description: 'Shared components used across multiple features',
      examples: ['Badge', 'Button', 'Loading', 'Toast', 'Modal'],
      rules: [
        'No feature-specific logic',
        'Highly reusable',
        'Style-agnostic where possible',
        'Well-documented props',
      ],
    },
    proposals: {
      description: 'All proposal-related components',
      examples: ['ProposalList', 'ProposalForm', 'ProposalCard', 'ProposalDetails'],
      rules: [
        'Imports from proposal types and services',
        'Handles proposal-specific business logic',
        'Can use voting and dashboard components',
      ],
    },
    voting: {
      description: 'Voting and delegation functionality',
      examples: ['VotingForm', 'DelegationCard', 'VotingAnalytics'],
      rules: [
        'Implements voting logic',
        'Handles delegation flows',
        'Integrates with blockchain calls',
      ],
    },
    dashboard: {
      description: 'User dashboard and profile components',
      examples: ['UserPanel', 'StatsCard', 'ActivityFeed'],
      rules: [
        'User-facing interfaces',
        'Aggregates data from multiple sources',
        'Manages user preferences',
      ],
    },
    wallet: {
      description: 'Wallet integration and management',
      examples: ['WalletConnect', 'AddressDisplay'],
      rules: [
        'Integrates with @stacks/connect',
        'Handles wallet state',
        'Secure credential handling',
      ],
    },
    charts: {
      description: 'Data visualization components',
      examples: ['Chart', 'Graph', 'Visualization'],
      rules: [
        'Uses charting libraries',
        'Handles data transformation',
        'Responsive and accessible',
      ],
    },
    forms: {
      description: 'Form and input components',
      examples: ['TextInput', 'FormField', 'FormGroup'],
      rules: [
        'Validation logic',
        'Error handling',
        'Accessibility support',
      ],
    },
    analytics: {
      description: 'Analytics dashboard components',
      examples: ['AnalyticsPanel', 'MetricsDisplay'],
      rules: [
        'Data processing and analysis',
        'Real-time updates',
        'Performance optimized',
      ],
    },
  },

  importPatterns: {
    // Avoid circular imports
    avoidCircular: 'Do not import from parent categories into child components',
    // Use index exports
    useBarrel: 'Import from index.ts, not direct component files',
    // Type-only imports
    typeImports: 'Use "import type" for TypeScript interfaces and types',
  },

  fileNaming: {
    components: 'ComponentName.tsx',
    types: 'types.ts or componentName.types.ts',
    hooks: 'useComponentLogic.ts',
    utils: 'componentUtils.ts',
    index: 'index.ts',
  },

  checklistForNewComponent: [
    '1. Identify the feature domain',
    '2. Choose appropriate directory',
    '3. Create component file with descriptive name',
    '4. Add to category index.ts',
    '5. Add TypeScript types/interfaces',
    '6. Document with JSDoc comments',
    '7. Add to root index.ts if globally used',
    '8. Create tests (if not already done)',
    '9. Update any relevant documentation',
    '10. Verify imports work in consuming code',
  ],
};

export default ComponentOrganizationRules;

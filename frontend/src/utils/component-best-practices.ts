// Component organization best practices and patterns

interface BestPractice {
  name: string;
  description: string;
  correct: string;
  incorrect: string;
  category: string;
}

export const bestPractices: BestPractice[] = [
  {
    name: 'Import from Barrel Files',
    description: 'Use category barrel exports instead of direct file imports',
    correct: `import { ProposalList, ProposalForm } from '@components/proposals';`,
    incorrect: `import ProposalList from '@components/proposals/ProposalList';
import ProposalForm from '@components/proposals/ProposalForm';`,
    category: 'imports',
  },
  {
    name: 'Organize by Feature Domain',
    description: 'Group related components by business domain, not technical type',
    correct: `components/
  proposals/
    ProposalList.tsx
    ProposalForm.tsx
    ProposalDetails.tsx`,
    incorrect: `components/
  lists/
    ProposalList.tsx
  forms/
    ProposalForm.tsx
  details/
    ProposalDetails.tsx`,
    category: 'organization',
  },
  {
    name: 'Maintain Category Independence',
    description: 'Components should not create cross-category dependencies',
    correct: `// In components/proposals
import { CopyButton } from '@components/common';
import { CategoryChart } from '@components/charts';`,
    incorrect: `// In components/proposals
import { UserDashboard } from '@components/dashboard';
import { VoteDelegation } from '@components/voting';`,
    category: 'dependencies',
  },
  {
    name: 'Export via Index Files',
    description: 'Always export components through category index.ts',
    correct: `// components/proposals/index.ts
export { ProposalList } from './ProposalList';
export { ProposalForm } from './ProposalForm';`,
    incorrect: `// Direct imports from component files
// components/proposals/ProposalList.tsx is imported directly`,
    category: 'exports',
  },
  {
    name: 'Co-locate Related Files',
    description: 'Keep hooks, types, and utilities with their components',
    correct: `components/proposals/
  ProposalList.tsx
  useProposalList.ts
  ProposalList.types.ts
  proposal.utils.ts`,
    incorrect: `components/proposals/
  ProposalList.tsx
src/hooks/
  useProposalList.ts
src/types/
  ProposalList.types.ts`,
    category: 'organization',
  },
  {
    name: 'Use TypeScript Path Aliases',
    description: 'Use @components alias for cleaner import paths',
    correct: `import { Component } from '@components/category';`,
    incorrect: `import { Component } from '../../../components/category';
import { Component } from 'frontend/components/category';`,
    category: 'imports',
  },
  {
    name: 'Separate Concerns by Category',
    description: 'Each category should have clear, single responsibility',
    correct: `// ProposalList belongs in @components/proposals
// VoteDelegation belongs in @components/voting
// Both have clear, distinct purposes`,
    incorrect: `// Mixing proposal and voting logic in same component`,
    category: 'architecture',
  },
  {
    name: 'Create Subdirectories Only When Necessary',
    description: 'Keep category structure flat unless 10+ components',
    correct: `components/proposals/
  index.ts
  ProposalList.tsx
  ProposalForm.tsx
  (15+ related components)`,
    incorrect: `components/proposals/
  list/
    ProposalList.tsx
  form/
    ProposalForm.tsx`,
    category: 'organization',
  },
  {
    name: 'Document Component Purpose',
    description: 'Include clear comments on component category purpose',
    correct: `/**
 * @component ProposalList
 * @category proposals
 * @purpose Display and manage list of governance proposals
 * @imports common, charts, forms for UI support
 */`,
    incorrect: `// Component file with no category documentation`,
    category: 'documentation',
  },
  {
    name: 'Avoid Cross-Category State Sharing',
    description: 'Each category manages its own state independently',
    correct: `// Proposal state in proposals/ only
// Voting state in voting/ only
// Share through hooks/context when needed`,
    incorrect: `// Mixed state between proposals and voting
// Circular state dependencies`,
    category: 'state-management',
  },
];

export const getMigrationChecklist = () => {
  return [
    { task: 'Identify component category', done: false },
    { task: 'Check dependencies', done: false },
    { task: 'Move component file', done: false },
    { task: 'Update barrel export', done: false },
    { task: 'Update import statements', done: false },
    { task: 'Update type definitions', done: false },
    { task: 'Move tests if applicable', done: false },
    { task: 'Run type checking', done: false },
    { task: 'Run build', done: false },
    { task: 'Create focused commit', done: false },
  ];
};

export const getNewComponentChecklist = () => {
  return [
    { task: 'Determine correct category', done: false },
    { task: 'Create file in correct category', done: false },
    { task: 'Add component JSDoc with category tag', done: false },
    { task: 'Only import from allowed categories', done: false },
    { task: 'Export from category index.ts', done: false },
    { task: 'Add to barrel export', done: false },
    { task: 'Create co-located hooks if needed', done: false },
    { task: 'Create co-located types if needed', done: false },
    { task: 'Write tests in same directory', done: false },
    { task: 'Update component inventory', done: false },
    { task: 'Run type check and build', done: false },
    { task: 'Commit with clear message', done: false },
  ];
};

export const getCommonMistakes = () => {
  return [
    {
      mistake: 'Importing directly from component file',
      fix: 'Use barrel export from category index.ts',
      impact: 'High - breaks abstraction layer',
    },
    {
      mistake: 'Creating circular dependencies between categories',
      fix: 'Extract shared code to common or utilities',
      impact: 'Critical - prevents compilation',
    },
    {
      mistake: 'Placing component in wrong category',
      fix: 'Use component inventory to verify placement',
      impact: 'Medium - confuses other developers',
    },
    {
      mistake: 'Not exporting from barrel file',
      fix: 'Add export statement to category index.ts',
      impact: 'High - component not accessible',
    },
    {
      mistake: 'Exceeding category dependencies',
      fix: 'Review allowed dependencies in rules',
      impact: 'Medium - architecture violation',
    },
    {
      mistake: 'Deeply nesting subdirectories',
      fix: 'Keep category structure flat',
      impact: 'Low - harder to navigate',
    },
    {
      mistake: 'Mixing concerns in single file',
      fix: 'Co-locate utilities, hooks, and types',
      impact: 'Medium - reduces maintainability',
    },
    {
      mistake: 'Not updating tests after move',
      fix: 'Update import paths and move test files',
      impact: 'High - tests fail',
    },
  ];
};

export const getCategoryGuidelinesForNewDevelopers = () => {
  return {
    common: {
      purpose: 'Reusable UI components with no business logic',
      whenToUse: 'When component is used across multiple features',
      examples: ['Button', 'Badge', 'Input', 'Spinner'],
      dependencies: 'Only ui category',
    },
    proposals: {
      purpose: 'All proposal-related features',
      whenToUse: 'When component is specific to proposal management',
      examples: ['ProposalList', 'ProposalForm', 'ProposalDetails'],
      dependencies: 'common, ui, charts, forms',
    },
    voting: {
      purpose: 'Voting and delegation features',
      whenToUse: 'When component handles voting logic',
      examples: ['VotingForm', 'DelegationPanel', 'VoterList'],
      dependencies: 'common, ui, charts, forms, proposals',
    },
    dashboard: {
      purpose: 'User dashboard and profile pages',
      whenToUse: 'When component is user-specific view',
      examples: ['UserDashboard', 'UserProfile', 'ActivityFeed'],
      dependencies: 'All categories (most flexible)',
    },
    wallet: {
      purpose: 'Wallet integration',
      whenToUse: 'When component involves wallet interaction',
      examples: ['WalletConnection', 'AccountSelector'],
      dependencies: 'Only common, ui',
    },
    charts: {
      purpose: 'Data visualization',
      whenToUse: 'When component displays data graphically',
      examples: ['BarChart', 'LineChart', 'PieChart'],
      dependencies: 'Only common, ui',
    },
    forms: {
      purpose: 'Reusable form components',
      whenToUse: 'When component is generic form element',
      examples: ['TextInput', 'DatePicker', 'Select'],
      dependencies: 'Only common, ui',
    },
  };
};

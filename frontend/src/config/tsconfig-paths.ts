// TypeScript path aliases for easier component imports
// Add this to tsconfig.json under compilerOptions.paths

export const tsConfigPathAliases = {
  '@components/common': ['frontend/components/common'],
  '@components/proposals': ['frontend/components/proposals'],
  '@components/voting': ['frontend/components/voting'],
  '@components/dashboard': ['frontend/components/dashboard'],
  '@components/wallet': ['frontend/components/wallet'],
  '@components/charts': ['frontend/components/charts'],
  '@components/forms': ['frontend/components/forms'],
  '@components/analytics': ['frontend/components/analytics'],
  '@components/ui': ['frontend/components/ui'],
  '@components': ['frontend/components'],
};

export const pathAliasExamples = `
// In tsconfig.json - Add under compilerOptions.paths:
{
  "compilerOptions": {
    "paths": {
      "@components/common": ["frontend/components/common"],
      "@components/proposals": ["frontend/components/proposals"],
      "@components/voting": ["frontend/components/voting"],
      "@components/dashboard": ["frontend/components/dashboard"],
      "@components/wallet": ["frontend/components/wallet"],
      "@components/charts": ["frontend/components/charts"],
      "@components/forms": ["frontend/components/forms"],
      "@components/analytics": ["frontend/components/analytics"],
      "@components/ui": ["frontend/components/ui"],
      "@components": ["frontend/components"]
    }
  }
}

// Usage examples:
import { ProposalList } from '@components/proposals';
import { VoteDelegation } from '@components/voting';
import { UserDashboard } from '@components/dashboard';
import { CopyButton } from '@components/common';

// Or import multiple from same category:
import { ProposalList, ProposalForm } from '@components/proposals';

// Or use root path:
import { ProposalList, VoteDelegation, UserDashboard } from '@components';
`;

export default pathAliasExamples;

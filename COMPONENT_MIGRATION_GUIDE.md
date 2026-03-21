# Component Organization Migration Guide

This guide provides step-by-step instructions for migrating components to the new organized structure.

## Migration Overview

The component organization refactoring moves 138+ components from a flat/mixed structure into a consistent feature-based structure with 8 logical categories.

## Current State

### Before: Mixed Structure
```
components/
  ├── ProposalList.tsx
  ├── CreateProposalForm.tsx
  ├── VoteDelegation.tsx
  ├── UserDashboard.tsx
  ├── activity/
  │   └── RecentActivity.tsx
  ├── proposals/
  │   ├── CategoryTag.tsx
  │   ├── ProposalSearch.tsx
  │   └── VotingProgressBar.tsx
  ├── ui/
  │   ├── LoadingSkeleton.tsx
  │   └── Toast.tsx
  └── wallet/
      └── WalletConnection.tsx
```

### After: Organized Structure
```
components/
  ├── common/
  │   ├── index.ts
  │   ├── CopyButton.tsx
  │   ├── DarkModeToggle.tsx
  │   └── ...
  ├── proposals/
  │   ├── index.ts
  │   ├── ProposalList.tsx
  │   ├── CreateProposalForm.tsx
  │   └── ...
  ├── voting/
  │   ├── index.ts
  │   ├── VoteDelegation.tsx
  │   └── ...
  ├── dashboard/
  │   ├── index.ts
  │   ├── UserDashboard.tsx
  │   └── ...
  ├── wallet/
  │   ├── index.ts
  │   └── WalletConnection.tsx
  ├── charts/
  │   ├── index.ts
  │   ├── CategoryChart.tsx
  │   └── ...
  ├── forms/
  │   ├── index.ts
  │   ├── MarkdownEditor.tsx
  │   └── ...
  ├── analytics/     (existing)
  ├── ui/            (existing)
  └── index.ts       (new root export)
```

## Category Definitions

### 1. Common (`components/common/`)
Reusable UI components with no feature-specific logic.

**Typical components:**
- CopyButton, DarkModeToggle, SearchBar
- BadgeGallery, CategoryBadge, CategoryTags
- GlassBackground, DataRefreshIndicator
- NotificationCenter, ToastProvider

**Rules:**
- No imports from: proposals, voting, dashboard, wallet, charts, forms
- Can import from: ui
- Pure presentational components
- No business logic

**Files to migrate:**
- Common utilities (buttons, badges, indicators)
- Theme toggle
- Search components
- Generic status indicators

### 2. Proposals (`components/proposals/`)
All proposal-related components including creation, display, and management.

**Typical components:**
- ProposalList, ProposalForm, ProposalDetailError
- PaginatedProposalList, RelatedProposals
- ProposalArchive, ProposalCollaboration
- ProposalSortbar, ProposalLink

**Rules:**
- Can import from: common, ui, charts, forms
- No imports from: voting (unless voting is within proposal context)
- Feature-complete proposal management
- Includes forms and displays

**Files to migrate:**
- All proposal-specific components
- Proposal creation forms
- Proposal listing and filtering
- Proposal details and views

### 3. Voting (`components/voting/`)
Voting and delegation components.

**Typical components:**
- VoteDelegation, DelegatorCard, DelegatorMarketplace
- VoterInfluence, DelegationStats
- VotingProgressBar, QuorumMonitor
- BulkVotingQueue, VoterTracking

**Rules:**
- Can import from: common, ui, charts, forms, proposals
- Voting-specific logic and displays
- Delegation management
- Voting history and trends

**Files to migrate:**
- Voting interface components
- Delegation components
- Voter analytics
- Voting progress indicators

### 4. Dashboard (`components/dashboard/`)
User dashboard, profiles, and personal views.

**Typical components:**
- UserDashboard, DashboardCustomizer
- UserProfile, UserInsights, UserNetwork
- ActivityFeed, AuditTrail
- PerformanceMetricsPanel, ImpactAssessment

**Rules:**
- Can import from: common, ui, charts, proposals, voting, forms
- User-centric views
- Profile and personalization
- Activity and audit displays

**Files to migrate:**
- User dashboard components
- User profile pages
- Activity feeds
- Audit trails

### 5. Wallet (`components/wallet/`)
Wallet connection and integration.

**Typical components:**
- WalletConnection (main component)
- Account selector (if present)
- Balance display (if feature-specific)

**Rules:**
- Can import from: common, ui only
- Minimal feature area
- Core wallet integration
- Keep wallet concerns isolated

**Files to migrate:**
- Wallet connection UI
- Account selection
- Wallet status display

### 6. Charts (`components/charts/`)
Data visualization and analytics charts.

**Typical components:**
- CategoryChart, SuccessRateChart
- VotingTrendsChart, TreasuryBalanceChart
- ProposerActivityChart, SocialGraph
- EcosystemBenchmarks, BudgetAllocator

**Rules:**
- Can import from: common, ui only
- Data visualization logic
- Chart configurations
- Analytics displays

**Files to migrate:**
- All chart components
- Data visualization utilities
- Analytics displays

### 7. Forms (`components/forms/`)
Form components and input fields.

**Typical components:**
- CreateProposalForm, MarkdownEditor
- CommentInput, DiscussionComment
- DiscussionSearch, CategoryManager
- DateRangeFilter

**Rules:**
- Can import from: common, ui only
- Reusable form components
- Input fields and editors
- Form-specific logic

**Files to migrate:**
- All form components
- Input fields
- Form helpers
- Text editors

## Migration Steps

### Step 1: Prepare Environment
```bash
git checkout main
git pull origin main
git checkout -b migrate/component-organization
```

### Step 2: Create Directory Structure
The directory structure is already created. Verify with:
```bash
ls -la frontend/components/
```

### Step 3: Identify Components to Move
Use the component inventory to identify which files need migration:
```typescript
import { getComponentsByCategory } from '@/utils/component-inventory';

const proposalComponents = getComponentsByCategory('proposals');
```

### Step 4: Move Individual Components

For each component:

1. Identify its category
2. Check dependencies using the placement validator
3. Move the file
4. Update imports in the component
5. Update barrel exports (index.ts)
6. Update all imports throughout the codebase

Example migration:
```bash
# Move ProposalList.tsx to proposals folder
mv frontend/components/ProposalList.tsx frontend/components/proposals/

# Verify it compiles
npm run build
```

### Step 5: Update Imports

Old import:
```typescript
import { ProposalList } from '../components/ProposalList';
```

New import (option 1 - category path):
```typescript
import { ProposalList } from '../components/proposals';
```

New import (option 2 - using alias):
```typescript
import { ProposalList } from '@components/proposals';
```

### Step 6: Update Barrel Exports

In `frontend/components/proposals/index.ts`, add the export:
```typescript
export { ProposalList } from './ProposalList';
```

### Step 7: Validate with Tools

Use provided utilities to validate placement:
```typescript
import { validateComponentPlacement } from '@/utils/component-placement-validator';
import { analyzeDependencies } from '@/utils/dependency-analyzer';

const validation = validateComponentPlacement(
  { name: 'ProposalList', currentPath: '...', targetPath: 'proposals' },
  ['common', 'forms', 'charts']
);

if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
}
```

### Step 8: Test Imports

After moving each component:
```bash
npm run type-check
npm run build
```

## Recommended Migration Order

### Phase 1: Foundation (Lowest Impact)
1. Common components (no dependencies on others)
2. Wallet components (minimal dependencies)
3. Forms components (only depend on common/ui)

### Phase 2: Core Features
4. Charts components
5. Proposal components
6. Voting components

### Phase 3: Aggregates
7. Dashboard components (depend on many others)
8. Remove old top-level components once all references updated

### Phase 4: Cleanup
9. Remove obsolete files
10. Update all import statements
11. Update documentation

## Import Path Options

### Option 1: Category Paths
```typescript
import { ProposalList } from '@/components/proposals';
import { VoteDelegation } from '@/components/voting';
```

### Option 2: Root Aggregate Path
```typescript
import { ProposalList, VoteDelegation } from '@/components';
```

### Option 3: Direct File Path
```typescript
import ProposalList from '@/components/proposals/ProposalList';
```

## Handling Circular Dependencies

The dependency analyzer identifies circular imports. If detected:

1. Run analysis:
```typescript
import { detectCircularDependencies } from '@/utils/dependency-analyzer';
const cycles = detectCircularDependencies(analysis);
```

2. Break cycles by:
   - Extracting shared logic to common
   - Creating a separate utilities file
   - Restructuring component hierarchy

## Validation Commands

```bash
# Check TypeScript compilation
npm run type-check

# Build the project
npm run build

# Check for circular dependencies (if configured)
npm run circular-deps

# Run tests
npm run test
```

## Rollback Strategy

If issues occur:
```bash
# Revert last commits
git reset --hard HEAD~1

# Or start over with new branch
git checkout main
git pull origin main
git checkout -b migrate/component-organization-v2
```

## Incremental Commit Strategy

Each component migration should be a separate commit:

```bash
# Move one component and commit
git add frontend/components/proposals/ProposalList.tsx
git add frontend/components/proposals/index.ts
git commit -m "Move ProposalList to proposals category"

# Update imports and commit
git add frontend/src/app/page.tsx
git commit -m "Update ProposalList import paths"
```

## Success Criteria

- [ ] All 138+ components organized into categories
- [ ] No broken imports or circular dependencies
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No performance degradation
- [ ] 20+ commits with clear messages

## Troubleshooting

### Issue: Circular dependency detected
**Solution:** Extract shared code to utilities or restructure imports

### Issue: Missing exports in barrel file
**Solution:** Verify all components in category are exported in index.ts

### Issue: Import resolution failures
**Solution:** Check tsconfig.json paths configuration

### Issue: Tests failing after migration
**Solution:** Update test import paths and re-run tests

## Notes

- Backward compatibility: Old imports continue working during migration
- No need to migrate all at once - can be phased
- Use the categorization utilities to guide decisions
- Each commit should be focused on one logical change
- Update documentation as migration progresses

# Component Organization Guide

## Structure

The component directory has been reorganized into a feature-based structure for better maintainability and clarity.

```
components/
├── common/           # Shared, reusable UI components
├── proposals/        # Proposal-specific components
├── voting/          # Voting and delegation components
├── dashboard/       # Dashboard and user interface components
├── wallet/          # Wallet connection and management
├── charts/          # Data visualization components
├── forms/           # Form and input components
├── analytics/       # Analytics dashboard components (pre-existing)
└── ui/              # UI framework components (pre-existing)
```

## Category Descriptions

### common/
**Purpose:** Shared components used across multiple features

**Includes:**
- CopyButton - Copy to clipboard utility
- DarkModeToggle - Theme switcher
- SearchBar - Search interface
- BadgeGallery - Badge collection
- CategoryBadge - Category display badge
- CategoryTags - Tag display component
- GlassBackground - Glass morphism effect
- DataRefreshIndicator - Data update indicator
- NotificationCenter - Notification hub
- ToastProvider - Toast notification provider

### proposals/
**Purpose:** All proposal-related components

**Includes:**
- ProposalList - Main proposal listing
- ProposalDetailError - Error handling for proposal details
- ProposalSortbar - Sorting interface
- ProposalLink - Proposal linking component
- PaginatedProposalList - Paginated proposal display
- RelatedProposals - Related proposals display
- ProposalArchive - Archive management
- ProposalCollaboration - Collaboration tools
- ProposalRevocation - Revocation interface
- ProposalAnalytics - Proposal analytics

### voting/
**Purpose:** Voting and delegation functionality

**Includes:**
- VoteDelegation - Delegation interface
- DelegatorCard - Delegator profile card
- DelegatorMarketplace - Marketplace for delegators
- BulkVotingQueue - Bulk voting interface
- VoterInfluence - Voter influence metrics
- DelegationStats - Delegation statistics
- VotingAnalyticsDashboard - Voting analytics
- VotingTrendsChart - Voting trends visualization
- VotingProgressBar - Vote progress indicator
- QuorumMonitor - Quorum monitoring

### dashboard/
**Purpose:** Dashboard and user-facing components

**Includes:**
- UserDashboard - Main user dashboard
- DashboardCustomizer - Customization interface
- UserProfile - User profile display
- UserInsights - User insights panel
- UserNetwork - User network visualization
- ActivityFeed - Activity feed
- AuditTrail - Audit trail display
- PerformanceMetricsPanel - Performance metrics
- AnalyticsKPIPanel - KPI display
- ImpactAssessment - Impact assessment

### wallet/
**Purpose:** Wallet integration and management

**Includes:**
- WalletConnection - Wallet connection UI

### charts/
**Purpose:** Data visualization components

**Includes:**
- CategoryChart - Category analytics chart
- VotingTrendsChart - Voting trends chart
- TreasuryBalanceChart - Treasury balance chart
- ProposerActivityChart - Proposer activity chart
- SuccessRateChart - Success rate chart
- SocialGraph - Social network graph
- EcosystemBenchmarks - Benchmark charts
- BudgetAllocator - Budget allocation visualization
- ExpenseTracker - Expense tracking chart

### forms/
**Purpose:** Form and input components

**Includes:**
- CreateProposalForm - Proposal creation form
- MarkdownEditor - Markdown editor
- CommentInput - Comment input field
- DiscussionComment - Discussion comment display
- DiscussionSearch - Discussion search
- CategoryManager - Category management form
- DateRangeFilter - Date range selection

### analytics/
**Purpose:** Analytics dashboard and data analysis

**Includes:** (See analytics/index.ts)

### ui/
**Purpose:** Base UI framework components

**Includes:** (Existing structure maintained)

## Migration Path

1. Components are organized by feature domain
2. Each category has an index.ts for barrel exports
3. Import paths have been standardized
4. No breaking changes to component functionality

## Import Examples

### Before (Mixed structure)
```typescript
import ProposalList from '../components/ProposalList';
import VoteDelegation from '../components/VoteDelegation';
import UserDashboard from '../components/UserDashboard';
```

### After (Organized structure)
```typescript
import { ProposalList } from '../components/proposals';
import { VoteDelegation } from '../components/voting';
import { UserDashboard } from '../components/dashboard';
```

## Benefits

1. **Clarity** - Clear purpose for each directory
2. **Maintainability** - Related components grouped together
3. **Scalability** - Easy to add new features or components
4. **Discoverability** - Easier to find components
5. **Consistency** - Standardized structure across codebase
6. **Collaboration** - Clearer organization for team onboarding

## Guidelines for New Components

1. Identify the feature domain
2. Place the component in the appropriate directory
3. Add export to the index.ts file
4. Update documentation if needed
5. Keep component focused and single-responsibility

## Related Documentation

See COMPONENT_ORGANIZATION.md for detailed component inventory and mapping.

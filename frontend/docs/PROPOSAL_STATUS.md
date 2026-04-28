# Proposal Status System

This document describes the proposal status system that provides clear visual indicators for different proposal states.

## Status Types

The system distinguishes between the following proposal states:

### Active
- **Description**: Proposal is currently open for voting
- **Criteria**: Voting period has not ended, proposal not executed
- **Visual**: Blue badge
- **User Action**: Can vote on the proposal

### Passing
- **Description**: Proposal currently has more votes for than against
- **Criteria**: Has votes and votes-for > votes-against
- **Visual**: Green badge
- **User Action**: Can continue voting

### Failing
- **Description**: Proposal currently has more votes against than for
- **Criteria**: Has votes and votes-against > votes-for
- **Visual**: Yellow badge
- **User Action**: Can continue voting

### Executable
- **Description**: Proposal passed and is ready to be executed
- **Criteria**: Voting ended, passed, timelock period completed
- **Visual**: Green badge
- **User Action**: Proposer can execute

### Executed
- **Description**: Proposal has been executed and funds distributed
- **Criteria**: executed flag is true
- **Visual**: Green badge
- **User Action**: None (final state)

### Expired
- **Description**: Voting period ended without passing
- **Criteria**: Voting ended, did not pass or no votes
- **Visual**: Gray badge
- **User Action**: None (final state)

## Implementation

### Core Functions

Located in `frontend/src/lib/proposal-status.ts`:

- `getProposalStatus(proposal, currentBlockHeight)`: Returns status info
- `isProposalActive(proposal, currentBlockHeight)`: Check if voting is active
- `isProposalExecutable(proposal, currentBlockHeight)`: Check if can be executed
- `getTimeRemaining(proposal, currentBlockHeight)`: Calculate time left
- `formatTimeRemaining(proposal, currentBlockHeight)`: Format time display

### React Hook

`useProposalStatus(proposal)` - Automatically fetches current block height and returns status info

### Components

- `ProposalStatusBadge`: Displays status with appropriate styling
- Used in: ProposalCard, ProposalDetail pages

### Filtering

The FilterDropdown component supports filtering by all status types:
- All Proposals
- Active
- Passing
- Failing
- Executable
- Executed
- Expired

## Block Height Calculations

The system uses block heights to determine proposal state:

- **Voting Period**: 432 blocks (~3 days at 10 min/block)
- **Timelock**: Applied to high-value proposals
- **Current Block**: Fetched via `useCurrentBlockHeight` hook

## Usage Example

```typescript
import { useProposalStatus } from '@/hooks/useProposalStatus';
import { ProposalStatusBadge } from '@/components/ProposalStatusBadge';

function MyComponent({ proposal }) {
  const statusInfo = useProposalStatus(proposal);
  
  if (!statusInfo) return null;
  
  return (
    <div>
      <ProposalStatusBadge statusInfo={statusInfo} />
      <p>{statusInfo.description}</p>
    </div>
  );
}
```

## Testing

Tests are located in `frontend/src/lib/proposal-status.test.ts` and cover:
- All status transitions
- Edge cases (no votes, tied votes)
- Time calculations
- Block height boundaries

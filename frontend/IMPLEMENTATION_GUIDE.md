# TypeScript Implementation Guidelines

This document provides step-by-step guidance for implementing changes while maintaining type safety.

## 1. Component Props

### Before (Untyped)
```typescript
function ProposalCard(props: any) {
  const { proposal } = props;
  return <div>{proposal.title}</div>;
}
```

### After (Typed)
```typescript
import type { Proposal } from '../types';

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  return <div>{proposal.title}</div>;
};
```

## 2. API Data Handling

### Before (Untyped)
```typescript
const raw = await readOnly('get-proposal', [...]);
const proposal = {
  id: raw.id,
  title: raw.title as string,
  votesFor: raw['votes-for'] as number,
};
```

### After (Typed & Validated)
```typescript
import { validateRawProposal, rawProposalToProposal } from '../lib/validators';

const raw = await readOnly<Record<string, unknown>>('get-proposal', [...]);
const validated = validateRawProposal(raw);
if (!validated) return null;
const proposal = rawProposalToProposal(id, validated);
```

## 3. Filtering & Sorting

### Before (Untyped)
```typescript
const filtered = proposals.filter(p => p.executed === false);
const sorted = filtered.sort((a, b) => b.createdAt - a.createdAt);
```

### After (Typed with Utilities)
```typescript
import { filterProposalsByStatus, sortProposals } from '../lib/proposal-utils';

const filtered = filterProposalsByStatus(proposals, 'active');
const sorted = sortProposals(filtered, 'newest');
```

## 4. Calculations

### Before (Untyped Math)
```typescript
const total = proposal.votesFor + proposal.votesAgainst;
const percent = (proposal.votesFor / total) * 100;
```

### After (Typed Utility)
```typescript
import { calculateTotalVotes, calculateForPercentage } from '../lib/proposal-utils';

const total = calculateTotalVotes(proposal);
const percent = calculateForPercentage(proposal);
```

## 5. Type Guards

### Before (Runtime Check with Type Assertion)
```typescript
if (data && data.id) {
  const proposal = data as Proposal;
}
```

### After (Proper Type Guard)
```typescript
import { isValidProposal, narrowProposal } from '../lib/type-guards';

if (isValidProposal(data)) {
  // TypeScript now knows data is Proposal
  console.log(data.title);
}

// Or use narrow function:
const proposal = narrowProposal(data);
if (proposal) {
  console.log(proposal.title);
}
```

## 6. API Response Handling

### Before (Any Types)
```typescript
const response: any = await fetch('/api/proposals');
const proposals = response.data;
```

### After (Typed)
```typescript
import type { FetchProposalsResponse } from '../types';
import { isSuccessResponse } from '../types';

const response = (await fetch('/api/proposals').then(r => r.json())) as unknown;
if (isSuccessResponse<{ proposals: Proposal[] }>(response)) {
  const proposals = response.data.proposals;
}
```

## 7. Type Enrichment

### Before (Adding Fields Manually)
```typescript
const enriched = {
  ...proposal,
  totalVotes: proposal.votesFor + proposal.votesAgainst,
  isActive: !proposal.executed,
};
```

### After (Using Utility)
```typescript
import { enrichProposal } from '../lib/proposal-utils';

const enriched = enrichProposal(proposal);
```

## 8. Safe Conversions

### Before (Type Assertions)
```typescript
const proposals = (data as Proposal[]).filter(p => p.executed === false);
```

### After (Safe Conversion with Type Checking)
```typescript
import { filterValidProposals } from '../lib/type-guards';

const proposals = filterValidProposals(data);
```

## 9. Voting Operations

### Before (No Type Safety)
```typescript
const canVote = userStake > 0 && !proposal.executed;
const votingPower = Math.sqrt(userStake);
```

### After (Typed Utilities)
```typescript
import { canUserVote, calculateVotingPower } from '../lib/voting-stake-utils';

const canVote = canUserVote(proposal, userStake);
const votingPower = calculateVotingPower(userStake);
```

## 10. STX Formatting

### Before (No Formatting)
```typescript
const display = (stxAmount / 1_000_000).toFixed(2) + ' STX';
```

### After (Utility Function)
```typescript
import { formatStxAmount } from '../lib/voting-stake-utils';

const display = formatStxAmount(stxAmount);
```

## Common Patterns

### Pattern 1: Validate then Use
```typescript
const raw = await api.call();
const validated = validateRawProposal(raw);
if (!validated) throw new Error('Invalid proposal data');
return rawProposalToProposal(id, validated);
```

### Pattern 2: Filter then Map
```typescript
const proposals = filterValidProposals(data)
  .map(p => enrichProposal(p))
  .sort((a, b) => b.createdAt - a.createdAt);
```

### Pattern 3: Guard then Access
```typescript
if (isValidProposal(value)) {
  console.log(value.title); // TypeScript knows it's safe
}
```

### Pattern 4: Narrow with Utility
```typescript
const proposal = narrowProposal(unknownValue);
if (proposal) {
  // Use proposal knowing it's valid
}
```

## Testing Tips

### Test Valid Data
```typescript
const valid = { id: 1, title: '..', ... };
expect(isValidProposal(valid)).toBe(true);
```

### Test Invalid Data
```typescript
expect(isValidProposal({ ...valid, id: 'invalid' })).toBe(false);
```

### Test Conversion
```typescript
const proposal = narrowProposal(unknownData);
expect(proposal?.id).toBe(expectedId);
```

## Key Takeaways

1. **Always validate at API boundaries** - Use validators when receiving data
2. **Use type utilities instead of inline logic** - More readable and consistent
3. **Prefer type guards over assertions** - Safer and self-documenting
4. **Export focused types** - Import what you need, not everything
5. **Test predicates thoroughly** - They protect your runtime safety
6. **Document complex types** - Use JSDoc comments on interfaces
7. **Keep utilities pure** - No side effects in type functions
8. **Use narrow functions** - Safer than type assertions

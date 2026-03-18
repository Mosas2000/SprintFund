# Type System Examples

This file contains practical examples of using the TypeScript type system in SprintFund.

## Example 1: Fetching and Validating Proposals

```typescript
import { Proposal } from '../types';
import { validateRawProposal, rawProposalToProposal } from '../lib/validators';
import { enrichProposal } from '../lib/proposal-utils';

async function getProposalWithStats(id: number): Promise<Proposal | null> {
  try {
    const raw = await readOnly('get-proposal', [uintCV(id)]);
    if (!raw) return null;

    // Validate the raw data
    const validated = validateRawProposal(raw);
    if (!validated) return null;

    // Convert to normalized form
    const proposal = rawProposalToProposal(id, validated);

    // Enrich with statistics
    return enrichProposal(proposal);
  } catch (err) {
    console.error('Failed to fetch proposal:', err);
    return null;
  }
}
```

## Example 2: Type-Safe Filtering and Sorting

```typescript
import { filterProposalsByStatus, sortProposals } from '../lib/proposal-utils';
import type { Proposal } from '../types';

function getRecentActiveProposals(proposals: Proposal[]): Proposal[] {
  return sortProposals(
    filterProposalsByStatus(proposals, 'active'),
    'newest'
  );
}
```

## Example 3: Type Guard Usage

```typescript
import { isValidProposal, narrowProposal } from '../lib/type-guards';
import type { Proposal } from '../types';

function processData(data: unknown): void {
  const proposal = narrowProposal(data);
  if (proposal) {
    console.log(`Processing proposal: ${proposal.title}`);
  } else {
    console.error('Invalid proposal data');
  }
}
```

## Example 4: Result Type Pattern

```typescript
import { success, error, chain, Result } from '../lib/type-helpers';
import type { Proposal } from '../types';

function validateAndCreate(data: unknown): Result<Proposal> {
  if (!isValidProposal(data)) {
    return error('Invalid proposal structure');
  }

  if (data.title.length < 3) {
    return error('Title too short');
  }

  return success(data);
}

// Usage with chaining
const result = validateAndCreate(proposalData);
const enrichedResult = chain(result, (p) => success(enrichProposal(p)));
```

## Example 5: API Response Handling

```typescript
import { isSuccessResponse, isErrorResponse } from '../types';
import type { FetchProposalsResponse } from '../types';

async function fetchProposals(page: number): Promise<void> {
  const response = (await fetch(`/api/proposals?page=${page}`).then((r) => r.json())) as unknown;

  if (isErrorResponse(response)) {
    console.error(`API error: ${response.error}`);
    return;
  }

  if (!isSuccessResponse<{ proposals: Proposal[] }>(response)) {
    console.error('Invalid response structure');
    return;
  }

  const { proposals } = response.data;
  console.log(`Loaded ${proposals.length} proposals`);
}
```

## Example 6: Storage with TTL

```typescript
import { PersistentCache } from '../lib/typed-storage';
import type { Proposal } from '../types';

const cache = new PersistentCache();

// Store with 1 hour TTL
cache.set<Proposal>('proposal_1', proposal, 3600);

// Retrieve
const cached = cache.get<Proposal>('proposal_1');
```

## Example 7: Pagination

```typescript
import { PaginationHelper } from '../lib/type-helpers';

const pagination = new PaginationHelper(100, 10); // 100 items, 10 per page

console.log(pagination.getTotalPages()); // 10
console.log(pagination.getRange(2)); // [10, 19]
console.log(pagination.isValidPage(3)); // true
console.log(pagination.isValidPage(11)); // false
```

## Example 8: Governance Analysis

```typescript
import {
  calculateProposalStats,
  buildVoterProfile,
  analyzeVotingPowerDistribution,
} from '../lib/governance-utils';

// Calculate overall stats
const stats = calculateProposalStats(proposals);
console.log(`${stats.activeCount} active proposals`);

// Build voter profile
const profile = buildVoterProfile(voterAddress, votes);
console.log(`Voter prefers: ${profile.preferredSupport}`);

// Analyze power distribution
const distribution = analyzeVotingPowerDistribution(votes);
console.log(`Power concentration: ${distribution.concentration}%`);
```

## Example 9: Component Props

```typescript
import type { Proposal } from '../types';
import { isValidProposal } from '../lib/type-guards';

interface ProposalCardProps {
  proposal: Proposal;
  onSelect?: (id: number) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onSelect }) => {
  return (
    <div onClick={() => onSelect?.(proposal.id)}>
      <h3>{proposal.title}</h3>
      <p>{proposal.description}</p>
    </div>
  );
};
```

## Example 10: Logging

```typescript
import { logger, TypedTimer } from '../lib/typed-logger';

const timer = new TypedTimer('fetch-proposals');

try {
  logger.info('Fetching proposals', { page: 1 });
  const proposals = await fetchProposals();

  timer.mark('parsing');

  const result = parseProposals(proposals);

  const duration = timer.end();
  logger.info('Proposals fetched successfully', {
    count: result.length,
    duration,
  });
} catch (err) {
  logger.error('Failed to fetch proposals', err as Error, { page: 1 });
}
```

## Best Practices

1. **Always validate at API boundaries** - Use validators for external data
2. **Use type guards before unsafe access** - Never use type assertions
3. **Prefer Result types for error handling** - More expressive than exceptions
4. **Cache computed values** - Use TypeCache for expensive operations
5. **Log with context** - Include relevant metadata in logs
6. **Use specific types** - Narrow down to specific types as soon as possible
7. **Handle null explicitly** - Use `| null` in return types
8. **Share types across modules** - Define once, import everywhere

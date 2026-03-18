# TypeScript Types Usage Guide

## Quick Start

### Import Types
```typescript
import type {
  Proposal,
  ProposalPage,
  StakeInfo,
} from '../types';

import type {
  RawProposal,
  RawStake,
  ProposalResponse,
  StakeResponse,
} from '../types/contract';
```

### Use Type-Safe Functions

#### Reading Proposal Data
```typescript
import { getProposal, getAllProposals } from '../lib/stacks';

// Fully typed
const proposal: Proposal | null = await getProposal(123);
if (proposal) {
  console.log(proposal.title); // string
  console.log(proposal.votesFor); // number
}

// Paginated results
const page: ProposalPage = await getProposalsPage({ page: 1, pageSize: 10 });
page.proposals.forEach((p: Proposal) => {
  // All properties are typed
});
```

#### Reading Stake Data
```typescript
import { getStake, getMinStakeAmount } from '../lib/stacks';

const stakeAmount: number = await getStake(walletAddress);
const minStake: number = await getMinStakeAmount();

if (stakeAmount < minStake) {
  console.log('Need to stake more');
}
```

### Validation with Zod

```typescript
import {
  validateProposalZod,
  validateRawProposalZod,
  validateStakeAmountZod,
} from '../lib/validators-zod';

const validated = validateProposalZod(unknownData);
if (validated) {
  // Type narrowed to Proposal
  console.log(validated.id);
} else {
  console.error('Invalid proposal data');
}
```

### Type Guards

```typescript
import {
  isValidProposal,
  isValidProposalPage,
  filterValidProposals,
  narrowProposal,
} from '../lib/type-guards';

// Type guard
if (isValidProposal(data)) {
  // data is typed as Proposal here
  console.log(data.title);
}

// Filter
const validProposals = filterValidProposals(unknownArray);
// validProposals: Proposal[]

// Narrow safely
const proposal = narrowProposal(data);
if (proposal) {
  console.log(proposal.title);
}
```

### Contract Response Handlers

```typescript
import { ContractResponseHandler } from '../lib/contract-helpers';

// Safe extraction
const count = ContractResponseHandler.extractProposalCount(response);
const stake = ContractResponseHandler.extractStakeAmount(response);

// Validate structure
if (ContractResponseHandler.isValidProposalResponse(data)) {
  const proposal: RawProposal = data;
}
```

### Transaction Building

```typescript
import { TransactionBuilder } from '../lib/contract-helpers';

try {
  const amount = TransactionBuilder.buildStakeAmount(100);
  const title = TransactionBuilder.buildProposalTitle(userTitle);
  const description = TransactionBuilder.buildProposalDescription(userDesc);

  // All validated
  await callCreateProposal(amount, title, description, callbacks);
} catch (err) {
  console.error('Validation failed:', err.message);
}
```

### Type-Safe Collections

```typescript
import {
  ProposalCollection,
  ProposalAggregator,
  ProposalFilterBuilder,
} from '../lib/type-collection-utils';

// Collection
const collection = new ProposalCollection();
collection.add(...proposals);

const active = collection.getActive(); // Proposal[]
const byProposer = collection.getByProposer(address); // Proposal[]

// Aggregation
const avgVotes = ProposalAggregator.averageVotes(proposals);
const totalFunding = ProposalAggregator.totalFundingRequested(proposals);
const distribution = ProposalAggregator.votingDistribution(proposals);

// Filtering with builder
const filter = new ProposalFilterBuilder()
  .withStatus('active')
  .withMinVotes(10)
  .withProposer(address);

const filtered = proposals.filter(filter.build());
```

### Component Props

```typescript
interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = memo(function ProposalCard({
  proposal,
}: ProposalCardProps): JSX.Element {
  // proposal is fully typed
  return (
    <div>
      <h2>{proposal.title}</h2>
      <p>Votes For: {proposal.votesFor}</p>
    </div>
  );
});
```

### API Response Handling

```typescript
import type { Result } from '../types/api-response';
import { isSuccessResponse, extractResultData } from '../types/api-response';

// Type-safe result handling
const result: Result<Proposal> = await fetchProposal(id);

if (isSuccessResponse(result)) {
  const proposal = result.data; // Proposal
} else {
  const message = result.error.message; // string
}

// Or extract with error throwing
try {
  const proposal = extractResultData(result);
} catch (err) {
  console.error(err.message);
}
```

### Cache Management

```typescript
import { ProposalCache } from '../lib/type-collection-utils';

const cache = new ProposalCache(60_000); // 60 second TTL

// Store
cache.set(proposal.id, proposal);

// Retrieve
const cached = cache.get(123);
if (cached !== null) {
  // cached: Proposal
}

// Cleanup
const removed = cache.cleanExpired();
```

### Error Recovery

```typescript
import { ErrorRecovery } from '../lib/contract-helpers';

// Check if retryable
if (ErrorRecovery.isRetryable(error)) {
  const delay = ErrorRecovery.getRetryDelay(attemptNumber);
  await new Promise(r => setTimeout(r, delay));
  // Retry operation
}

// Check for auth errors
if (ErrorRecovery.isAuthError(error)) {
  // Redirect to wallet connection
}
```

### Strict Type Checking

Enable in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true
  }
}
```

### Common Patterns

#### Safe Data Transformation
```typescript
function transformProposal(raw: unknown): Proposal | null {
  const validated = validateProposalZod(raw);
  if (!validated) return null;
  return normalized;
}
```

#### Type-Safe Map Operations
```typescript
const proposalMap = new Map<number, Proposal>();

function getProposalById(id: number): Proposal | undefined {
  return proposalMap.get(id);
}
```

#### Type-Safe Array Filtering
```typescript
const activeProposals: Proposal[] = proposals.filter(
  (p): p is Proposal => !p.executed
);
```

#### Exhaustive Checks
```typescript
function getStatusLabel(proposal: Proposal): string {
  if (proposal.executed) return 'Executed';
  if (proposal.votesFor > proposal.votesAgainst) return 'Passing';
  return 'Failing';
}
```

### Best Practices

1. **Always use type guards before casting**
   ```typescript
   // Good
   if (isValidProposal(data)) {
     const proposal: Proposal = data;
   }

   // Avoid
   const proposal = data as Proposal;
   ```

2. **Use Result type for API responses**
   ```typescript
   // Good
   type FetchResult = Result<Proposal>;

   // Avoid
   type FetchResult = Proposal | Error;
   ```

3. **Validate at API boundaries**
   ```typescript
   const response = await fetch('/api/proposal');
   const data = await response.json();
   const validated = validateProposalZod(data);
   ```

4. **Use collection classes for type safety**
   ```typescript
   // Good
   const collection = new ProposalCollection();
   const filtered = collection.getActive();

   // Less safe
   const filtered = proposals.filter(p => !p.executed);
   ```

5. **Leverage type narrowing**
   ```typescript
   function process(data: unknown): void {
     const narrowed = narrowProposal(data);
     if (narrowed) {
       // narrowed is Proposal here
     }
   }
   ```

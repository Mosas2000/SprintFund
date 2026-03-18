# TypeScript Types System

## Overview

This document describes the comprehensive TypeScript type system for SprintFund, ensuring type safety across all contract interactions and API responses.

## Type Organization

### Contract Layer (`src/types/contract.ts`)

Types representing raw Clarity contract data and responses.

- **ClarityWrappedValue<T>**: Wraps values in `{ value: T }` pattern
- **ClarityValue<T>**: Union of wrapped or unwrapped Clarity values
- **RawProposal**: Raw on-chain proposal tuple from `proposals` map
- **RawStake**: Raw on-chain stake tuple from `stakes` map
- **RawVote**: Raw on-chain vote tuple from `votes` map
- **ReadOnlyResult<T>**: Result of read-only function call (value or null)
- **RawReadOnlyResponse<T>**: Generic response wrapper for flexible API returns

### Application Layer

#### Proposals (`src/types/proposal.ts`)

Normalized proposal types for application use:

- **Proposal**: Core normalized proposal data
- **ProposalWithStats**: Proposal with derived statistics (totalVotes, percentages)
- **ProposalPage**: Paginated proposal response
- **ProposalQueryOptions**: Query filters and options
- **CreateProposalInput**: Form input for proposal creation

#### Voting (`src/types/voting.ts`)

Voting-related types:

- **VoteInput**: User vote with proposal ID, support flag, and weight
- **VoteRecord**: Recorded vote with voter address
- **UserVotingHistory**: User's voting history with total count
- **VotingStats**: Aggregated voting statistics

#### Stake (`src/types/stake.ts`)

Staking-related types:

- **StakeInfo**: User's current stake amount
- **StakeInput**: Stake creation request
- **MinStakeInfo**: Minimum stake requirement
- **StakeHistoryEntry**: Historical stake action

## Validation Strategy

### Runtime Validation (`src/lib/validators.ts`)

All contract data is validated at the API boundary using validators:

```typescript
// Example: Validating a raw proposal
const raw = await readOnly('get-proposal', [...]);
const validated = validateRawProposal(raw);
if (!validated) return null;

// Then convert to normalized form
const proposal = rawProposalToProposal(id, validated);
```

### Validators Available

- `unwrapClarityValue(value)`: Extract wrapped values
- `validateRawProposal(raw)`: Validate proposal data
- `validateRawStake(raw)`: Validate stake data
- `validateRawVote(raw)`: Validate vote data
- `validateCreateProposalInput(input)`: Validate form input
- `validateProposalCount(raw)`: Validate count responses
- `validateStxAmount(value)`: Validate STX amounts
- `isProposal(value)`: Type guard for Proposal
- `isProposalArray(value)`: Type guard for Proposal arrays

## Usage Patterns

### In Components

Component prop types should use normalized types:

```typescript
interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  // ...
};
```

### In API Functions

Read-only functions should return validated, normalized types:

```typescript
export async function getProposal(id: number): Promise<Proposal | null> {
  const raw = await readOnly(...);
  const validated = validateRawProposal(raw);
  if (!validated) return null;
  return rawProposalToProposal(id, validated);
}
```

### Type Guards

Use type guards for runtime checks:

```typescript
if (isProposal(data)) {
  // data is now typed as Proposal
  console.log(data.title);
}

if (isProposalArray(proposals)) {
  // proposals is now typed as Proposal[]
}
```

## Error Handling

### Contract Errors

Use the error type hierarchy:

```typescript
import type { ContractError, NetworkError } from '../types';
import { getErrorMessage } from '../types';

try {
  // contract call
} catch (err) {
  const message = getErrorMessage(err, 'Transaction failed');
  // handle error
}
```

### Error Codes

Contract error codes are mapped in `CONTRACT_ERROR_CODES`:

```typescript
import { CONTRACT_ERROR_CODES } from '../types';

// 100 = ERR-NOT-AUTHORIZED
// 101 = ERR-PROPOSAL-NOT-FOUND
// 102 = ERR-INSUFFICIENT-STAKE
// etc.
```

##Type Exports

All types are re-exported through `src/types.ts` for convenience:

```typescript
import type {
  Proposal,
  ProposalPage,
  VoteInput,
  StakeInfo,
  RawProposal,
} from '../types';
```

## TypeScript Configuration

### Strict Mode

Strict mode is enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Type Safety Benefits

1. **Compile-time checking**: Catch errors before runtime
2. **IDE autocomplete**: Better DX with full type information
3. **Refactoring safety**: Rename/restructure with confidence
4. **Documentation**: Types serve as self-documenting code
5. **Runtime validation**: Validators ensure data integrity

## Migration Guide

### Old Pattern (Anti-pattern)

```typescript
// Avoid: Using `any`
const raw = await readOnly<any>('get-proposal', [...]);
const proposal = {
  id: raw.id as number,
  title: raw.title as string, // loses type safety
};
```

### New Pattern

```typescript
// Preferred: Using validators and types
const raw = await readOnly<Record<string, unknown>>('get-proposal', [...]);
const validated = validateRawProposal(raw);
if (!validated) return null;
return rawProposalToProposal(id, validated);
```

## Testing

Type tests verify that type definitions match expected shapes:

- `validators.test.ts`: Runtime validation logic
- `proposal.test.ts`: Proposal type structures
- `voting-stake.test.ts`: Voting and stake type structures
- `contract.test.ts`: Contract-level types and error handling

Run tests with: `npm test`

## Future Improvements

1. Add JSON Schema validation integration
2. Implement OpenAPI/GraphQL schema generation
3. Add zodvalidation library integration
4. Create base types for other blockchain data
5. Add type docs generator for API reference

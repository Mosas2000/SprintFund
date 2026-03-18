# TypeScript Types Directory

This directory contains all TypeScript type definitions and related utilities for SprintFund.

## Directory Structure

### Type Definition Files (`src/types/`)

- **`proposal.ts`** - Normalized application proposal types
- **`contract.ts`** - Raw contract data types from Stacks
- **`voting.ts`** - Voting-related types
- **`stake.ts`** - Staking operation types
- **`api.ts`** - API request/response types
- **`realtime.ts`** - WebSocket and real-time update types
- **`index.ts`** - Re-exports all types for convenience

### Type Utilities (`src/lib/`)

- **`validators.ts`** - Runtime validation for contract data
- **`type-converters.ts`** - Convert between raw and normalized types
- **`type-guards.ts`** - Type predicates and narrowing functions
- **`proposal-utils.ts`** - Proposal calculation helpers
- **`voting-stake-utils.ts`** - Voting and stake calculation helpers

### Barrel Export

- **`src/lib/types/index.ts`** - Central export for all type utilities

### Main Export

- **`src/types.ts`** - Main re-export file for all types and some utilities

## Quick Start

### Import Types

```typescript
import type {
  Proposal,
  ProposalPage,
  StakeInfo,
  VoteRecord,
} from '../types';
```

### Import Utilities

```typescript
import {
  validateRawProposal,
  isValidProposal,
  enrichProposal,
  calculateVotingPower,
} from '../lib/types';
```

### Validate Data

```typescript
const raw = await getProposalRaw();
const validated = validateRawProposal(raw);
if (!validated) return null;
const proposal = rawProposalToProposal(id, validated);
```

### Use Type Guards

```typescript
if (isValidProposal(value)) {
  console.log(value.title); // TypeScript knows it's safe
}
```

## Type System Overview

### Layer 1: Raw Contract Data

Types that represent data directly from the blockchain:
- `RawProposal`, `RawStake`, `RawVote`
- Field names use kebab-case (Clarity convention)
- Values may be wrapped in `{ value: T }`

### Layer 2: API Responses

Types for API request/response contracts:
- `FetchProposalsRequest`, `FetchProposalsResponse`
- `CreateProposalRequest`, `CreateProposalResponse`
- `VoteRequest`, `VoteResponse`

### Layer 3: Normalized Application Data

Types used throughout the application:
- `Proposal` - normalized proposal with camelCase fields
- `StakeInfo`, `VoteRecord` - individual records
- `ProposalPage` - paginated responses

### Layer 4: Derived Data

Types with added computed fields:
- `ProposalWithStats` - includes totalVotes, percentages, etc.
- Statistics and enriched data types

## Validation Flow

```
Raw Contract Data
      ↓
   Validate (validators.ts)
      ↓
   Convert (type-converters.ts)
      ↓
Normalized Application Type
      ↓
   Enrich (proposal-utils.ts)
      ↓
Typed Application Data
```

## Type Safety Checklist

- ✅ No `any` types in new code
- ✅ All API data validated at boundaries
- ✅ Type guards used before accessing unknown data
- ✅ Errors handled with proper types
- ✅ Components have typed props
- ✅ All public functions have return types

## Documentation Files

- **`TYPES.md`** - Comprehensive type system documentation
- **`IMPLEMENTATION_GUIDE.md`** - Step-by-step patterns
- **`ERROR_HANDLING.md`** - Error types and patterns
- **`MIGRATION_CHECKLIST.md`** - Migration from untyped code

## Testing

All types have corresponding test files:
- `src/types/proposal.test.ts`
- `src/types/contract.test.ts`
- `src/types/api.test.ts`
- `src/types/realtime.test.ts`
- `src/lib/validators.test.ts`
- `src/lib/type-guards.test.ts`
- `src/lib/type-converters.test.ts`
- `src/lib/proposal-utils.test.ts`
- `src/lib/voting-stake-utils.test.ts`

Run all tests: `npm test`

## Contributing

When adding new types:

1. **Create the type file** in `src/types/`
2. **Add validation** in `src/lib/` if needed
3. **Create tests** alongside type definitions
4. **Update exports** in `src/types.ts`
5. **Document** in `TYPES.md`
6. **Add examples** to `IMPLEMENTATION_GUIDE.md`

## Versioning

Types follow semantic versioning:
- **Major**: Breaking changes to type structure
- **Minor**: New types or fields added
- **Patch**: Documentation or test changes

## Future Improvements

- [ ] Integrate with API schema generation
- [ ] Generate types from contract ABIs
- [ ] Add GraphQL types support
- [ ] Create type validation middleware
- [ ] Build type documentation site

## Support

For questions about types:
1. Check `TYPES.md` for comprehensive docs
2. See `IMPLEMENTATION_GUIDE.md` for patterns
3. Review `ERROR_HANDLING.md` for error types
4. Check test files for usage examples

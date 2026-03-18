# TypeScript Migration Checklist

Use this checklist when migrating code to use TypeScript types and validators.

## Pre-Migration Review

- [ ] Identify all `any` types in file
- [ ] List all functions that return or accept untyped data
- [ ] Check for `as` type assertions without validation
- [ ] Review all API calls and response handling
- [ ] Find all array iterations without type safety

## Type Imports

- [ ] Import necessary types from `../types`
- [ ] Import validators from `../lib/validators`
- [ ] Import type guards from `../lib/type-guards`
- [ ] Import utilities from `../lib/proposal-utils`
- [ ] Import error utilities from contract types

## Function Signatures

- [ ] Replace `any` parameters with proper types
- [ ] Add return types (not just JSDoc)
- [ ] Update async function return types
- [ ] Add type arguments to generic functions
- [ ] Type component props interfaces

## Validation

- [ ] Add validation at API boundaries
- [ ] Replace unsafe `as` casts with validators
- [ ] Use type guards before accessing properties
- [ ] Validate form inputs before use
- [ ] Check array contents with `filterValid*` utilities

## Component Updates

- [ ] Add `Props` interface with types
- [ ] Update hook return type annotations
- [ ] Type component state carefully
- [ ] Add types to callbacks and event handlers
- [ ] Ensure ref types are correct

## Error Handling

- [ ] Use `getErrorMessage` for error extraction
- [ ] Add error type guards
- [ ] Provide fallback error messages
- [ ] Log errors with full context
- [ ] Update error boundaries with types

## Testing

- [ ] Type test inputs and outputs
- [ ] Add tests for validators
- [ ] Add tests for type guards
- [ ] Test error conditions
- [ ] Add integration tests with real types

## Documentation

- [ ] Add JSDoc comments to public APIs
- [ ] Document return types in comments
- [ ] Update README with type examples
- [ ] Add inline comments for complex types
- [ ] Document breaking changes

## Code Review Checklist

- [ ] All `any` types removed
- [ ] Type assertions validated with guards
- [ ] Error handling uses proper types
- [ ] Tests cover type scenarios
- [ ] Documentation updated
- [ ] No unused type imports
- [ ] Consistent naming conventions
- [ ] Types exported correctly

## Common Problems and Fixes

### Problem: "Type is not assignable"

```typescript
// ❌ Wrong
const proposal: Proposal = raw;

// ✅ Correct
const validated = validateRawProposal(raw);
if (!validated) return null;
const proposal = rawProposalToProposal(id, validated);
```

### Problem: "Cannot access property 'x' of 'any'"

```typescript
// ❌ Wrong
const title = response.data.title;

// ✅ Correct
if (isSuccessResponse(response)) {
  const title = response.data.title;
}
```

### Problem: "Parameter implicitly has 'any' type"

```typescript
// ❌ Wrong
function process(data) { ... }

// ✅ Correct
function process(data: unknown): Result { ... }
```

### Problem: "Type assertion with 'as'"

```typescript
// ❌ Wrong
const proposal = raw as Proposal;

// ✅ Correct
const proposal = narrowProposal(raw);
if (!proposal) return null;
// use proposal
```

## Validation Quick Reference

```typescript
// Single value validators
validateRawProposal(raw)
validateRawStake(raw)
validateRawVote(raw)
validateCreateProposalInput(input)
validateProposalCount(raw)
validateStxAmount(value)

// Type guards
isValidProposal(value)
isValidProposalPage(value)
isValidStakeInfo(value)
isValidVoteRecord(value)
isValidPrincipal(address)
isValidTxId(txId)

// Safe narrowing
narrowProposal(value)
narrowProposalPage(value)
narrowStakeInfo(value)

// Filtering
filterValidProposals(array)
filterValidVotes(array)
```

## Files to Check

- [ ] `frontend/src/lib/stacks.ts` - API layer
- [ ] `frontend/src/components/**/*.tsx` - UI components
- [ ] `frontend/src/hooks/**/*.ts` - Custom hooks
- [ ] `frontend/src/store/**/*.ts` - State management
- [ ] `frontend/src/pages/**/*.tsx` - Page components
- [ ] `frontend/utils/**/*.ts` - Utility functions

## Dependencies Updated

- ✅ `@stacks/transactions` - Clarity value handling
- ✅ `@stacks/connect` - Wallet connection
- ✅ TypeScript compiler - Latest version
- ✅ Type definition packages - All latest

## Sign-Off

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Ready for merge

## Post-Migration

- [ ] Monitor production errors
- [ ] Collect user feedback
- [ ] Fix any discovered issues
- [ ] Add to documentation any learnings
- [ ] Plan next migration phase

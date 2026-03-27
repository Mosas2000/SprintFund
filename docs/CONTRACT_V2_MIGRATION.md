# SprintFund Core V2 Migration Guide

## Overview

SprintFund Core V2 is a major upgrade that addresses security vulnerabilities and adds governance improvements. This guide covers the differences between V1 and V2 and how to migrate.

## Breaking Changes

### 1. Vote Cost Deduction
In V1, quadratic voting cost was checked but never deducted. In V2, the vote cost is tracked and deducted from your available stake balance.

```clarity
;; V2: Cost is deducted from available stake
(map-set vote-costs
  { staker: tx-sender }
  { total-cost: (+ (get total-cost current-vote-costs) vote-cost) })
```

**Migration Impact**: Users need sufficient stake for vote costs. Available stake = total stake - vote costs used.

### 2. Stake Lockup After Voting
In V2, stake is locked for ~1 day (144 blocks) after voting to prevent vote manipulation.

**Migration Impact**: Plan withdrawals around voting activity.

### 3. Proposer-Only Execution
Only the proposal creator can execute their proposal after voting ends.

**Migration Impact**: Third parties cannot trigger execution.

### 4. Treasury Funding Required
Proposals can only be created if the treasury has sufficient balance to fund them.

**Migration Impact**: Treasury must be funded before proposals can be created.

## New Features

### Proposal Deadlines
Proposals have a voting period of ~3 days (432 blocks). After this period:
- No more votes can be cast
- Proposal can be executed (if passed)

### Quorum Requirement
10% of total staked tokens must participate for execution to succeed.

### High-Value Proposal Timelock
Proposals requesting ≥100 STX have an additional ~1 day (144 blocks) timelock before execution.

### Proposal Cancellation
Proposers can cancel their proposals during the voting period.

### Treasury Management
- `deposit-treasury`: Add STX to the DAO treasury
- Treasury balance is checked before proposal creation
- Execution transfers funds from treasury, not arbitrary contract balance

### Admin Functions
Contract owner can:
- `set-min-stake-amount`: Update minimum stake requirement
- `transfer-ownership`: Transfer ownership to new address

### Event Emissions
All major actions emit events for off-chain indexing:
- `stake` / `unstake`
- `proposal-created` / `proposal-cancelled` / `proposal-executed`
- `vote`
- `treasury-deposit`
- `min-stake-updated` / `ownership-transferred`

## Error Codes Reference

| Code | Name | Description |
|------|------|-------------|
| u100 | NOT-AUTHORIZED | Caller lacks permission |
| u101 | PROPOSAL-NOT-FOUND | Invalid proposal ID |
| u102 | INSUFFICIENT-STAKE | Not enough stake/available balance |
| u103 | ALREADY-EXECUTED | Proposal already executed |
| u104 | ALREADY-VOTED | User already voted on this proposal |
| u105 | VOTING-PERIOD-ENDED | Voting period has passed |
| u106 | VOTING-PERIOD-ACTIVE | Voting still in progress |
| u107 | QUORUM-NOT-MET | Insufficient voter participation |
| u109 | AMOUNT-TOO-HIGH | Proposal exceeds max (1000 STX) |
| u110 | ZERO-AMOUNT | Zero amount not allowed |
| u111 | INSUFFICIENT-BALANCE | Treasury lacks funds |
| u113 | PROPOSAL-CANCELLED | Proposal was cancelled |
| u114 | STAKE-LOCKED | Stake locked after voting |
| u115 | TIMELOCK-ACTIVE | High-value proposal timelock |

## Migration Steps

### For Users
1. No action required for existing stakes
2. Be aware of new lockup periods when planning withdrawals
3. Vote costs now affect available stake balance

### For Proposers
1. Ensure treasury is funded before creating proposals
2. Keep proposals under 1000 STX limit
3. High-value proposals (≥100 STX) have additional timelock

### For Integrators
1. Update contract address to V2
2. Update ABIs for new function signatures
3. Subscribe to print events for indexing
4. Handle new error codes in frontend

## Deployment

1. Deploy `sprintfund-core-v2.clar` to network
2. Fund treasury with `deposit-treasury`
3. Update frontend to point to new contract
4. Users migrate stakes to V2 contract

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| VOTING-PERIOD-BLOCKS | 432 | ~3 days voting window |
| TIMELOCK-BLOCKS | 144 | ~1 day high-value delay |
| HIGH-VALUE-THRESHOLD | 100 STX | Timelock trigger |
| QUORUM-PERCENTAGE | 10% | Minimum participation |
| MAX-PROPOSAL-AMOUNT | 1000 STX | Per-proposal limit |
| STAKE-LOCKUP-BLOCKS | 144 | ~1 day post-vote lock |

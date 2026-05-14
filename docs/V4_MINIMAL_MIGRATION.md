# V4-Minimal Migration Guide

## Overview

SprintFund has been upgraded from V3 to V4-Minimal with critical security fixes and optimizations. This guide helps users and developers understand the changes and migration path.

## Contract Details

### V3 (Legacy)
- **Address**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3`
- **Status**: Deprecated
- **Deployment Cost**: 0.08058 STX

### V4-Minimal (Current)
- **Address**: `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal`
- **Status**: Active
- **Deployment Cost**: 0.76 STX (763,226 microSTX)
- **Deployment Date**: May 14, 2026

## What Changed

### Security Fixes (10 Critical Issues Resolved)

1. **Vote Cost Deduction** ✅
   - **V3 Issue**: Vote costs were only checked, not deducted
   - **V4 Fix**: Vote costs are properly deducted from available stake
   - **Impact**: Prevents unlimited voting with same stake

2. **Double-Vote Prevention** ✅
   - **V3 Issue**: No check for existing votes
   - **V4 Fix**: `ERR-ALREADY-VOTED` enforced
   - **Impact**: One vote per user per proposal

3. **Execution Authorization** ✅
   - **V3 Issue**: Anyone could execute any proposal
   - **V4 Fix**: Only proposer can execute their proposal
   - **Impact**: Prevents unauthorized fund transfers

4. **Voting Period Limits** ✅
   - **V3 Issue**: Infinite voting period
   - **V4 Fix**: 3-day voting period (432 blocks)
   - **Impact**: Proposals have clear deadlines

5. **Quorum Requirements** ✅
   - **V3 Issue**: No minimum participation
   - **V4 Fix**: 10% of total staked STX required
   - **Impact**: Ensures community engagement

6. **Stake Lockup** ✅
   - **V3 Issue**: No stake lockup after voting
   - **V4 Fix**: 1-day lockup (144 blocks) after voting
   - **Impact**: Prevents vote manipulation

7. **Amount Validation** ✅
   - **V3 Issue**: 0 STX or unlimited amounts allowed
   - **V4 Fix**: 1-1000 STX range enforced
   - **Impact**: Prevents abuse and ensures micro-grant focus

8. **Timelock for High-Value Proposals** ✅
   - **V3 Issue**: No delay for large transfers
   - **V4 Fix**: 1-day timelock for proposals ≥100 STX
   - **Impact**: Community can react to large proposals

9. **Event Emissions** ✅
   - **V3 Issue**: No event logging
   - **V4 Fix**: Events emitted for all actions
   - **Impact**: Better tracking and transparency

10. **Vote Cost Reclaim** ✅
    - **V3 Issue**: Vote costs locked forever
    - **V4 Fix**: `reclaim-vote-cost` function added
    - **Impact**: Users can reclaim vote costs after voting ends

### New Features

- **Available Stake Query**: `get-available-stake(staker)` - Check stake after vote costs
- **Vote Details Query**: `get-vote(proposal-id, voter)` - Get vote information
- **Quorum Query**: `get-required-quorum()` - Check current quorum requirement
- **Total Staked Query**: `get-total-staked()` - See total STX in contract
- **Version Query**: `get-version()` - Returns `4` for V4-Minimal

### Removed Features (from V4-Full)

V4-Minimal is an optimized version that removes advanced features to reduce deployment cost:

- ❌ Proposal Templates
- ❌ Milestone Tracking
- ❌ Voting Delegation
- ❌ Reputation System

These features may be added in future versions if needed.

## Data Structure Changes

### Proposal Structure

**V3 Proposal:**
```clarity
{
  proposer: principal,
  amount: uint,
  title: (string-utf8 100),
  description: (string-utf8 500),
  votes-for: uint,
  votes-against: uint,
  executed: bool,
  created-at: uint
}
```

**V4-Minimal Proposal:**
```clarity
{
  proposer: principal,
  amount: uint,
  title: (string-utf8 100),
  description: (string-utf8 500),
  votes-for: uint,
  votes-against: uint,
  executed: bool,
  created-at: uint,
  voting-ends-at: uint,        // NEW
  execution-allowed-at: uint   // NEW
}
```

### Stake Structure

**V3 Stake:**
```clarity
{ amount: uint }
```

**V4-Minimal Stake:**
```clarity
{
  amount: uint,
  locked-until: uint  // NEW
}
```

### Vote Structure

**V3 Vote:**
```clarity
{
  weight: uint,
  support: bool
}
```

**V4-Minimal Vote:**
```clarity
{
  weight: uint,
  support: bool,
  cost-paid: uint  // NEW
}
```

## Migration Steps

### For Users

1. **Existing Stakes**
   - V3 stakes remain in V3 contract
   - Withdraw from V3 before staking in V4
   - No automatic migration

2. **Existing Proposals**
   - V3 proposals remain in V3 contract
   - Complete V3 proposals before migrating
   - Start fresh proposals in V4

3. **Voting**
   - Vote on V3 proposals using V3 contract
   - Vote on V4 proposals using V4 contract
   - Cannot mix contracts

### For Developers

1. **Update Contract Address**
   ```typescript
   // Old
   const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
   const CONTRACT_NAME = 'sprintfund-core-v3';
   
   // New
   const CONTRACT_ADDRESS = 'SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60';
   const CONTRACT_NAME = 'sprintfund-core-v4-minimal';
   ```

2. **Update Type Definitions**
   ```typescript
   interface Proposal {
     id: number;
     proposer: string;
     amount: number;
     title: string;
     description: string;
     votesFor: number;
     votesAgainst: number;
     executed: boolean;
     createdAt: number;
     votingEndsAt: number;        // NEW
     executionAllowedAt: number;  // NEW
   }
   ```

3. **Handle New Error Codes**
   ```typescript
   const V4_ERRORS = {
     ERR_VOTING_PERIOD_ENDED: 105,
     ERR_VOTING_PERIOD_ACTIVE: 106,
     ERR_QUORUM_NOT_MET: 107,
     ERR_AMOUNT_TOO_LOW: 108,
     ERR_AMOUNT_TOO_HIGH: 109,
     ERR_ZERO_AMOUNT: 110,
     ERR_STAKE_LOCKED: 114,
     ERR_TIMELOCK_ACTIVE: 115,
   };
   ```

4. **Update Contract Calls**
   ```typescript
   // Check if voting period ended
   if (currentBlock > proposal.votingEndsAt) {
     // Voting closed
   }
   
   // Check if execution allowed
   if (currentBlock >= proposal.executionAllowedAt) {
     // Can execute
   }
   
   // Reclaim vote cost after voting ends
   await reclaimVoteCost(proposalId);
   ```

## Testing Checklist

- [ ] Stake STX in V4 contract
- [ ] Create proposal with valid amount (1-1000 STX)
- [ ] Vote on proposal (verify cost deduction)
- [ ] Try to vote twice (should fail)
- [ ] Wait for voting period to end
- [ ] Reclaim vote cost
- [ ] Execute proposal as proposer
- [ ] Try to execute as non-proposer (should fail)
- [ ] Withdraw stake after lockup period

## Governance Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Voting Period | 432 blocks (~3 days) | Time to vote on proposals |
| Timelock | 144 blocks (~1 day) | Delay for high-value proposals |
| High-Value Threshold | 100 STX | Triggers timelock |
| Quorum | 10% of total staked | Minimum participation |
| Min Proposal Amount | 1 STX | Minimum funding request |
| Max Proposal Amount | 1000 STX | Maximum funding request |
| Stake Lockup | 144 blocks (~1 day) | Lock period after voting |
| Min Stake | 10 STX | Required to create proposals |

## FAQ

### Can I migrate my V3 stake to V4?
No automatic migration. Withdraw from V3, then stake in V4.

### What happens to my V3 proposals?
They remain in V3 contract. Complete them there.

### Can I vote on both V3 and V4 proposals?
Yes, but with separate stakes in each contract.

### Why was the deployment cost higher for V4?
V4 includes more security logic and features, increasing contract size.

### Will there be a V5?
Possibly, if community needs advanced features (templates, delegation, etc.).

### How do I reclaim my vote costs?
Call `reclaim-vote-cost(proposal-id)` after voting period ends.

### What if I try to execute before timelock expires?
Transaction fails with `ERR-TIMELOCK-ACTIVE`.

### Can I withdraw stake immediately after voting?
No, wait for 1-day lockup period to expire.

## Support

- **GitHub Issues**: [SprintFund Issues](https://github.com/Mosas2000/SprintFund/issues)
- **Contract Explorer**: [View V4-Minimal](https://explorer.hiro.so/txid/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal?chain=mainnet)
- **Documentation**: [README.md](../README.md)

## Timeline

- **V3 Deployment**: January 20, 2026
- **V4-Minimal Deployment**: May 14, 2026
- **V3 Deprecation**: May 14, 2026
- **V3 Sunset**: TBD (after all proposals completed)

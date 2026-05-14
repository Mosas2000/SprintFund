---
title: "Frontend Contract Integration Updates for V4"
labels: frontend, integration, breaking-change, critical
assignees: 
milestone: V4 Migration
---

## Description

Update frontend to integrate with V4 contract, including new features and security improvements. This is a breaking change requiring comprehensive updates across the application.

## Contract Address Updates

### Files to Update

- [ ] `frontend/config.ts` - Update CONTRACT_NAME to 'sprintfund-core-v4'
- [ ] `frontend/.env.example` - Update default contract name
- [ ] `frontend/src/config/stacks-network.ts` - Verify network configuration
- [ ] `contract-config.json` - Update centralized config
- [ ] `Clarinet.toml` - Add V4 contract configuration

### Configuration Changes

```typescript
// frontend/config.ts
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'sprintfund-core-v4';
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
```

## API Integration Updates

### New Read-Only Functions

Add to `frontend/src/lib/stacks.ts`:

```typescript
// Template functions
export async function getTemplate(templateId: number): Promise<Template | null>
export async function getAllTemplates(): Promise<Template[]>
export async function getTemplateCount(): Promise<number>

// Milestone functions
export async function getMilestone(proposalId: number, milestoneIndex: number): Promise<Milestone | null>
export async function getAllMilestones(proposalId: number): Promise<Milestone[]>

// Delegation functions
export async function getDelegation(delegator: string): Promise<Delegation | null>
export async function getDelegatedPower(delegate: string): Promise<DelegationPower | null>

// Reputation functions
export async function getReputation(address: string): Promise<number>
export async function getEffectiveVotingPower(address: string, baseWeight: number): Promise<number>

// Enhanced read functions
export async function getAvailableStake(address: string): Promise<number>
export async function canExecute(proposalId: number): Promise<boolean>
export async function isVotingEnded(proposalId: number): Promise<boolean>
export async function getRequiredQuorum(): Promise<number>
```

### New Write Functions

```typescript
// Template management (admin only)
export function callCreateTemplate(name: string, description: string, minAmount: number, maxAmount: number, requiredMilestones: number, cb: TxCallbacks): void

// Milestone management
export function callAddMilestone(proposalId: number, description: string, amount: number, cb: TxCallbacks): void
export function callCompleteMilestone(proposalId: number, milestoneIndex: number, cb: TxCallbacks): void

// Delegation
export function callDelegateVotingPower(delegate: string, cb: TxCallbacks): void
export function callRevokeDelegation(cb: TxCallbacks): void

// Proposal management
export function callCancelProposal(proposalId: number, cb: TxCallbacks): void
```

## Type Definitions

### New Types

Add to `frontend/src/types/index.ts`:

```typescript
export interface Template {
  id: number;
  name: string;
  description: string;
  suggestedAmountMin: number;
  suggestedAmountMax: number;
  requiredMilestones: number;
  active: boolean;
  createdBy: string;
}

export interface Milestone {
  proposalId: number;
  index: number;
  description: string;
  amount: number;
  completed: boolean;
  completedAt?: number;
  verifiedBy?: string;
}

export interface Delegation {
  delegator: string;
  delegate: string;
  delegatedAt: number;
  active: boolean;
}

export interface DelegationPower {
  delegate: string;
  totalDelegated: number;
}

export interface ReputationInfo {
  address: string;
  score: number;
  level: string;
  votingPowerBonus: number;
}
```

### Updated Types

```typescript
export interface Proposal {
  id: number;
  proposer: string;
  amount: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  cancelled: boolean;  // NEW
  createdAt: number;
  votingEndsAt: number;  // NEW
  executionAllowedAt: number;  // NEW
  templateId?: number;  // NEW
  milestoneCount: number;  // NEW
  milestonesCompleted: number;  // NEW
  category?: string;
}

export interface StakeInfo {
  amount: number;
  lockedUntil: number;  // NEW
  reputationScore: number;  // NEW
}

export interface VoteRecord {
  proposalId: number;
  voter: string;
  weight: number;
  support: boolean;
  costPaid: number;  // NEW
  votedAt: number;  // NEW
}
```

## Component Updates

### Critical Updates

1. **`CreateProposalForm.tsx`**
   - [ ] Add template selection step
   - [ ] Add milestone creation interface
   - [ ] Update amount validation (1-1000 STX)
   - [ ] Show voting period information
   - [ ] Display timelock warning for high-value proposals

2. **`ProposalList.tsx`**
   - [ ] Display milestone progress
   - [ ] Show voting deadline countdown
   - [ ] Display proposer reputation
   - [ ] Show template badge if used
   - [ ] Add cancelled proposal indicator

3. **`UserDashboard.tsx`**
   - [ ] Show reputation score and level
   - [ ] Display delegation status
   - [ ] Show locked stake amount
   - [ ] Display voting power with bonus
   - [ ] Show vote cost tracking

4. **`VotingInterface`** (in ProposalList.tsx)
   - [ ] Display effective voting power with reputation bonus
   - [ ] Show vote cost deduction
   - [ ] Display stake lockup warning
   - [ ] Show voting deadline
   - [ ] Prevent double voting

5. **`ExecuteProposal.tsx`**
   - [ ] Restrict to proposer only
   - [ ] Check voting period ended
   - [ ] Check timelock passed
   - [ ] Display quorum status
   - [ ] Show execution requirements

### New Components to Create

- [ ] `TemplateSelector.tsx` - Template selection interface
- [ ] `MilestoneTracker.tsx` - Milestone progress display
- [ ] `MilestoneForm.tsx` - Add milestone interface
- [ ] `DelegationPanel.tsx` - Delegation management
- [ ] `ReputationBadge.tsx` - Reputation display
- [ ] `CancelProposalButton.tsx` - Cancel proposal action
- [ ] `VotingDeadline.tsx` - Countdown timer
- [ ] `QuorumIndicator.tsx` - Quorum progress bar

## Validation Updates

### Add to `frontend/src/lib/validators.ts`

```typescript
export function validateTemplate(raw: unknown): Template | null
export function validateMilestone(raw: unknown): Milestone | null
export function validateDelegation(raw: unknown): Delegation | null
export function validateReputationScore(score: number): number
export function validateProposalAmount(amount: number): boolean {
  return amount >= 1_000_000 && amount <= 1_000_000_000; // 1-1000 STX
}
```

## Error Handling

### Add to `frontend/src/lib/error-normalizer.ts`

```typescript
const ERROR_MESSAGES = {
  // ... existing errors
  116: 'Invalid template',
  117: 'Milestone not found',
  118: 'Milestone already completed',
  119: 'Delegation already exists',
  120: 'Invalid delegate address',
};
```

## Caching Strategy

### Add to `frontend/src/lib/blockchain-cache.ts`

```typescript
class BlockchainCache {
  // ... existing methods
  
  // Template caching (1 hour)
  getTemplate(templateId: number): Template | null
  setTemplate(templateId: number, template: Template): void
  
  // Milestone caching (5 minutes)
  getMilestone(proposalId: number, index: number): Milestone | null
  setMilestone(proposalId: number, index: number, milestone: Milestone): void
  
  // Delegation caching (5 minutes)
  getDelegation(delegator: string): Delegation | null
  setDelegation(delegator: string, delegation: Delegation): void
  
  // Reputation caching (10 minutes)
  getReputation(address: string): number | null
  setReputation(address: string, score: number): void
}
```

## Testing Requirements

### Update Existing Tests

- [ ] Update all contract address references
- [ ] Update proposal structure tests
- [ ] Update stake structure tests
- [ ] Update vote structure tests

### New Tests

- [ ] Template integration tests
- [ ] Milestone tracking tests
- [ ] Delegation flow tests
- [ ] Reputation calculation tests
- [ ] Vote cost deduction tests
- [ ] Voting deadline tests
- [ ] Quorum validation tests
- [ ] Execution restriction tests

### Test Files to Update

- `tests/integration.test.ts` - Update for V4 contract
- `frontend/src/lib/stacks.test.ts` - Add new function tests
- `frontend/components/CreateProposalForm.test.tsx` - Update for new features
- `frontend/components/ProposalList.test.tsx` - Update for new features

## Migration Checklist

- [ ] Update contract address in all configs
- [ ] Add new API functions
- [ ] Update type definitions
- [ ] Create new components
- [ ] Update existing components
- [ ] Add validators
- [ ] Update error handling
- [ ] Implement caching
- [ ] Update tests
- [ ] Update documentation
- [ ] Test on testnet
- [ ] Deploy to production

## Breaking Changes

1. **Proposal Structure Changed**
   - Added: `cancelled`, `votingEndsAt`, `executionAllowedAt`, `templateId`, `milestoneCount`, `milestonesCompleted`
   - Impact: All proposal-related code must be updated

2. **Stake Structure Changed**
   - Added: `lockedUntil`, `reputationScore`
   - Impact: Stake display and withdrawal logic must be updated

3. **Vote Structure Changed**
   - Added: `costPaid`, `votedAt`
   - Impact: Vote tracking and cost calculation must be updated

4. **Execution Restrictions**
   - Only proposer can execute
   - Impact: ExecuteProposal component must check proposer

5. **Amount Validation**
   - Min: 1 STX, Max: 1000 STX
   - Impact: Form validation must be updated

## Acceptance Criteria

- [ ] All contract address references updated
- [ ] All new API functions implemented
- [ ] All type definitions updated
- [ ] All new components created
- [ ] All existing components updated
- [ ] All validators implemented
- [ ] All error codes handled
- [ ] Caching implemented
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Testnet deployment successful
- [ ] Production deployment successful

## Related Issues

- #1 Critical Security Vulnerabilities in V3 Contract
- #2 Implement Proposal Templates System
- #3 Implement Milestone Tracking System
- #4 Implement Voting Power Delegation System
- #5 Implement Reputation System

## References

- V4 Contract: `contracts/sprintfund-core-v4.clar`
- Frontend Config: `frontend/config.ts`
- API Layer: `frontend/src/lib/stacks.ts`
- Types: `frontend/src/types/index.ts`

# SprintFund Architecture

This document provides a technical overview of the SprintFund DAO platform architecture.

## System Overview

SprintFund is a decentralized governance platform built on the Stacks blockchain, enabling community-driven funding decisions through transparent proposal and voting mechanisms.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Dashboard │  │Proposals │  │  Voting  │  │ Wallet Connect   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Stacks Connect SDK                          │
│              (Wallet Authentication & TX Signing)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Stacks Blockchain                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              sprintfund-core-v4-minimal.clar               │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │ │
│  │  │ Staking │  │Proposals│  │ Voting  │  │  Execution   │   │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────────┘   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │ │
│  │  │Timelock │  │ Quorum  │  │Vote Cost│  │ Stake Lockup │   │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  sprintfund-logger.clar                     │ │
│  │              (Event Logging & Analytics)                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── error-boundaries/ # Error handling components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── services/           # API and blockchain services
│   ├── spa-pages/          # Page components
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript type definitions
├── components/             # Legacy components
├── providers/              # React context providers
└── utils/                  # Utility functions
```

### State Management

```
┌──────────────────────────────────────────────────────────────┐
│                     Zustand Stores                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │   Wallet   │  │  Proposals │  │     Notifications      │  │
│  │   Store    │  │   Store    │  │        Store           │  │
│  └─────┬──────┘  └─────┬──────┘  └───────────┬────────────┘  │
│        │               │                      │               │
│        ▼               ▼                      ▼               │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │ Selectors  │  │ Selectors  │  │      Selectors         │  │
│  └────────────┘  └────────────┘  └────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Proposal Lifecycle

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│  Stake  │────▶│  Create  │────▶│  Vote   │────▶│ Timelock │────▶│ Execute  │
│   STX   │     │ Proposal │     │ (3 days)│     │ (if ≥100)│     │          │
└─────────┘     └──────────┘     └─────────┘     └──────────┘     └──────────┘
     │               │                │               │               │
     ▼               ▼                ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Smart Contract State                                 │
│  stakes-map    proposals-map    votes-map    vote-costs-map    executed-map │
└─────────────────────────────────────────────────────────────────────────────┘
```

### User Flow: Creating a Proposal

```
User                    Frontend                Smart Contract
  │                        │                          │
  │  1. Connect Wallet     │                          │
  │───────────────────────▶│                          │
  │                        │                          │
  │  2. Stake STX          │                          │
  │───────────────────────▶│  3. Call stake()         │
  │                        │─────────────────────────▶│
  │                        │                          │
  │  4. Fill Form          │                          │
  │───────────────────────▶│                          │
  │                        │                          │
  │  5. Submit             │  6. Call create-proposal()
  │───────────────────────▶│─────────────────────────▶│
  │                        │                          │
  │  7. Confirmation       │  8. TX Confirmed         │
  │◀───────────────────────│◀─────────────────────────│
```

### User Flow: Voting

```
User                    Frontend                Smart Contract
  │                        │                          │
  │  1. View Proposal      │                          │
  │───────────────────────▶│  2. Read proposal data   │
  │                        │─────────────────────────▶│
  │                        │◀─────────────────────────│
  │                        │                          │
  │  3. Cast Vote          │                          │
  │───────────────────────▶│  4. Call vote()          │
  │                        │─────────────────────────▶│
  │                        │                          │
  │  5. Vote Recorded      │  6. TX Confirmed         │
  │◀───────────────────────│◀─────────────────────────│
```

## Smart Contract Architecture

### sprintfund-core-v4-minimal.clar

The main contract managing all DAO operations with security hardening:

| Function | Description |
|----------|-------------|
| `stake` | Deposit STX to gain voting power |
| `withdraw-stake` | Withdraw staked STX (after lockup) |
| `create-proposal` | Submit a new funding proposal (requires 10 STX stake) |
| `vote` | Cast vote on active proposal (quadratic cost, locks stake) |
| `execute-proposal` | Execute approved proposal (proposer only, after timelock) |
| `reclaim-vote-cost` | Reclaim vote cost after voting period ends |
| `get-proposal` | Read proposal details |
| `get-stake` | Read user's stake info |
| `get-vote` | Read vote details |
| `get-available-stake` | Get available stake after vote costs |
| `get-required-quorum` | Get current quorum requirement |
| `get-total-staked` | Get total STX staked in contract |
| `get-version` | Get contract version (returns 4) |

### Security Features

1. **Vote Cost Deduction**: Vote costs properly deducted from stake
2. **Double-Vote Prevention**: One vote per user per proposal
3. **Execution Authorization**: Only proposer can execute their proposal
4. **Voting Period Limits**: 3-day voting period (432 blocks)
5. **Quorum Requirements**: 10% of total staked STX required
6. **Stake Lockup**: 1-day lockup after voting (144 blocks)
7. **Amount Validation**: 1-1000 STX range enforced
8. **Timelock**: 1-day delay for proposals ≥100 STX
9. **Event Emissions**: All actions emit events
10. **Vote Cost Reclaim**: Users can reclaim vote costs after voting ends

### Data Maps

```clarity
;; User stakes with lockup
(define-map stakes
  { staker: principal }
  { 
    amount: uint,
    locked-until: uint
  }
)

;; Proposal storage with timelock
(define-map proposals
  { proposal-id: uint }
  {
    proposer: principal,
    amount: uint,
    title: (string-utf8 100),
    description: (string-utf8 500),
    votes-for: uint,
    votes-against: uint,
    executed: bool,
    created-at: uint,
    voting-ends-at: uint,
    execution-allowed-at: uint
  }
)

;; Vote records with cost tracking
(define-map votes
  { proposal-id: uint, voter: principal }
  { 
    weight: uint, 
    support: bool,
    cost-paid: uint
  }
)

;; Vote cost tracking
(define-map vote-costs
  { staker: principal }
  { total-cost: uint }
)
```

## Security Considerations

### V4-Minimal Security Enhancements

1. **Vote Cost Enforcement**: Vote costs are deducted from available stake, preventing unlimited voting
2. **Double-Vote Prevention**: `ERR-ALREADY-VOTED` prevents multiple votes per proposal
3. **Execution Authorization**: Only proposers can execute their own proposals
4. **Time-Based Controls**: 
   - 3-day voting period (432 blocks)
   - 1-day timelock for high-value proposals (≥100 STX)
   - 1-day stake lockup after voting
5. **Quorum Requirements**: 10% of total staked STX must participate
6. **Amount Validation**: Proposals must be between 1-1000 STX
7. **Stake Lockup**: Prevents vote manipulation by locking stake after voting
8. **Event Emissions**: All actions emit events for transparency and tracking
9. **Vote Cost Reclaim**: Users can reclaim vote costs after voting period ends
10. **Access Control**: Proper authorization checks on all sensitive operations

## API Reference

### Blockchain Interactions

```typescript
// Read proposal data
const proposal = await fetchCallReadOnlyFunction({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'sprintfund-core-v4-minimal',
  functionName: 'get-proposal',
  functionArgs: [uintCV(proposalId)],
});

// Submit vote transaction
await openContractCall({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'sprintfund-core-v4-minimal',
  functionName: 'vote',
  functionArgs: [uintCV(proposalId), boolCV(support), uintCV(voteWeight)],
});

// Check available stake
const availableStake = await fetchCallReadOnlyFunction({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'sprintfund-core-v4-minimal',
  functionName: 'get-available-stake',
  functionArgs: [standardPrincipalCV(userAddress)],
});

// Reclaim vote cost after voting ends
await openContractCall({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'sprintfund-core-v4-minimal',
  functionName: 'reclaim-vote-cost',
  functionArgs: [uintCV(proposalId)],
});
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

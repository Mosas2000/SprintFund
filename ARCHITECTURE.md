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
│  │                  sprintfund-core-v3.clar                   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │ │
│  │  │ Staking │  │Proposals│  │ Voting  │  │  Execution   │   │ │
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
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│  Stake  │────▶│  Create  │────▶│  Vote   │────▶│ Execute  │
│   STX   │     │ Proposal │     │         │     │          │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
     │               │                │               │
     ▼               ▼                ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contract State                      │
│  stakes-map    proposals-map    votes-map     executed-map  │
└─────────────────────────────────────────────────────────────┘
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

### sprintfund-core-v3.clar

The main contract managing all DAO operations:

| Function | Description |
|----------|-------------|
| `stake` | Deposit STX to gain voting power |
| `unstake` | Withdraw staked STX |
| `create-proposal` | Submit a new funding proposal |
| `vote` | Cast vote on active proposal |
| `execute-proposal` | Execute approved proposal |
| `get-proposal` | Read proposal details |
| `get-stake` | Read user's stake info |

### Data Maps

```clarity
;; User stakes
(define-map stakes principal uint)

;; Proposal storage
(define-map proposals uint {
  proposer: principal,
  title: (string-utf8 100),
  description: (string-utf8 500),
  amount: uint,
  votes-for: uint,
  votes-against: uint,
  executed: bool
})

;; Vote records
(define-map votes {proposal-id: uint, voter: principal} {
  support: bool,
  weight: uint
})
```

## Security Considerations

1. **Staking Requirement**: Users must stake STX before creating proposals
2. **Voting Power**: Based on stake amount (quadratic voting)
3. **Quorum**: Proposals require minimum participation
4. **Time Locks**: Execution delays for approved proposals
5. **Access Control**: Only proposers can modify their proposals

## API Reference

### Blockchain Interactions

```typescript
// Read proposal data
const proposal = await fetchCallReadOnlyFunction({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'sprintfund-core-v3',
  functionName: 'get-proposal',
  functionArgs: [uintCV(proposalId)],
});

// Submit vote transaction
await openContractCall({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'sprintfund-core-v3',
  functionName: 'vote',
  functionArgs: [uintCV(proposalId), boolCV(support)],
});
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

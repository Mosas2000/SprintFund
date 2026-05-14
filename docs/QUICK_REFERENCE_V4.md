# V4-Minimal Quick Reference

Quick reference guide for SprintFund V4-Minimal contract.

## Contract Details

```
Address: SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60
Name: sprintfund-core-v4-minimal
Network: Stacks Mainnet
Version: 4
```

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `VOTING-PERIOD-BLOCKS` | 432 | ~3 days voting period |
| `TIMELOCK-BLOCKS` | 144 | ~1 day timelock |
| `HIGH-VALUE-THRESHOLD` | 100 STX | Triggers timelock |
| `QUORUM-PERCENTAGE` | 10% | Minimum participation |
| `MIN-PROPOSAL-AMOUNT` | 1 STX | Minimum funding |
| `MAX-PROPOSAL-AMOUNT` | 1000 STX | Maximum funding |
| `STAKE-LOCKUP-BLOCKS` | 144 | ~1 day lockup |
| `MIN-STAKE-AMOUNT` | 10 STX | Required to propose |

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 100 | `ERR-NOT-AUTHORIZED` | Unauthorized action |
| 101 | `ERR-PROPOSAL-NOT-FOUND` | Proposal doesn't exist |
| 102 | `ERR-INSUFFICIENT-STAKE` | Not enough stake |
| 103 | `ERR-ALREADY-EXECUTED` | Proposal already executed |
| 104 | `ERR-ALREADY-VOTED` | Already voted on proposal |
| 105 | `ERR-VOTING-PERIOD-ENDED` | Voting period closed |
| 106 | `ERR-VOTING-PERIOD-ACTIVE` | Voting still active |
| 107 | `ERR-QUORUM-NOT-MET` | Not enough participation |
| 108 | `ERR-AMOUNT-TOO-LOW` | Amount below minimum |
| 109 | `ERR-AMOUNT-TOO-HIGH` | Amount above maximum |
| 110 | `ERR-ZERO-AMOUNT` | Amount is zero |
| 114 | `ERR-STAKE-LOCKED` | Stake is locked |
| 115 | `ERR-TIMELOCK-ACTIVE` | Timelock not expired |

## Public Functions

### stake(amount)
Stake STX to gain voting power.

**Parameters:**
- `amount` (uint): Amount in microSTX

**Returns:** New stake amount

**Example:**
```clarity
(contract-call? .sprintfund-core-v4-minimal stake u10000000) ;; Stake 10 STX
```

---

### withdraw-stake(amount)
Withdraw staked STX after lockup period.

**Parameters:**
- `amount` (uint): Amount in microSTX

**Returns:** Remaining stake amount

**Requirements:**
- Stake must not be locked
- Must have sufficient available stake

**Example:**
```clarity
(contract-call? .sprintfund-core-v4-minimal withdraw-stake u5000000) ;; Withdraw 5 STX
```

---

### create-proposal(amount, title, description)
Create a new funding proposal.

**Parameters:**
- `amount` (uint): Requested amount (1-1000 STX)
- `title` (string-utf8 100): Proposal title
- `description` (string-utf8 500): Proposal description

**Returns:** Proposal ID

**Requirements:**
- Must have ≥10 STX staked
- Amount must be 1-1000 STX

**Example:**
```clarity
(contract-call? .sprintfund-core-v4-minimal 
  create-proposal 
  u50000000 
  u"Build Feature X" 
  u"This proposal funds development of Feature X")
```

---

### vote(proposal-id, support, vote-weight)
Vote on a proposal with quadratic cost.

**Parameters:**
- `proposal-id` (uint): Proposal to vote on
- `support` (bool): true for YES, false for NO
- `vote-weight` (uint): Vote weight (cost = weight²)

**Returns:** Success boolean

**Requirements:**
- Proposal must exist and be active
- Must not have already voted
- Must have sufficient available stake
- Voting period must not have ended

**Cost:** `vote-weight²` STX

**Example:**
```clarity
(contract-call? .sprintfund-core-v4-minimal vote u0 true u5) ;; Vote YES with weight 5 (costs 25 STX)
```

---

### execute-proposal(proposal-id)
Execute an approved proposal.

**Parameters:**
- `proposal-id` (uint): Proposal to execute

**Returns:** Success boolean

**Requirements:**
- Must be the proposer
- Proposal must not be executed
- Voting period must have ended
- Timelock must have expired (if high-value)
- Quorum must be met
- More YES votes than NO votes

**Example:**
```clarity
(contract-call? .sprintfund-core-v4-minimal execute-proposal u0)
```

---

### reclaim-vote-cost(proposal-id)
Reclaim vote cost after voting period ends.

**Parameters:**
- `proposal-id` (uint): Proposal to reclaim from

**Returns:** Success boolean

**Requirements:**
- Must have voted on proposal
- Voting period must have ended

**Example:**
```clarity
(contract-call? .sprintfund-core-v4-minimal reclaim-vote-cost u0)
```

---

## Read-Only Functions

### get-proposal(proposal-id)
Get proposal details.

**Returns:**
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
  voting-ends-at: uint,
  execution-allowed-at: uint
}
```

---

### get-stake(staker)
Get user's stake information.

**Returns:**
```clarity
{
  amount: uint,
  locked-until: uint
}
```

---

### get-vote(proposal-id, voter)
Get vote details.

**Returns:**
```clarity
{
  weight: uint,
  support: bool,
  cost-paid: uint
}
```

---

### get-available-stake(staker)
Get available stake after vote costs.

**Returns:** Available stake amount (uint)

---

### get-required-quorum()
Get current quorum requirement.

**Returns:** Required quorum amount (uint)

---

### get-total-staked()
Get total STX staked in contract.

**Returns:** Total staked amount (uint)

---

### get-proposal-count()
Get total number of proposals.

**Returns:** Proposal count (uint)

---

### get-min-stake-amount()
Get minimum stake requirement.

**Returns:** Minimum stake (10 STX)

---

### get-contract-owner()
Get contract owner address.

**Returns:** Owner principal

---

### get-version()
Get contract version.

**Returns:** Version number (4)

---

## Typical Workflows

### Creating a Proposal

1. Stake at least 10 STX
2. Create proposal with 1-1000 STX amount
3. Wait for community votes
4. Execute if approved

```clarity
;; 1. Stake
(contract-call? .sprintfund-core-v4-minimal stake u10000000)

;; 2. Create proposal
(contract-call? .sprintfund-core-v4-minimal 
  create-proposal 
  u50000000 
  u"My Proposal" 
  u"Description here")

;; 3. Wait for voting period (3 days)

;; 4. Execute (if approved and timelock expired)
(contract-call? .sprintfund-core-v4-minimal execute-proposal u0)
```

---

### Voting on a Proposal

1. Stake STX
2. Vote with desired weight
3. Wait for voting period to end
4. Reclaim vote cost

```clarity
;; 1. Stake
(contract-call? .sprintfund-core-v4-minimal stake u50000000)

;; 2. Vote (weight 5 = 25 STX cost)
(contract-call? .sprintfund-core-v4-minimal vote u0 true u5)

;; 3. Wait for voting period to end

;; 4. Reclaim vote cost
(contract-call? .sprintfund-core-v4-minimal reclaim-vote-cost u0)
```

---

### Withdrawing Stake

1. Wait for stake lockup to expire
2. Reclaim any vote costs
3. Withdraw stake

```clarity
;; 1. Check if stake is locked
(contract-call? .sprintfund-core-v4-minimal get-stake tx-sender)

;; 2. Reclaim vote costs
(contract-call? .sprintfund-core-v4-minimal reclaim-vote-cost u0)

;; 3. Withdraw
(contract-call? .sprintfund-core-v4-minimal withdraw-stake u10000000)
```

---

## Security Checklist

Before interacting with the contract:

- [ ] Verify contract address: `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60`
- [ ] Check contract version returns 4
- [ ] Start with small test amounts
- [ ] Understand vote costs (quadratic)
- [ ] Know stake lockup period (1 day)
- [ ] Understand voting period (3 days)
- [ ] Check timelock for high-value proposals
- [ ] Verify quorum requirements (10%)

---

## Useful Links

- [Contract Explorer](https://explorer.hiro.so/txid/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal?chain=mainnet)
- [Migration Guide](V4_MINIMAL_MIGRATION.md)
- [Security Audit](SECURITY_AUDIT_V4.md)
- [Full Documentation](../README.md)
- [Architecture](../ARCHITECTURE.md)

---

## Support

- **GitHub**: [SprintFund Repository](https://github.com/Mosas2000/SprintFund)
- **Issues**: [Report Issues](https://github.com/Mosas2000/SprintFund/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mosas2000/SprintFund/discussions)

# SprintFund Mainnet Deployment

## Deployment Summary

**Status**: ✅ Successfully Deployed to Stacks Mainnet

**Deployment Date**: January 20, 2026

---

## Contract Information

### Contract Identifier
```
SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core
```

### Deployment Details

| Property | Value |
|----------|-------|
| **Contract Name** | sprintfund-core |
| **Deployer Address** | SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T |
| **Network** | Stacks Mainnet |
| **Clarity Version** | 3 |
| **Deployment Cost** | 0.08058 STX (80,580 microSTX) |
| **Epoch** | 3.2 |

---

## Explorer Links

### Stacks Explorer
- **Contract**: `https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core?chain=mainnet`
- **Deployer Address**: `https://explorer.hiro.so/address/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T?chain=mainnet`

> [!NOTE]
> The transaction ID will be available in the Stacks Explorer once the deployment is fully indexed.

---

## Available Functions

### Read-Only Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `get-proposal` | `proposal-id: uint` | `(optional tuple)` | Retrieve proposal details by ID |
| `get-proposal-count` | - | `(response uint)` | Get total number of proposals |
| `get-stake` | `staker: principal` | `(optional tuple)` | Get stake amount for a user |
| `get-min-stake-amount` | - | `(response uint)` | Get minimum required stake (10 STX) |
| `get-contract-owner` | - | `(response principal)` | Get contract owner address |

### Public Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `stake` | `amount: uint` | Stake STX to gain proposal creation rights |
| `create-proposal` | `amount: uint, title: string-utf8, description: string-utf8` | Create new funding proposal (requires 10 STX stake) |
| `withdraw-stake` | `amount: uint` | Withdraw staked STX |
| `vote` | `proposal-id: uint, support: bool, vote-weight: uint` | Vote on proposal with quadratic voting |
| `execute-proposal` | `proposal-id: uint` | Execute approved proposal and transfer funds |

---

## Quadratic Voting System

The contract implements quadratic voting where:
- **Vote Cost** = `vote-weight²`
- Example: To cast 10 votes requires 100 STX staked (10² = 100)
- This prevents whale dominance and ensures fairer governance

---

## Anti-Spam Protection

- **Minimum Stake**: 10 STX (10,000,000 microSTX)
- Users must stake at least 10 STX to create proposals
- Prevents spam and ensures serious proposals only

---

## Usage Examples

### Stake STX
```clarity
(contract-call? 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core stake u10000000)
```

### Create Proposal
```clarity
(contract-call? 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core 
  create-proposal 
  u5000000 
  u"Build Community Dashboard" 
  u"A web dashboard to track DAO metrics and proposals")
```

### Vote on Proposal
```clarity
(contract-call? 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core 
  vote 
  u0 
  true 
  u10)
```

### Execute Proposal
```clarity
(contract-call? 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core 
  execute-proposal 
  u0)
```

---

## Security Considerations

✅ **Contract Verified**: Syntax checked with `clarinet check`  
✅ **Quadratic Voting**: Prevents plutocracy  
✅ **Anti-Spam**: Minimum stake requirement  
✅ **Execution Control**: Only approved proposals can be executed  

---

## Next Steps

1. **Frontend Development** - Build web interface for user interaction
2. **Testing** - Comprehensive testing on mainnet
3. **Community Launch** - Announce to Stacks community
4. **First Proposals** - Start accepting micro-grant proposals

---

## Support & Resources

- **GitHub Repository**: [Mosas2000/SprintFund](https://github.com/Mosas2000/SprintFund)
- **Stacks Documentation**: [docs.stacks.co](https://docs.stacks.co)
- **Clarity Language**: [clarity-lang.org](https://clarity-lang.org)

---

**Deployed with ❤️ on Stacks Blockchain**

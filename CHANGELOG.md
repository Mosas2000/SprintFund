# Changelog

All notable changes to SprintFund will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-05-14

### Added
- **V4-Minimal Contract**: Optimized contract with all security fixes
- **Vote Cost Deduction**: Properly deduct vote costs from available stake
- **Double-Vote Prevention**: Enforce one vote per user per proposal
- **Voting Period Limits**: 3-day voting period (432 blocks)
- **Quorum Requirements**: 10% of total staked STX required for execution
- **Stake Lockup**: 1-day lockup after voting (144 blocks)
- **Timelock for High-Value Proposals**: 1-day delay for proposals ≥100 STX
- **Amount Validation**: Enforce 1-1000 STX range for proposals
- **Event Emissions**: All actions emit events for transparency
- **Vote Cost Reclaim**: New `reclaim-vote-cost` function
- **Available Stake Query**: New `get-available-stake` function
- **Vote Details Query**: New `get-vote` function
- **Quorum Query**: New `get-required-quorum` function
- **Total Staked Query**: New `get-total-staked` function
- **Version Query**: New `get-version` function (returns 4)
- **Migration Guide**: Comprehensive V4-minimal migration documentation

### Changed
- **Contract Address**: Updated to `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal`
- **Proposal Structure**: Added `voting-ends-at` and `execution-allowed-at` fields
- **Stake Structure**: Added `locked-until` field
- **Vote Structure**: Added `cost-paid` field
- **Execution Authorization**: Only proposer can execute their proposal
- **Frontend Configuration**: Updated to use V4-minimal contract
- **Documentation**: Updated README, ARCHITECTURE, and added migration guide

### Security
- **Fixed**: Vote costs were only checked, not deducted (Critical)
- **Fixed**: No double-vote prevention (Critical)
- **Fixed**: Anyone could execute any proposal (Critical)
- **Fixed**: Infinite voting period (High)
- **Fixed**: No quorum requirements (High)
- **Fixed**: No stake lockup after voting (High)
- **Fixed**: No amount validation (Medium)
- **Fixed**: No timelock for high-value proposals (Medium)
- **Fixed**: No event emissions (Low)
- **Fixed**: Vote costs locked forever (Medium)

### Removed
- **Proposal Templates**: Removed to reduce contract size
- **Milestone Tracking**: Removed to reduce contract size
- **Voting Delegation**: Removed to reduce contract size
- **Reputation System**: Removed to reduce contract size

### Deprecated
- **V3 Contract**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3` is now deprecated

### Deployment
- **Cost**: 0.76 STX (763,226 microSTX)
- **Network**: Stacks Mainnet
- **Date**: May 14, 2026

## [3.0.0] - 2026-01-20

### Added
- Initial V3 contract deployment
- Quadratic voting mechanism
- Staking system
- Proposal creation and execution
- Basic voting functionality

### Deployment
- **Cost**: 0.08058 STX
- **Network**: Stacks Mainnet
- **Date**: January 20, 2026

## [2.0.0] - 2025-12-15

### Added
- V2 contract with improved features
- Enhanced proposal management

### Deprecated
- V1 contract deprecated

## [1.0.0] - 2025-11-01

### Added
- Initial SprintFund DAO contract
- Basic staking and voting
- Proposal system

---

## Migration Notes

### V3 to V4-Minimal

Users must manually migrate:
1. Withdraw stakes from V3 contract
2. Stake in V4-minimal contract
3. Complete existing V3 proposals before migrating
4. Start fresh proposals in V4-minimal

See [V4_MINIMAL_MIGRATION.md](docs/V4_MINIMAL_MIGRATION.md) for detailed migration guide.

### Contract Addresses

- **V4-Minimal (Current)**: `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal`
- **V3 (Deprecated)**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3`
- **V2 (Deprecated)**: `sprintfund-core-v2`
- **V1 (Deprecated)**: `sprintfund-core`

## Links

- [GitHub Repository](https://github.com/Mosas2000/SprintFund)
- [Contract Explorer](https://explorer.hiro.so/txid/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal?chain=mainnet)
- [Documentation](README.md)
- [Architecture](ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)

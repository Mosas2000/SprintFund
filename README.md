# SprintFund

**Lightning-fast micro-grants DAO on Stacks blockchain**

## About

SprintFund is a decentralized autonomous organization (DAO) designed to fund small projects quickly and efficiently. Get funding for your micro-projects ($50-200 STX) in just 24 hours through community-driven quadratic voting and a transparent reputation system.

## 🚀 Live Deployment

**Status**: ✅ **Ready for Deployment - v5-micro**

**Contract Version**: V5-Micro (Configurable Micro-Stake with Admin Controls)

**Next Contract Address**: TBD (Deploy v5-micro to mainnet)

**Current Production**: `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal`

**Configuration**: Fully configurable minimum stake (default: 100 microSTX = 0.0001 STX)

## Key Features

- **⚡ Configurable Micro-Stakes** - Start with as little as 0.0001 STX (100 microSTX), adjustable by contract owner
- **🗳️ Quadratic Voting** - Fair voting mechanism that prevents whale dominance (cost = weight²)
- **👑 Admin Controls** - Contract owner can adjust minimum stake and transfer ownership
- **🔒 Security Hardened** - 10 critical security fixes including vote cost deduction, double-vote prevention, and stake lockup
- **⏱️ Time-Locked Execution** - High-value proposals (≥100 STX) require 1-day timelock after voting ends
- **📊 Quorum Requirements** - 10% of total staked STX must participate for proposal execution
- **🛡️ Anti-Spam Protection** - Configurable minimum stake to submit proposals
- **📈 Analytics Dashboard** - Real-time stats and leaderboards
- **👤 User Dashboard** - Track your proposals, votes, and stake balance
- **⌨️ Keyboard Shortcuts** - Power user navigation with keyboard commands

## Tech Stack

### Smart Contracts
- **Language**: Clarity
- **Blockchain**: Stacks Mainnet
- **Version**: V5-Micro (Configurable Stakes + Admin Controls)
- **Features**: Quadratic voting, configurable staking, proposal execution, timelock, quorum, vote cost deduction, stake lockup, admin functions

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: @stacks/connect, @stacks/transactions
- **Features**: Wallet connection, contract interaction, real-time data fetching, keyboard shortcuts
- **UX**: Command palette, arrow key navigation, accessibility-first design

## How to Use

### For Users

1. **Connect Wallet**
   - Visit the SprintFund dApp
   - Click "Connect Wallet"
   - Approve connection with Hiro/Leather wallet

2. **Stake STX** (Required for creating proposals)
   - Minimum stake: Configurable (default: 0.0001 STX)
   - Owner can adjust minimum stake
   - Stake is refundable when withdrawn

3. **Create a Proposal**
   - Fill in title (max 100 chars)
   - Add description (max 500 chars)
   - Specify requested amount in STX
   - Submit transaction

4. **Vote on Proposals**
   - Browse active proposals
   - Enter vote weight
   - Cost = weight² STX (quadratic voting)
   - Click "Vote YES" or "Vote NO"

5. **Execute Approved Proposals**
   - Only proposal creators can execute
   - Requires votes-for > votes-against
   - Funds automatically transferred on execution

### Keyboard Shortcuts

Power users can navigate faster using keyboard shortcuts:

- **`Cmd/Ctrl+K`** - Open command palette
- **`Cmd/Ctrl+D`** - Go to dashboard
- **`Cmd/Ctrl+N`** - Create new proposal
- **Arrow Keys** - Navigate proposal list
- **Enter** - Open selected proposal
- **Esc** - Close modals

Click the keyboard icon in the header for a complete list. See [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md) for detailed documentation.

### For Developers

See [frontend/README.md](frontend/README.md) for local development setup.

## Project Structure

```
sprintfund/
├── contracts/
│   ├── sprintfund-core-v5-micro.clar    # Main DAO contract (V5) - PRODUCTION
│   ├── sprintfund-core-v4-minimal.clar  # Legacy V4 contract
│   ├── sprintfund-core-v3.clar          # Legacy V3 contract
│   └── sprintfund-logger.clar           # Event logger
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx                 # Landing page with admin panel
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminPanel.tsx       # Contract owner controls
│   │   │   ├── CreateProposalForm.tsx
│   │   │   ├── ProposalList.tsx
│   │   │   └── ...
│   │   └── lib/
│   │       └── contract-info.ts         # Dynamic contract queries
│   └── package.json
├── tests/
│   └── sprintfund-core-v5-micro.test.ts # Comprehensive tests (36 tests)
├── deployments/
│   ├── v5-micro.mainnet-plan.yaml
│   └── default.mainnet-plan.yaml
├── REFACTORING_PROGRESS.md             # Detailed progress tracking
└── README.md                            # This file
```

## Smart Contract Functions

### Read-Only
- `get-proposal(proposal-id)` - Get proposal details
- `get-proposal-count()` - Get total proposals
- `get-stake(staker)` - Get user's stake and lock status
- `get-min-stake-amount()` - Get current minimum stake (configurable)
- `get-vote(proposal-id, voter)` - Get vote details for a voter
- `get-required-quorum()` - Get required quorum (10% of total staked)
- `get-available-stake(staker)` - Get available stake after vote costs
- `get-total-staked()` - Get total STX staked in contract
- `get-contract-owner()` - Get contract owner address
- `get-version()` - Get contract version (returns 5)

### Public
- `stake(amount)` - Stake STX (minimum configurable by owner)
- `create-proposal(amount, title, description)` - Create proposal (requires minimum stake)
- `vote(proposal-id, support, vote-weight)` - Vote on proposal (cost = weight²)
- `execute-proposal(proposal-id)` - Execute approved proposal (proposer only, after timelock)
- `withdraw-stake(amount)` - Withdraw staked STX (after unlock period)
- `reclaim-vote-cost(proposal-id)` - Reclaim vote cost after voting period ends

### Admin (Owner Only)
- `set-min-stake-amount(new-amount)` - Update minimum stake requirement
- `transfer-ownership(new-owner)` - Transfer contract ownership

## Demo & Screenshots

> 📸 Screenshots and demo video coming soon!

<!-- Add screenshots here when available -->

## Development

```bash
# Clone repository
git clone https://github.com/Mosas2000/SprintFund.git
cd SprintFund/sprintfund

# Install dependencies
cd frontend
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Deployment Cost

- **Contract Deployment**: 0.76 STX (763,226 microSTX)
- **Network**: Stacks Mainnet
- **Date**: May 14, 2026
- **Version**: V4-Minimal (Optimized)

## Current Limitations

### Known Issues
- **Browser Support**: Optimized for Chrome/Firefox; Safari may have wallet connection quirks
- **Mobile**: Wallet connection works but UI is optimized for desktop
- **Rate Limiting**: Heavy API usage may trigger Stacks API rate limits

### Planned Improvements
- **Multi-signature**: Add time-locks for high-value proposals
- **Delegation**: Allow stake delegation for voting power
- **Off-chain Voting**: Gasless voting with on-chain execution
- **Mobile App**: Native mobile experience

### Security Considerations
- Smart contract includes 10 critical security fixes from V3
- Vote costs are properly deducted (not just checked)
- Double-voting prevention enforced
- Stake lockup after voting (1 day)
- Timelock for high-value proposals (≥100 STX)
- Quorum requirements (10% of total staked)
- Amount validation (1-1000 STX range)
- Only proposers can execute their proposals
- Voting period limits enforced (3 days)
- Use at your own risk on mainnet
- Start with small amounts to test functionality

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| Core DAO | ✅ Complete | Staking, proposals, voting |
| Frontend | ✅ Complete | Next.js dashboard |
| Analytics | ✅ Complete | Dashboard with stats |
| Mainnet | ✅ Complete | Live deployment |
| Testing | 🔄 In Progress | Expanding test coverage |
| Audit | 📋 Planned | Security audit |
| Mobile | 📋 Planned | Mobile-optimized UI |

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Keyboard Shortcuts](KEYBOARD_SHORTCUTS.md)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ on Stacks Blockchain**

🔗 [GitHub](https://github.com/Mosas2000/SprintFund) | 📊 [Contract Explorer](https://explorer.hiro.so/txid/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v4-minimal?chain=mainnet)

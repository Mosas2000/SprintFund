# SprintFund

**Lightning-fast micro-grants DAO on Stacks blockchain**

## About

SprintFund is a decentralized autonomous organization (DAO) designed to fund small projects quickly and efficiently. Get funding for your micro-projects ($50-200 STX) in just 24 hours through community-driven quadratic voting and a transparent reputation system.

## 🚀 Live Deployment

**Status**: ✅ **Live on Stacks Mainnet**

**Contract Address**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core`

**Explorer**: [View on Stacks Explorer](https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core?chain=mainnet)

## Key Features

- **⚡ Micro-Grants** - Fast funding for small projects ($50-200 STX range)
- **🗳️ Quadratic Voting** - Fair voting mechanism that prevents whale dominance (cost = weight²)
- **⭐ Reputation System** - Track contributor history and build trust
- **🛡️ Anti-Spam Staking** - Require 10 STX stake to submit proposals
- **📊 Analytics Dashboard** - Real-time stats and leaderboards
- **👤 User Dashboard** - Track your proposals, votes, and stake balance

## Tech Stack

### Smart Contracts
- **Language**: Clarity
- **Blockchain**: Stacks Mainnet
- **Features**: Quadratic voting, staking, proposal execution

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: @stacks/connect, @stacks/transactions
- **Features**: Wallet connection, contract interaction, real-time data fetching

## How to Use

### For Users

1. **Connect Wallet**
   - Visit the SprintFund dApp
   - Click "Connect Wallet"
   - Approve connection with Hiro/Leather wallet

2. **Stake STX** (Required for creating proposals)
   - Minimum stake: 10 STX
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

### For Developers

See [frontend/README.md](frontend/README.md) for local development setup.

## Project Structure

```
sprintfund/
├── contracts/
│   └── sprintfund-core.clar    # Main DAO contract
├── frontend/
│   ├── app/
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── CreateProposalForm.tsx
│   │   ├── ProposalList.tsx
│   │   ├── ExecuteProposal.tsx
│   │   ├── UserDashboard.tsx
│   │   └── Stats.tsx
│   └── package.json
├── deployments/
│   └── default.mainnet-plan.yaml
├── DEPLOYMENT.md               # Deployment documentation
└── README.md                   # This file
```

## Smart Contract Functions

### Read-Only
- `get-proposal(proposal-id)` - Get proposal details
- `get-proposal-count()` - Get total proposals
- `get-stake(staker)` - Get user's stake
- `get-min-stake-amount()` - Get minimum stake (10 STX)

### Public
- `stake(amount)` - Stake STX
- `create-proposal(amount, title, description)` - Create proposal
- `vote(proposal-id, support, vote-weight)` - Vote on proposal
- `execute-proposal(proposal-id)` - Execute approved proposal
- `withdraw-stake(amount)` - Withdraw staked STX

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

- **Contract Deployment**: 0.08058 STX
- **Network**: Stacks Mainnet
- **Date**: January 20, 2026

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ on Stacks Blockchain**

🔗 [GitHub](https://github.com/Mosas2000/SprintFund) | 📊 [Contract Explorer](https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core?chain=mainnet)

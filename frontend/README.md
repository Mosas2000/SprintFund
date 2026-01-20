# SprintFund Frontend

Modern Next.js frontend for the SprintFund DAO on Stacks blockchain.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: @stacks/connect, @stacks/transactions
- **Network**: Stacks Mainnet

## Features

- ✅ Wallet connection (Hiro/Leather)
- ✅ Create proposals with contract integration
- ✅ Quadratic voting interface
- ✅ Proposal execution for creators
- ✅ User dashboard with personal stats
- ✅ Platform statistics and leaderboards
- ✅ Real-time data fetching from mainnet

## Prerequisites

- Node.js 18+ and npm
- Hiro or Leather wallet browser extension

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   └── favicon.ico         # App icon
├── components/
│   ├── CreateProposalForm.tsx  # Proposal creation form
│   ├── ProposalList.tsx        # List of all proposals
│   ├── ExecuteProposal.tsx     # Execution button for creators
│   ├── UserDashboard.tsx       # Personal stats dashboard
│   └── Stats.tsx               # Platform analytics
├── public/                 # Static assets
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Contract Integration

The frontend interacts with the deployed contract:

**Contract**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core`

### Read-Only Functions
- `get-proposal-count()` - Fetch total proposals
- `get-proposal(id)` - Fetch proposal details
- `get-stake(address)` - Fetch user's stake

### Write Functions
- `create-proposal(amount, title, description)` - Create new proposal
- `vote(proposal-id, support, weight)` - Vote on proposal
- `execute-proposal(proposal-id)` - Execute approved proposal
- `stake(amount)` - Stake STX
- `withdraw-stake(amount)` - Withdraw stake

## Key Components

### CreateProposalForm
- Form validation (title max 100, description max 500)
- STX amount input with decimal support
- Contract call using `openContractCall`
- Success/error handling

### ProposalList
- Fetches all proposals from contract
- Displays proposal details
- Integrated voting interface
- Execution button for creators

### UserDashboard
- Shows connected wallet address
- Displays stake balance
- Lists user's proposals
- Tracks votes cast

### Stats
- Total proposals count
- Active proposals count
- Total STX distributed
- Top proposers leaderboard

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Troubleshooting

### Wallet Connection Issues
- Ensure Hiro or Leather wallet extension is installed
- Check that you're on Stacks Mainnet
- Try refreshing the page

### Transaction Failures
- Verify you have sufficient STX balance
- Check that you've staked 10 STX before creating proposals
- Ensure you haven't already voted on a proposal

### Data Not Loading
- Check browser console for errors
- Verify contract address is correct
- Try the "Refresh" button on proposal list

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built with ❤️ using Next.js and Stacks**

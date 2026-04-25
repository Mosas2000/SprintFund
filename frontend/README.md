# SprintFund Frontend

Modern Next.js frontend for the SprintFund DAO on Stacks blockchain.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: @stacks/connect, @stacks/transactions
- **Network**: Stacks Mainnet

## Features

- Wallet connection (Hiro/Leather)
- Create proposals with contract integration
- Quadratic voting interface
- Proposal execution for creators
- User dashboard with personal stats
- User profile page with activity history and voting record
- Platform statistics and leaderboards
- Real-time data fetching from mainnet
- In-app notification system for governance events

## Prerequisites

- Node.js 18+ and npm
- Hiro or Leather wallet browser extension

## Installation

```bash
# Install dependencies
npm install
```

## Environment Variables

Create a `.env.local` file for local development:

```bash
# Copy the example file
cp .env.example .env.local
```

Available environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_NETWORK` | Stacks network (mainnet/testnet) | mainnet |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Contract deployer address | SP31PKQ... |
| `NEXT_PUBLIC_CONTRACT_NAME` | Contract name | sprintfund-core-v3 |

For mainnet deployment, no environment changes are typically needed.

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

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Tests are written with Vitest and React Testing Library.

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

**Contract**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3`

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

Multiple deployment options are available with full configuration included.

### Quick Start

**Vercel (Recommended)**
```bash
npm ci
npm run build
npx vercel --prod
```

**Netlify**
```bash
npm ci
npm run build
```
Connect your repository to Netlify and deploy.

**Docker**
```bash
./scripts/build-docker.sh
docker run -p 3000:3000 sprintfund-frontend:latest
```

### Deployment Files

- `vercel.json` - Vercel configuration with security headers and caching
- `netlify.toml` - Netlify configuration with Next.js plugin
- `Dockerfile` - Production Docker image (multi-stage build)
- `Dockerfile.dev` - Development Docker image
- `docker-compose.yml` - Container orchestration for local testing
- `.dockerignore` - Docker build optimization

### Health Check

The application exposes health endpoints for monitoring:
- `/api/health` - Primary health endpoint
- `/healthz` - Kubernetes liveness probe
- `/ready` - Kubernetes readiness probe

### Documentation

Comprehensive deployment guides available in `/docs`:

- [Deployment Guide](./docs/DEPLOYMENT.md) - Complete deployment instructions
- [Custom Domain](./docs/CUSTOM_DOMAIN.md) - Domain configuration
- [SSL/HTTPS](./docs/SSL_HTTPS.md) - Certificate setup
- [Environment Variables](./docs/ENVIRONMENT.md) - Configuration reference
- [Staging Setup](./docs/STAGING.md) - Staging environment
- [Monitoring](./docs/MONITORING.md) - Observability and alerts
- [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) - Pre-deployment validation
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

### Scripts

Deployment helper scripts in `/scripts`:

- `build-docker.sh` - Build production Docker image
- `validate-deploy.sh` - Validate environment before deployment
- `start-production.sh` - Start production server

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

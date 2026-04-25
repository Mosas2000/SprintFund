# Environment Variables

This document describes all environment variables used by the SprintFund frontend.

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_NETWORK` | Stacks network to connect to | `mainnet`, `testnet` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | `SP2...` |
| `NEXT_PUBLIC_CONTRACT_NAME` | Name of the contract | `sprintfund-core-v3` |
| `NEXT_PUBLIC_STACKS_API_URL` | Stacks API endpoint | `https://stacks-node-api.mainnet.stacks.co` |

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOSTNAME` | Server hostname | `0.0.0.0` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

## Environment Files

### Development

Create `.env.local`:

```bash
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v3
NEXT_PUBLIC_STACKS_API_URL=https://stacks-node-api.testnet.stacks.co
```

### Production

Set environment variables in your deployment platform or create `.env.production.local`:

```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v3
NEXT_PUBLIC_STACKS_API_URL=https://stacks-node-api.mainnet.stacks.co
```

## Platform Configuration

### Vercel

1. Go to Project Settings > Environment Variables
2. Add each variable with appropriate scope (Production, Preview, Development)

### Netlify

1. Go to Site settings > Build & deploy > Environment
2. Add environment variables

### Docker

Pass environment variables via docker-compose or command line:

```bash
docker run -e NEXT_PUBLIC_NETWORK=mainnet \
           -e NEXT_PUBLIC_CONTRACT_ADDRESS=SP2... \
           -p 3000:3000 sprintfund-frontend
```

## Security Notes

- Never commit `.env.local` or `.env.production.local` to version control
- Use platform-specific secret management for sensitive values
- `NEXT_PUBLIC_` prefixed variables are exposed to the browser

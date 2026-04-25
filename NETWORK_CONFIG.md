# Network Configuration

SprintFund supports both Stacks Mainnet and Testnet environments via environment variables.

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` to set your network:
   ```bash
   NEXT_PUBLIC_NETWORK=mainnet  # or testnet
   NEXT_PUBLIC_CONTRACT_ADDRESS=SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T
   ```

## Environment Variables

### `NEXT_PUBLIC_NETWORK`
- **Type:** `mainnet` | `testnet`
- **Default:** `mainnet`
- **Description:** Determines which Stacks network to connect to

### `NEXT_PUBLIC_CONTRACT_ADDRESS`
- **Type:** String (Stacks address)
- **Default:** `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T` (mainnet)
- **Description:** The deployed contract address for your network

### `NEXT_PUBLIC_CONTRACT_NAME`
- **Type:** String
- **Default:** `sprintfund-core-v3`
- **Description:** The contract name (optional)

### `NEXT_PUBLIC_STACKS_API_URL`
- **Type:** URL string
- **Default:** Auto-selected based on `NEXT_PUBLIC_NETWORK`
  - Mainnet: `https://stacks-node-api.mainnet.stacks.co`
  - Testnet: `https://stacks-node-api.testnet.stacks.co`
- **Description:** Stacks API endpoint (optional override)

## Network Presets

### Mainnet (Production)
```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v3
```

### Testnet (Development)
```bash
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v3
```

## Testing Network Switching

To test network configuration:

```bash
# Test mainnet
NEXT_PUBLIC_NETWORK=mainnet npm run dev

# Test testnet
NEXT_PUBLIC_NETWORK=testnet npm run dev
```

## Implementation Details

The network configuration is centralized in `src/config.ts`:
- All network-specific settings are derived from `NEXT_PUBLIC_NETWORK`
- API URLs auto-select based on network
- Contract address can be overridden per environment
- No code changes needed to switch networks

## Deployment

For production deployments, create `.env.production.local`:
```bash
cp .env.production .env.production.local
# Edit with your production values
```

For staging deployments, use `.env.staging.local`:
```bash
cp .env.staging .env.staging.local
# Edit with your staging values
```

**Never commit `.env.*.local` files to version control.**

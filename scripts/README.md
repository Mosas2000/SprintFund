# SprintFund Mainnet Interaction Scripts

This directory contains scripts for interacting with the SprintFund contract on Stacks mainnet.

## Quick Start

### 1. Install Dependencies
```bash
cd scripts
npm install
```

### 2. Configure Private Key
```bash
cp .env.example .env
# Edit .env and add your private key
```

### 3. Stake STX (Required First)
Before creating proposals, you must stake at least 10 STX:
```bash
npm run stake
```

### 4. Create Test Proposal
After staking and transaction confirmation:
```bash
npm run create-proposal
```

## Available Scripts

### `npm run stake`
Stakes 10 STX in the SprintFund contract to gain proposal creation rights.

**Requirements:**
- At least 10.01 STX in your account (10 for stake + 0.01 for fees)

### `npm run create-proposal`
Creates a test proposal on mainnet with the following parameters:
- **Amount**: 50 STX
- **Title**: "Test Proposal 1"
- **Description**: "Testing SprintFund proposal creation for Builder Rewards program"

**Requirements:**
- Must have staked at least 10 STX first
- Transaction ID will be saved to `../transactions.log`

## File Structure

```
scripts/
├── package.json           # Dependencies and npm scripts
├── create-proposal.js     # Create proposal script
├── stake.js              # Stake STX script
├── .env.example          # Environment template
└── README.md             # This file
```

## Transaction Tracking

All transactions are logged to `transactions.log` in the parent directory.

Format:
```
TX1: 0x1234... - Create Test Proposal
```

## Troubleshooting

### "ERR-INSUFFICIENT-STAKE"
You need to stake at least 10 STX first. Run:
```bash
npm run stake
```

### "Transaction Failed"
- Ensure you have enough STX for fees (~0.01 STX)
- Wait for previous transactions to confirm
- Check your private key is correct

### "Module not found"
Run `npm install` in the scripts directory.

## Security

⚠️ **Never commit your `.env` file or share your private key!**

The `.env` file is already in `.gitignore` for safety.

# Migration Quick Start Guide

## For Users: Migrate in 5 Minutes

### Step 1: Visit the App
Go to [app.sprintfund.xyz](https://app.sprintfund.xyz)

### Step 2: Connect Wallet
Click "Connect Wallet" and approve the connection

### Step 3: Check for Migration Banner
If you have assets in the old contract, you'll see a yellow banner

### Step 4: Click "Migrate Now"
This opens the migration wizard

### Step 5: Review and Confirm
- Check the amount to migrate
- Review the fees (~0.03 STX)
- Click "Start Migration"

### Step 6: Approve Transactions
- Approve withdrawal from old contract
- Approve stake in new contract
- Wait for confirmations (10-30 minutes)

### Done!
Your assets are now in the new contract. You can close the window during confirmation.

---

## For Operators: Deploy a Migration

### Pre-Migration (1 command)

```bash
# Test on testnet first
clarinet deploy --testnet
```

### Migration Day (5 commands)

```bash
# 1. Deploy new contract
clarinet deploy --mainnet

# 2. Update configuration
vim contract-config.json
# Change version and contract name

# 3. Validate configuration
cd scripts && npm run validate-config

# 4. Deploy frontend
cd frontend && npm run build && npm run deploy

# 5. Announce migration
# Post to GitHub, Discord, Twitter, Email
```

### Monitor Progress (1 command)

```bash
# Generate migration report
npm run migration-report -- --addresses users.txt
```

---

## For Developers: Test Migration Locally

### Setup (3 commands)

```bash
# 1. Install dependencies
cd scripts && npm install
cd ../frontend && npm install

# 2. Create .env file
cp .env.example .env
# Add your PRIVATE_KEY

# 3. Deploy to testnet
clarinet deploy --testnet
```

### Test Migration Flow (3 commands)

```bash
# 1. Check legacy balance
npm run check-legacy -- --address ST123... --network testnet

# 2. Migrate stake
npm run migrate -- --amount 100000000 --network testnet

# 3. Verify migration
npm run check-legacy -- --address ST123... --network testnet
```

---

## Common Commands

### Check if user needs to migrate
```bash
npm run check-legacy -- --address <address>
```

### Migrate user's stake
```bash
npm run migrate -- --amount <microSTX>
```

### Generate migration report
```bash
npm run migration-report -- --addresses users.txt --output report.json
```

### Validate configuration
```bash
npm run validate-config
```

---

## Troubleshooting

### "Migration button is disabled"
- You have active vote locks
- Wait for locks to expire
- Check unlock time in migration banner

### "Transaction failed"
- Check you have enough STX for fees
- Ensure wallet is connected
- Try again in a few minutes

### "Can't find legacy balance"
- Verify you're on the correct network
- Check contract address in config
- Ensure wallet address is correct

---

## Need Help?

- **Documentation**: [MIGRATION_README.md](./MIGRATION_README.md)
- **FAQ**: [MIGRATION_FAQ.md](./MIGRATION_FAQ.md)
- **Support**: support@sprintfund.xyz
- **Discord**: [Join our Discord](https://discord.gg/sprintfund)

---

**Quick Start Version**: 1.0  
**Last Updated**: 2026-04-29

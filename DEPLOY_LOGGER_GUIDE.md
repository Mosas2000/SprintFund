# Deploying sprintfund-logger to Mainnet

## Status: Ready to Deploy ✅

The deployment plan has been generated and validated. Follow these steps to complete the deployment:

## Deployment Steps

### 1. Apply the Deployment
```bash
cd /Users/macosbigsur/Documents/Code/Stacks-project/SprintFund/sprintfund
clarinet deployments apply --mainnet
```

### 2. Interactive Process
The command will prompt you for:
- **Confirmation**: Press `Y` to proceed
- **Private Key**: Enter your mainnet deployer key (SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T)
- **Transaction Signing**: Confirm the transaction

### 3. Expected Output
```
Broadcasting transaction...
Transaction ID: 0x...
```

### 4. Save Transaction Details

After deployment succeeds, add to `transactions.log`:
```bash
echo "DEPLOY_LOGGER: <your-tx-id> - Deploy Logger Contract" >> transactions.log
echo "CONTRACT: SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger" >> transactions.log
```

## Deployment Details

- **Contract**: sprintfund-logger
- **Path**: contracts/sprintfund-logger.clar
- **Expected Cost**: ~0.08 STX
- **Deployer**: SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T
- **Network**: Mainnet
- **Confirmation Time**: ~10-15 minutes

## After Deployment

1. Track transaction on explorer:
   ```
   https://explorer.hiro.so/txid/<YOUR_TX_ID>?chain=mainnet
   ```

2. Verify contract deployment:
   ```
   https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger?chain=mainnet
   ```

3. Commit deployment files:
   ```bash
   git add deployments/default.mainnet-plan.yaml transactions.log
   git commit -m "deploy: launch sprintfund-logger to mainnet"
   git push
   ```

## Contract Identifier

Once deployed, your contract will be accessible at:
```
SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger
```

## Functions Available

After deployment, you can interact with:
- `log-activity` - Create activity logs
- `get-activity` - Retrieve activity by ID
- `get-activity-count` - Get total activity count

## Troubleshooting

### "Transaction already in mempool"
Wait for the previous transaction to confirm before deploying.

### "Insufficient funds"
Ensure you have at least 0.1 STX (0.08 for deployment + fees).

### "Contract already exists"
The contract has already been deployed to this address.

## Next Steps

1. Wait for transaction confirmation (~10 minutes)
2. Test the deployed contract
3. Create activity logs using the `log-activity` function
4. Monitor activities on-chain

#!/bin/bash

# Post-Deployment Logger Script
# Run this after successful deployment to log transaction details

echo "============================================"
echo "SprintFund Logger Deployment Logger"
echo "============================================"
echo ""

# Prompt for transaction ID
read -p "Enter the deployment transaction ID: " TX_ID

if [ -z "$TX_ID" ]; then
    echo "ERROR: Transaction ID is required"
    exit 1
fi

# Save to transactions.log
echo "DEPLOY_LOGGER: $TX_ID - Deploy Logger Contract" >> transactions.log
echo "CONTRACT: SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger" >> transactions.log

echo ""
echo "✅ Saved to transactions.log"
echo ""
echo "Transaction details:"
echo "  TX ID: $TX_ID"
echo "  Contract: SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger"
echo ""
echo "Track deployment:"
echo "  https://explorer.hiro.so/txid/$TX_ID?chain=mainnet"
echo ""
echo "View contract (after confirmation):"
echo "  https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger?chain=mainnet"
echo ""
echo "============================================"
echo ""

# Ask if user wants to commit
read -p "Commit deployment files now? [Y/n]: " COMMIT_CHOICE

if [[ "$COMMIT_CHOICE" =~ ^[Yy]$ ]] || [ -z "$COMMIT_CHOICE" ]; then
    git add deployments/default.mainnet-plan.yaml transactions.log
    git commit -m "deploy: launch sprintfund-logger to mainnet"
    
    read -p "Push to remote? [Y/n]: " PUSH_CHOICE
    if [[ "$PUSH_CHOICE" =~ ^[Yy]$ ]] || [ -z "$PUSH_CHOICE" ]; then
        git push
        echo ""
        echo "✅ Deployment committed and pushed!"
    else
        echo ""
        echo "✅ Deployment committed (not pushed)"
    fi
else
    echo ""
    echo "Skipping commit. Run manually:"
    echo "  git add deployments/default.mainnet-plan.yaml transactions.log"
    echo "  git commit -m 'deploy: launch sprintfund-logger to mainnet'"
    echo "  git push"
fi

echo ""
echo "============================================"
echo "Next: Wait ~10 minutes for confirmation"
echo "============================================"

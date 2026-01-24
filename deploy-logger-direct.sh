#!/bin/bash

# Direct deployment script for sprintfund-logger
# This bypasses Clarinet and uses Stacks CLI directly

CONTRACT_FILE="contracts/sprintfund-logger.clar"
CONTRACT_NAME="sprintfund-logger"
FEE="10000"

echo "============================================"
echo "Direct Mainnet Deployment: sprintfund-logger"
echo "============================================"
echo ""

# Check if private key is set
if [ -z "$PAYMENT_KEY" ]; then
    echo "ERROR: PAYMENT_KEY environment variable not set"
    echo ""
    echo "Please set your private key:"
    echo "  export PAYMENT_KEY=\"your-private-key-here\""
    echo ""
    exit 1
fi

# Get account address and nonce
echo "Getting account information..."
ACCOUNT_ADDRESS=$(stx get_address "$PAYMENT_KEY" 2>/dev/null | grep -o 'SP[A-Z0-9]*' || echo "")

if [ -z "$ACCOUNT_ADDRESS" ]; then
    echo "ERROR: Could not derive address from private key"
    exit 1
fi

echo "Deployer address: $ACCOUNT_ADDRESS"
echo "Contract: $CONTRACT_NAME"
echo "Fee: ~0.01 STX"
echo ""

# Deploy contract
echo "Deploying contract to mainnet..."
echo ""

RESULT=$(stx deploy_contract \
    "$CONTRACT_FILE" \
    "$CONTRACT_NAME" \
    "$FEE" \
    0 \
    "$PAYMENT_KEY" \
    --testnet false 2>&1)

echo "$RESULT"
echo ""

# Extract transaction ID
TX_ID=$(echo "$RESULT" | grep -o '0x[a-fA-F0-9]*' | head -1)

if [ -n "$TX_ID" ]; then
    echo "============================================"
    echo "Deployment successful!"
    echo "============================================"
    echo "Transaction ID: $TX_ID"
    echo ""
    
    # Save to transactions.log
    echo "DEPLOY_LOGGER: $TX_ID - Deploy Logger Contract" >> transactions.log
    echo "CONTRACT: SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger" >> transactions.log
    echo "Saved to transactions.log"
    echo ""
    echo "Track deployment:"
    echo "https://explorer.hiro.so/txid/$TX_ID?chain=mainnet"
    echo ""
    echo "View contract (after confirmation):"
    echo "https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger?chain=mainnet"
else
    echo "ERROR: Failed to deploy contract"
    exit 1
fi

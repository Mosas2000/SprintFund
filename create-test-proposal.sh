#!/bin/bash

# SprintFund Test Proposal Creation Script
# This script broadcasts a create-proposal transaction to mainnet

# Contract details
CONTRACT_ADDRESS="SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T"
CONTRACT_NAME="sprintfund-core"
FUNCTION_NAME="create-proposal"

# Proposal parameters
AMOUNT="u50000000"
TITLE='"Test Proposal 1"'
DESCRIPTION='"Testing SprintFund proposal creation for Builder Rewards program"'

# Transaction parameters
FEE="10000"  # 0.01 STX in microSTX
NONCE="0"    # Update this with your account nonce

echo "============================================"
echo "SprintFund Test Proposal Creation"
echo "============================================"
echo ""
echo "Contract: $CONTRACT_ADDRESS.$CONTRACT_NAME"
echo "Function: $FUNCTION_NAME"
echo ""
echo "Parameters:"
echo "  - amount: $AMOUNT (50 STX)"
echo "  - title: $TITLE"
echo "  - description: $DESCRIPTION"
echo ""
echo "Expected fee: ~0.01 STX"
echo ""
echo "============================================"
echo ""

# Check if payment key is provided
if [ -z "$PAYMENT_KEY" ]; then
    echo "ERROR: PAYMENT_KEY environment variable not set"
    echo ""
    echo "Please set your private key:"
    echo "  export PAYMENT_KEY=\"your-private-key-here\""
    echo ""
    echo "Or run the command directly:"
    echo "  stx call_contract_func \\"
    echo "    $CONTRACT_ADDRESS \\"
    echo "    $CONTRACT_NAME \\"
    echo "    $FUNCTION_NAME \\"
    echo "    $FEE \\"
    echo "    $NONCE \\"
    echo "    \"\$PAYMENT_KEY\" \\"
    echo "    '$AMOUNT, $TITLE, $DESCRIPTION'"
    echo ""
    exit 1
fi

# Get account nonce
echo "Fetching account nonce..."
ACCOUNT_ADDRESS=$(stx get_address "$PAYMENT_KEY" 2>/dev/null | grep -o 'SP[A-Z0-9]*' || echo "")

if [ -z "$ACCOUNT_ADDRESS" ]; then
    echo "ERROR: Could not derive address from private key"
    exit 1
fi

echo "Account address: $ACCOUNT_ADDRESS"
echo ""

# Call the contract function
echo "Broadcasting transaction to mainnet..."
echo ""

RESULT=$(stx call_contract_func \
    "$CONTRACT_ADDRESS" \
    "$CONTRACT_NAME" \
    "$FUNCTION_NAME" \
    "$FEE" \
    "$NONCE" \
    "$PAYMENT_KEY" \
    "$AMOUNT, $TITLE, $DESCRIPTION")

echo "$RESULT"
echo ""

# Extract transaction ID
TX_ID=$(echo "$RESULT" | grep -o '0x[a-fA-F0-9]*' | head -1)

if [ -n "$TX_ID" ]; then
    echo "============================================"
    echo "Transaction broadcast successfully!"
    echo "============================================"
    echo "Transaction ID: $TX_ID"
    echo ""
    
    # Save to transactions.log
    echo "TX1: $TX_ID - Create Test Proposal" >> transactions.log
    echo "Saved to transactions.log"
    echo ""
    echo "Track your transaction:"
    echo "https://explorer.hiro.so/txid/$TX_ID?chain=mainnet"
else
    echo "ERROR: Failed to broadcast transaction"
    exit 1
fi

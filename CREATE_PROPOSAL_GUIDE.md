# Test Proposal Creation Guide

## Overview
This guide explains how to create a test proposal on the mainnet SprintFund contract.

**Contract**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core`  
**Function**: `create-proposal`

## Parameters
- **amount**: `u50000000` (50 STX in microSTX)
- **title**: "Test Proposal 1"
- **description**: "Testing SprintFund proposal creation for Builder Rewards program"

**Expected Cost**: ~0.01 STX

---

## ⚠️ Prerequisites

Before creating a proposal, you must have **at least 10 STX staked** in the contract. The contract requires a minimum stake of `u10000000` (10 STX) to create proposals.

To stake STX first:
1. Call the `stake` function with at least `u10000000` (10 STX)
2. Wait for the transaction to confirm
3. Then proceed to create your proposal

---

## Method 1: Using the Bash Script (Stacks CLI)

### Step 1: Set your private key
```bash
export PAYMENT_KEY="your-private-key-here"
```

### Step 2: Run the script
```bash
cd /Users/macosbigsur/Documents/Code/Stacks-project/SprintFund/sprintfund
./create-test-proposal.sh
```

The script will:
- Broadcast the transaction to mainnet
- Save the transaction ID to `transactions.log`
- Provide a link to track the transaction on the explorer

---

## Method 2: Using Stacks CLI Directly

```bash
# Set your private key
export PAYMENT_KEY="your-private-key-here"

# Get your account nonce (current transaction count)
# You can check this on the explorer: https://explorer.hiro.so/

# Call the contract
stx call_contract_func \
  SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T \
  sprintfund-core \
  create-proposal \
  10000 \
  0 \
  "$PAYMENT_KEY" \
  'u50000000, "Test Proposal 1", "Testing SprintFund proposal creation for Builder Rewards program"'
```

**Note**: Update the nonce value (5th parameter) with your account's current nonce.

---

## Method 3: Using Hiro Wallet (Browser Extension)

### Step 1: Open Hiro Wallet
1. Install [Hiro Wallet](https://wallet.hiro.so/) browser extension
2. Make sure you're connected to **Mainnet**
3. Ensure you have at least 10 STX staked + 0.01 STX for fees

### Step 2: Use the Contract Call Interface

**Option A: Via Explorer**
1. Go to the [contract on explorer](https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core?chain=mainnet)
2. Click on "Functions" tab
3. Find `create-proposal` function
4. Fill in the parameters:
   - **amount**: `50000000` (without the `u` prefix)
   - **title**: Test Proposal 1
   - **description**: Testing SprintFund proposal creation for Builder Rewards program
5. Click "Call function"
6. Approve the transaction in Hiro Wallet

**Option B: Via Stacks.js in Browser Console**
```javascript
// Open browser console and paste this code
const { openContractCall } = window.StacksConnect;

openContractCall({
  contractAddress: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T',
  contractName: 'sprintfund-core',
  functionName: 'create-proposal',
  functionArgs: [
    uintCV(50000000),
    stringUtf8CV('Test Proposal 1'),
    stringUtf8CV('Testing SprintFund proposal creation for Builder Rewards program')
  ],
  network: 'mainnet',
  onFinish: (data) => {
    console.log('Transaction ID:', data.txId);
    // Save to transactions.log manually
  }
});
```

---

## Method 4: Using a Custom Script (Recommended for App Integration)

Create a file `create-proposal.js`:

```javascript
const { makeContractCall, broadcastTransaction, AnchorMode } = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const fs = require('fs');

async function createProposal() {
  const network = new StacksMainnet();
  
  const txOptions = {
    contractAddress: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T',
    contractName: 'sprintfund-core',
    functionName: 'create-proposal',
    functionArgs: [
      uintCV(50000000),
      stringUtf8CV('Test Proposal 1'),
      stringUtf8CV('Testing SprintFund proposal creation for Builder Rewards program')
    ],
    senderKey: process.env.PRIVATE_KEY,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    fee: 10000
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  const txId = broadcastResponse.txid;
  console.log('Transaction ID:', txId);
  
  // Save to transactions.log
  fs.appendFileSync('transactions.log', `TX1: ${txId} - Create Test Proposal\n`);
  
  return txId;
}

createProposal();
```

Run with:
```bash
export PRIVATE_KEY="your-private-key"
node create-proposal.js
```

---

## Tracking Your Transaction

After broadcasting, track your transaction on the Stacks Explorer:
```
https://explorer.hiro.so/txid/<YOUR_TX_ID>?chain=mainnet
```

Transaction will be saved in `transactions.log` with format:
```
TX1: <transaction-id> - Create Test Proposal
```

---

## Troubleshooting

### Error: ERR-INSUFFICIENT-STAKE (u102)
- You need to stake at least 10 STX first
- Call the `stake` function before creating proposals

### Error: Transaction Failed
- Check your account has enough STX for fees
- Verify the nonce is correct
- Ensure you're on mainnet

### Error: Invalid Function Arguments
- Ensure amount is a uint: `u50000000`
- Ensure strings are properly quoted
- Check string length limits (title: 100 chars, description: 500 chars)

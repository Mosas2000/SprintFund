const { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV,
  stringUtf8CV
} = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createProposal() {
  // Check for private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('ERROR: PRIVATE_KEY environment variable not set');
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }

  console.log('============================================');
  console.log('SprintFund Test Proposal Creation');
  console.log('============================================\n');
  
  const network = new StacksMainnet();
  const contractAddress = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
  const contractName = 'sprintfund-core';
  
  console.log(`Contract: ${contractAddress}.${contractName}`);
  console.log('Function: create-proposal\n');
  
  console.log('Parameters:');
  console.log('  - amount: u50000000 (50 STX)');
  console.log('  - title: "Test Proposal 1"');
  console.log('  - description: "Testing SprintFund proposal creation for Builder Rewards program"\n');
  
  console.log('Expected fee: ~0.01 STX\n');
  console.log('============================================\n');

  try {
    console.log('Building transaction...');
    
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'create-proposal',
      functionArgs: [
        uintCV(50000000), // amount: 50 STX
        stringUtf8CV('Test Proposal 1'), // title
        stringUtf8CV('Testing SprintFund proposal creation for Builder Rewards program') // description
      ],
      senderKey: privateKey,
      validateWithAbi: true,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000 // 0.01 STX
    };

    const transaction = await makeContractCall(txOptions);
    
    console.log('Broadcasting transaction to mainnet...\n');
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    if (broadcastResponse.error) {
      console.error('ERROR:', broadcastResponse.error);
      if (broadcastResponse.reason) {
        console.error('Reason:', broadcastResponse.reason);
      }
      process.exit(1);
    }
    
    const txId = broadcastResponse.txid;
    
    console.log('============================================');
    console.log('Transaction broadcast successfully!');
    console.log('============================================');
    console.log(`Transaction ID: ${txId}\n`);
    
    // Save to transactions.log
    const logPath = path.join(__dirname, '..', 'transactions.log');
    const logEntry = `TX1: ${txId} - Create Test Proposal\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log('Saved to transactions.log\n');
    
    console.log('Track your transaction:');
    console.log(`https://explorer.hiro.so/txid/${txId}?chain=mainnet\n`);
    
    return txId;
  } catch (error) {
    console.error('ERROR:', error.message);
    
    if (error.message.includes('ERR-INSUFFICIENT-STAKE')) {
      console.log('\n⚠️  You need to stake at least 10 STX first!');
      console.log('Run: npm run stake\n');
    }
    
    process.exit(1);
  }
}

// Run the function
createProposal();

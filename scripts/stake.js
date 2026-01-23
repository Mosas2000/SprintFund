const { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV
} = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
require('dotenv').config();

async function stakeSTX() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('ERROR: PRIVATE_KEY environment variable not set');
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }

  console.log('============================================');
  console.log('SprintFund Stake STX');
  console.log('============================================\n');
  
  const network = new StacksMainnet();
  const contractAddress = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
  const contractName = 'sprintfund-core';
  const stakeAmount = 10000000; // 10 STX minimum
  
  console.log(`Contract: ${contractAddress}.${contractName}`);
  console.log('Function: stake\n');
  console.log(`Staking: ${stakeAmount / 1000000} STX\n`);
  console.log('============================================\n');

  try {
    console.log('Building transaction...');
    
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'stake',
      functionArgs: [
        uintCV(stakeAmount)
      ],
      senderKey: privateKey,
      validateWithAbi: true,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000
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
    console.log('Stake transaction broadcast successfully!');
    console.log('============================================');
    console.log(`Transaction ID: ${txId}\n`);
    console.log('Track your transaction:');
    console.log(`https://explorer.hiro.so/txid/${txId}?chain=mainnet\n`);
    console.log('Wait for confirmation before creating proposals.\n');
    
    return txId;
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

stakeSTX();

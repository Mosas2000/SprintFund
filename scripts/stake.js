import { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import {
  parseArgs,
  getNetwork,
  getExplorerUrl,
  validatePrivateKey,
  confirmMainnetTransaction,
  logDryRun,
  printUsage
} from './lib/script-utils.js';

dotenv.config();

async function stakeSTX() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage('stake.js');
    process.exit(0);
  }

  const options = parseArgs(args);
  const network = getNetwork(options.network);
  
  const keyResult = validatePrivateKey(process.env.PRIVATE_KEY);
  if (!keyResult.valid) {
    console.error(`ERROR: ${keyResult.error}`);
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }

  const privateKey = keyResult.key;
  const contractAddress = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
  const contractName = 'sprintfund-core-v3';
  const stakeAmount = 10000000;
  
  console.log('============================================');
  console.log('SprintFund Stake STX');
  console.log('============================================\n');
  console.log(`Network: ${options.network}`);
  console.log(`Contract: ${contractAddress}.${contractName}`);
  console.log('Function: stake\n');
  console.log(`Staking: ${stakeAmount / 1000000} STX\n`);
  console.log('============================================\n');

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

  if (options.dryRun) {
    logDryRun({
      action: 'Stake STX',
      network: options.network,
      contract: `${contractAddress}.${contractName}`,
      function: 'stake',
      args: {
        amount: `${stakeAmount / 1000000} STX`
      },
      fee: '0.01 STX'
    });
    return;
  }

  if (options.network === 'mainnet' && !options.skipConfirm) {
    const confirmed = await confirmMainnetTransaction({
      action: 'Stake STX',
      contract: `${contractAddress}.${contractName}`,
      function: 'stake',
      amount: `${stakeAmount / 1000000} STX`,
      fee: '0.01 STX'
    });
    if (!confirmed) {
      console.log('Transaction cancelled.\n');
      process.exit(0);
    }
  }

  try {
    console.log('Building transaction...');
    const transaction = await makeContractCall(txOptions);
    
    console.log(`Broadcasting transaction to ${options.network}...\n`);
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
    console.log(getExplorerUrl(options.network, txId) + '\n');
    console.log('Wait for confirmation before creating proposals.\n');
    
    return txId;
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

stakeSTX();

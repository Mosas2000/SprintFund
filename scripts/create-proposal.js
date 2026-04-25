import { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV,
  stringUtf8CV
} from '@stacks/transactions';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createProposal() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage('create-proposal.js');
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
  const amount = 50000000;
  const title = 'Test Proposal 1';
  const description = 'Testing SprintFund proposal creation for Builder Rewards program';
  
  console.log('============================================');
  console.log('SprintFund Test Proposal Creation');
  console.log('============================================\n');
  console.log(`Network: ${options.network}`);
  console.log(`Contract: ${contractAddress}.${contractName}`);
  console.log('Function: create-proposal\n');
  console.log('Parameters:');
  console.log(`  - amount: u${amount} (${amount / 1000000} STX)`);
  console.log(`  - title: "${title}"`);
  console.log(`  - description: "${description}"\n`);
  console.log('Expected fee: ~0.01 STX\n');
  console.log('============================================\n');

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'create-proposal',
    functionArgs: [
      uintCV(amount),
      stringUtf8CV(title),
      stringUtf8CV(description)
    ],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    fee: 10000
  };

  if (options.dryRun) {
    logDryRun({
      action: 'Create Proposal',
      network: options.network,
      contract: `${contractAddress}.${contractName}`,
      function: 'create-proposal',
      args: {
        amount: `${amount / 1000000} STX`,
        title,
        description
      },
      fee: '0.01 STX'
    });
    return;
  }

  if (options.network === 'mainnet' && !options.skipConfirm) {
    const confirmed = await confirmMainnetTransaction({
      action: 'Create Proposal',
      contract: `${contractAddress}.${contractName}`,
      function: 'create-proposal',
      amount: `${amount / 1000000} STX`,
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
    console.log('Transaction broadcast successfully!');
    console.log('============================================');
    console.log(`Transaction ID: ${txId}\n`);
    
    const logPath = path.join(__dirname, '..', 'transactions.log');
    const logEntry = `TX1: ${txId} - Create Test Proposal (${options.network})\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log('Saved to transactions.log\n');
    
    console.log('Track your transaction:');
    console.log(getExplorerUrl(options.network, txId) + '\n');
    
    return txId;
  } catch (error) {
    console.error('ERROR:', error.message);
    
    if (error.message.includes('ERR-INSUFFICIENT-STAKE')) {
      console.log('\nYou need to stake at least 10 STX first!');
      console.log('Run: npm run stake\n');
    }
    
    process.exit(1);
  }
}

createProposal();

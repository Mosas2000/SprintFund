import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
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

const contractCode = fs.readFileSync('../contracts/sprintfund-logger.clar', 'utf8');

async function deployLogger() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage('deploy-logger.js');
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
  const contractName = 'sprintfund-logger';
  
  console.log(`\nDeploying ${contractName} to ${options.network}...\n`);
  
  const txOptions = {
    contractName,
    codeBody: contractCode,
    senderKey: privateKey,
    network,
    anchorMode: AnchorMode.Any,
  };

  if (options.dryRun) {
    logDryRun({
      action: 'Deploy Contract',
      network: options.network,
      contract: contractName,
      args: {
        codeSize: `${contractCode.length} bytes`
      }
    });
    return;
  }

  if (options.network === 'mainnet' && !options.skipConfirm) {
    const confirmed = await confirmMainnetTransaction({
      action: 'Deploy Contract',
      contract: contractName
    });
    if (!confirmed) {
      console.log('Transaction cancelled.\n');
      process.exit(0);
    }
  }

  try {
    const transaction = await makeContractDeploy(txOptions);
    const result = await broadcastTransaction(transaction, network);
    
    if (result.error) {
      console.error('ERROR:', result.error);
      if (result.reason) {
        console.error('Reason:', result.reason);
      }
      process.exit(1);
    }
    
    console.log('Deployment TX:', result.txid);
    console.log('Explorer:', getExplorerUrl(options.network, result.txid));
    
    const logEntry = `DEPLOY_LOGGER: ${result.txid} - Deploy Logger Contract (${options.network})\n`;
    fs.appendFileSync('../transactions.log', logEntry);
    
    return result.txid;
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

deployLogger();

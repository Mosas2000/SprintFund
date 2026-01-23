import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const contractCode = fs.readFileSync('../contracts/sprintfund-logger.clar', 'utf8');

async function deployLogger() {
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ ERROR: PRIVATE_KEY not set in .env file');
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }
  
  // Clean the private key (remove quotes, 0x prefix, whitespace)
  let privateKey = process.env.PRIVATE_KEY.trim();
  privateKey = privateKey.replace(/^["']|["']$/g, ''); // Remove quotes
  privateKey = privateKey.replace(/^0x/i, ''); // Remove 0x prefix if present
  
  // Validate private key format (should be 64 or 66 hex characters)
  // 66 chars includes the compression suffix "01" which is valid
  if (!/^[0-9a-fA-F]{64,66}$/.test(privateKey)) {
    console.error('❌ ERROR: Invalid private key format');
    console.log('\nPrivate key should be 64-66 hexadecimal characters');
    console.log('Example: abcd1234...(64-66 chars total)');
    console.log('Current length:', privateKey.length);
    process.exit(1);
  }
  
  console.log('🚀 Deploying sprintfund-logger to mainnet...\n');
  const txOptions = {
    contractName: 'sprintfund-logger',
    codeBody: contractCode,
    senderKey: privateKey,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractDeploy(txOptions);
  const result = await broadcastTransaction(transaction, new StacksMainnet());
  
  console.log('✅ Deployment TX:', result.txid);
  console.log('Explorer:', `https://explorer.hiro.so/txid/${result.txid}?chain=mainnet`);
  
  const logEntry = `DEPLOY_LOGGER: ${result.txid} - Deploy Logger Contract\n`;
  fs.appendFileSync('../transactions.log', logEntry);
  
  return result.txid;
}

deployLogger().catch(console.error);

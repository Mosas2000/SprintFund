export const STACKS_MAINNET_MIGRATION_EXAMPLES = {
  before: `
// OLD (DEPRECATED)
import { StacksMainnet } from '@stacks/network';
import { makeContractCall, broadcastTransaction } from '@stacks/transactions';

async function executeTransaction() {
  const network = new StacksMainnet();
  
  const txOptions = {
    contractAddress: 'SP...',
    contractName: 'my-contract',
    functionName: 'my-function',
    functionArgs: [],
    senderKey: process.env.PRIVATE_KEY,
    network: network,
    anchorMode: AnchorMode.Any,
  };
  
  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}
  `,

  after: `
// NEW (CURRENT)
import { STACKS_MAINNET } from '@stacks/network';
import { makeContractCall, broadcastTransaction } from '@stacks/transactions';

async function executeTransaction() {
  const txOptions = {
    contractAddress: 'SP...',
    contractName: 'my-contract',
    functionName: 'my-function',
    functionArgs: [],
    senderKey: process.env.PRIVATE_KEY,
    network: STACKS_MAINNET,
    anchorMode: AnchorMode.Any,
  };
  
  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, STACKS_MAINNET);
  return result;
}
  `,

  keyDifferences: [
    'No need to instantiate with "new" operator',
    'STACKS_MAINNET is a singleton constant',
    'Removes unnecessary object instantiation',
    'Improves compatibility with newer @stacks/network versions',
    'Reduces memory overhead',
  ],

  filesUpdated: [
    'scripts/call-logger.js',
    'scripts/deploy-logger.js',
    'scripts/stake.js',
    'scripts/create-proposal.js',
  ],
};

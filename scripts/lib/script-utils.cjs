const { StacksMainnet, StacksTestnet, StacksDevnet } = require('@stacks/network');
const readline = require('readline');

const STACKS_MAINNET = new StacksMainnet();
const STACKS_TESTNET = new StacksTestnet();
const STACKS_DEVNET = new StacksDevnet();

const NETWORKS = {
  mainnet: STACKS_MAINNET,
  testnet: STACKS_TESTNET,
  devnet: STACKS_DEVNET
};

const EXPLORER_URLS = {
  mainnet: 'https://explorer.hiro.so/txid/',
  testnet: 'https://explorer.hiro.so/txid/',
  devnet: 'http://localhost:8000/txid/'
};

function parseArgs(args = process.argv.slice(2)) {
  const options = {
    dryRun: false,
    network: 'mainnet',
    skipConfirm: false
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg.startsWith('--network=')) {
      const network = arg.split('=')[1];
      if (!NETWORKS[network]) {
        console.error(`Invalid network: ${network}`);
        console.error('Valid options: mainnet, testnet, devnet');
        process.exit(1);
      }
      options.network = network;
    } else if (arg === '--yes' || arg === '-y') {
      options.skipConfirm = true;
    }
  }

  return options;
}

function getNetwork(networkName) {
  return NETWORKS[networkName] || STACKS_MAINNET;
}

function getExplorerUrl(networkName, txId) {
  const baseUrl = EXPLORER_URLS[networkName] || EXPLORER_URLS.mainnet;
  const chainParam = networkName === 'devnet' ? '' : `?chain=${networkName}`;
  return `${baseUrl}${txId}${chainParam}`;
}

function validatePrivateKey(privateKey) {
  if (!privateKey) {
    return { valid: false, error: 'PRIVATE_KEY not set in environment' };
  }

  let cleaned = privateKey.trim();
  cleaned = cleaned.replace(/^["']|["']$/g, '');
  cleaned = cleaned.replace(/^0x/i, '');

  if (!/^[0-9a-fA-F]{64,66}$/.test(cleaned)) {
    return { 
      valid: false, 
      error: `Invalid private key format (length: ${cleaned.length}, expected: 64-66 hex chars)` 
    };
  }

  return { valid: true, key: cleaned };
}

async function confirmMainnetTransaction(details) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n========================================');
  console.log('MAINNET TRANSACTION CONFIRMATION');
  console.log('========================================');
  console.log(`Action: ${details.action}`);
  if (details.contract) {
    console.log(`Contract: ${details.contract}`);
  }
  if (details.function) {
    console.log(`Function: ${details.function}`);
  }
  if (details.amount) {
    console.log(`Amount: ${details.amount}`);
  }
  if (details.fee) {
    console.log(`Fee: ${details.fee}`);
  }
  console.log('========================================\n');

  return new Promise((resolve) => {
    rl.question('Proceed with mainnet transaction? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

function logDryRun(details) {
  console.log('\n========================================');
  console.log('DRY RUN - No transaction will be broadcast');
  console.log('========================================');
  console.log(`Action: ${details.action}`);
  console.log(`Network: ${details.network}`);
  if (details.contract) {
    console.log(`Contract: ${details.contract}`);
  }
  if (details.function) {
    console.log(`Function: ${details.function}`);
  }
  if (details.args) {
    console.log('Arguments:');
    for (const [key, value] of Object.entries(details.args)) {
      console.log(`  ${key}: ${value}`);
    }
  }
  if (details.fee) {
    console.log(`Fee: ${details.fee}`);
  }
  console.log('========================================');
  console.log('Transaction built successfully (not broadcast)');
  console.log('========================================\n');
}

function printUsage(scriptName, additionalOptions = '') {
  console.log(`\nUsage: node ${scriptName} [options]`);
  console.log('\nOptions:');
  console.log('  --dry-run         Build transaction without broadcasting');
  console.log('  --network=NAME    Target network: mainnet, testnet, devnet (default: mainnet)');
  console.log('  --yes, -y         Skip confirmation prompt for mainnet transactions');
  if (additionalOptions) {
    console.log(additionalOptions);
  }
  console.log('\nExamples:');
  console.log(`  node ${scriptName} --dry-run`);
  console.log(`  node ${scriptName} --network=testnet`);
  console.log(`  node ${scriptName} --network=mainnet --yes`);
  console.log('');
}

module.exports = {
  parseArgs,
  getNetwork,
  getExplorerUrl,
  validatePrivateKey,
  confirmMainnetTransaction,
  logDryRun,
  printUsage
};

import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

const mnemonic = process.argv.slice(2).join(' ');

if (!mnemonic || mnemonic.split(' ').length < 12) {
  console.error('Usage: node get-private-key.js <your 24-word mnemonic>');
  process.exit(1);
}

const wallet = await generateWallet({
  secretKey: mnemonic,
  password: ''
});

const account = wallet.accounts[0];
const privateKey = account.stxPrivateKey;
const address = getStxAddress({ account, transactionVersion: 1 }); // mainnet

console.log('\n✅ Wallet Information:');
console.log('Address:', address);
console.log('Private Key:', privateKey);
console.log('\nAdd to your .env file:');
console.log(`PRIVATE_KEY=${privateKey}`);

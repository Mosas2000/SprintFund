import { ContractEvent } from '../types/contract-events';

interface ContractTransaction {
  tx_id: string;
  block_time: number;
  sender_address: string;
  contract_call?: {
    contract_id: string;
    function_name: string;
  };
  tx_result: {
    repr: string;
  };
}

const parseClarity = (repr: string): any => {
  if (repr.startsWith('u') && !isNaN(Number(repr.slice(1)))) {
    return Number(repr.slice(1));
  }
  if (repr.startsWith('"') && repr.endsWith('"')) {
    return repr.slice(1, -1);
  }
  if (repr === 'true') return true;
  if (repr === 'false') return false;
  return repr;
};

export const normalizeContractTransaction = (
  tx: ContractTransaction,
  contractPrincipal: string
): ContractEvent | null => {
  if (!tx.contract_call) return null;
  if (!tx.contract_call.contract_id.startsWith(contractPrincipal)) return null;

  const functionName = tx.contract_call.function_name.toLowerCase();
  const resultRepr = tx.tx_result.repr.toLowerCase();
  const isSuccess = !(
    resultRepr.includes('(err') ||
    resultRepr.startsWith('err') ||
    resultRepr.includes('error')
  );
  const timestamp = tx.block_time * 1000;
  const sender = tx.sender_address;
  const txId = tx.tx_id;

  switch (functionName) {
    case 'stake':
      return {
        id: `${txId}-stake`,
        txId,
        timestamp,
        sender,
        category: 'stake',
        status: isSuccess ? 'success' : 'failed',
        description: `Staked tokens`,
        amount: parseClarity(tx.tx_result.repr)?.toString(),
        weight: parseClarity(tx.tx_result.repr),
      };

    case 'propose':
      return {
        id: `${txId}-proposal`,
        txId,
        timestamp,
        sender,
        category: 'proposal',
        status: isSuccess ? 'success' : 'failed',
        description: 'Created proposal',
        proposalId: parseClarity(tx.tx_result.repr)?.toString(),
      };

    case 'vote':
      return {
        id: `${txId}-vote`,
        txId,
        timestamp,
        sender,
        category: 'vote',
        status: isSuccess ? 'success' : 'failed',
        description: 'Voted on proposal',
        weight: parseClarity(tx.tx_result.repr),
      };

    case 'cancel-proposal':
      return {
        id: `${txId}-cancel`,
        txId,
        timestamp,
        sender,
        category: 'cancel',
        status: isSuccess ? 'success' : 'failed',
        description: 'Cancelled proposal',
      };

    case 'execute-proposal':
      return {
        id: `${txId}-execute`,
        txId,
        timestamp,
        sender,
        category: 'execute',
        status: isSuccess ? 'success' : 'failed',
        description: 'Executed proposal',
      };

    case 'treasury-transfer':
    case 'treasury-allocation':
      return {
        id: `${txId}-treasury`,
        txId,
        timestamp,
        sender,
        category: 'treasury',
        status: isSuccess ? 'success' : 'failed',
        description: functionName === 'treasury-transfer' 
          ? 'Treasury transfer' 
          : 'Treasury allocation',
        amount: parseClarity(tx.tx_result.repr)?.toString(),
      };

    default:
      return null;
  }
};

export const fetchContractEventStream = async (
  contractPrincipal: string,
  apiUrl: string = 'https://api.mainnet.hiro.so',
  limit: number = 50
): Promise<ContractEvent[]> => {
  const url = new URL(`${apiUrl}/extended/v2/addresses/${contractPrincipal}/transactions`);
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch contract events: ${response.statusText}`);
  }

  const data = await response.json();
  const transactions: ContractTransaction[] = data.results || [];

  return transactions
    .map(tx => normalizeContractTransaction(tx, contractPrincipal))
    .filter((event): event is ContractEvent => event !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
};

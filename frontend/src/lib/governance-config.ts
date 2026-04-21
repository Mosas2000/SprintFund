export const GOVERNANCE_CONFIG = {
  CONTRACT_PRINCIPAL: 'SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund',
  API_URL: 'https://api.mainnet.hiro.so',
  EVENT_POLL_INTERVAL: 20000,
  NOTIFICATION_POLL_INTERVAL: 30000,
  NOTIFICATION_DEDUP_WINDOW: 30000,
  TOAST_AUTO_DISMISS_DELAY: 6000,
};

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  stake: 'Staking',
  proposal: 'Proposals',
  vote: 'Voting',
  cancel: 'Cancellations',
  execute: 'Executions',
  treasury: 'Treasury',
};

export const EVENT_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  stake: 'Token staking transactions',
  proposal: 'New governance proposals',
  vote: 'Proposal voting activity',
  cancel: 'Cancelled proposals',
  execute: 'Executed proposals',
  treasury: 'Treasury transfers and allocations',
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  proposalCreated: 'New Proposals',
  proposalVoting: 'Voting Updates',
  proposalExecuted: 'Executed Proposals',
  proposalCancelled: 'Cancelled Proposals',
  delegationReceived: 'Delegation',
};

export const getExplorerUrl = (txId: string): string => {
  return `https://explorer.stacks.co/txid/${txId}?chain=mainnet`;
};

export const formatContractAddress = (address: string): string => {
  if (address.length < 12) return address;
  return `${address.slice(0, 8)}...${address.slice(-4)}`;
};

export const isProductionEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const getApiUrl = (): string => {
  if (isProductionEnvironment()) {
    return GOVERNANCE_CONFIG.API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || GOVERNANCE_CONFIG.API_URL;
};

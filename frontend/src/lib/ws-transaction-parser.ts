import type { WsMessage, Notification, NotificationType } from '../types/notification';
import { generateNotificationId } from '../store/notifications';
import { CONTRACT_PRINCIPAL } from '../config';

export function parseWsTransaction(message: WsMessage, userAddress: string | null): Notification | null {
  if (message.event !== 'transaction') return null;

  const { payload } = message;
  if (!payload.contract_call) return null;
  if (payload.tx_status !== 'success') return null;

  const { contract_id, function_name, function_args } = payload.contract_call;
  if (contract_id !== CONTRACT_PRINCIPAL) return null;

  const now = Date.now();

  if (function_name === 'create-proposal') {
    return {
      id: generateNotificationId(),
      type: 'proposal_created' as NotificationType,
      title: 'New proposal created on-chain',
      createdAt: now,
      read: false,
      txId: payload.tx_id,
    };
  }

  if (function_name === 'vote-for' || function_name === 'vote-against') {
    const proposalArg = function_args?.[0]?.repr;
    const proposalId = proposalArg ? parseInt(proposalArg.replace('u', ''), 10) : undefined;

    return {
      id: generateNotificationId(),
      type: 'vote_received' as NotificationType,
      title: `Vote cast on proposal${proposalId ? ` #${proposalId}` : ''}`,
      createdAt: now,
      read: false,
      proposalId: isNaN(proposalId as number) ? undefined : proposalId,
      txId: payload.tx_id,
    };
  }

  if (function_name === 'execute-proposal') {
    const proposalArg = function_args?.[0]?.repr;
    const proposalId = proposalArg ? parseInt(proposalArg.replace('u', ''), 10) : undefined;

    return {
      id: generateNotificationId(),
      type: 'proposal_executed' as NotificationType,
      title: `Proposal${proposalId ? ` #${proposalId}` : ''} executed`,
      createdAt: now,
      read: false,
      proposalId: isNaN(proposalId as number) ? undefined : proposalId,
      txId: payload.tx_id,
    };
  }

  return null;
}

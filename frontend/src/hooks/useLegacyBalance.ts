import { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToValue, standardPrincipalCV } from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS } from '../config';

export interface LegacyBalanceInfo {
  hasLegacyAssets: boolean;
  stakedAmount: number;
  stakedSTX: number;
  reputation: number;
  hasActiveLocks: boolean;
  lockAmount: number;
  unlockHeight: number;
  canMigrateNow: boolean;
  isLoading: boolean;
  error: string | null;
}

const LEGACY_CONTRACTS = {
  v1: 'sprintfund-core',
  v2: 'sprintfund-core-v2'
};

/**
 * Hook to check if user has assets in legacy contract versions
 * Used to prompt users to migrate to the current contract version
 */
export function useLegacyBalance(userAddress: string | undefined, version: 'v1' | 'v2' = 'v1') {
  const [balanceInfo, setBalanceInfo] = useState<LegacyBalanceInfo>({
    hasLegacyAssets: false,
    stakedAmount: 0,
    stakedSTX: 0,
    reputation: 0,
    hasActiveLocks: false,
    lockAmount: 0,
    unlockHeight: 0,
    canMigrateNow: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!userAddress) {
      setBalanceInfo(prev => ({ ...prev, isLoading: false }));
      return;
    }

    let isMounted = true;

    async function checkLegacyBalance() {
      try {
        const legacyContractName = LEGACY_CONTRACTS[version];

        // Check staked balance
        const stakeResult = await callReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: legacyContractName,
          functionName: 'get-stake',
          functionArgs: [standardPrincipalCV(userAddress)],
          network: NETWORK,
          senderAddress: userAddress,
        });

        const stakeValue = cvToValue(stakeResult);
        const stakedAmount = Number(stakeValue.value) || 0;

        // Check reputation
        let reputation = 0;
        try {
          const repResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: legacyContractName,
            functionName: 'get-reputation',
            functionArgs: [standardPrincipalCV(userAddress)],
            network: NETWORK,
            senderAddress: userAddress,
          });

          const repValue = cvToValue(repResult);
          reputation = Number(repValue.value) || 0;
        } catch (error) {
          // Reputation function might not exist in all versions
          reputation = 0;
        }

        // Check vote locks
        let hasActiveLocks = false;
        let lockAmount = 0;
        let unlockHeight = 0;
        try {
          const lockResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: legacyContractName,
            functionName: 'get-vote-lock',
            functionArgs: [standardPrincipalCV(userAddress)],
            network: NETWORK,
            senderAddress: userAddress,
          });

          const lockValue = cvToValue(lockResult);
          if (lockValue.value) {
            lockAmount = Number(lockValue.value.amount) || 0;
            unlockHeight = Number(lockValue.value.unlockHeight) || 0;
            hasActiveLocks = lockAmount > 0;
          }
        } catch (error) {
          // Lock function might not exist in all versions
          hasActiveLocks = false;
        }

        const hasLegacyAssets = stakedAmount > 0 || reputation > 0;
        const canMigrateNow = hasLegacyAssets && !hasActiveLocks;

        if (isMounted) {
          setBalanceInfo({
            hasLegacyAssets,
            stakedAmount,
            stakedSTX: stakedAmount / 1000000,
            reputation,
            hasActiveLocks,
            lockAmount,
            unlockHeight,
            canMigrateNow,
            isLoading: false,
            error: null
          });
        }
      } catch (error: any) {
        if (isMounted) {
          setBalanceInfo(prev => ({
            ...prev,
            isLoading: false,
            error: error.message || 'Failed to check legacy balance'
          }));
        }
      }
    }

    checkLegacyBalance();

    return () => {
      isMounted = false;
    };
  }, [userAddress, version]);

  return balanceInfo;
}

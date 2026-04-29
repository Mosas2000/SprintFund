import React, { useState } from 'react';
import { useLegacyBalance } from '../hooks/useLegacyBalance';
import { useOpenContractCall } from '@micro-stacks/react';
import { uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS } from '../config';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
}

type MigrationStep = 'review' | 'withdrawing' | 'staking' | 'complete' | 'error';

export function MigrationModal({ isOpen, onClose, userAddress }: MigrationModalProps) {
  const legacyBalance = useLegacyBalance(userAddress);
  const { openContractCall } = useOpenContractCall();
  const [currentStep, setCurrentStep] = useState<MigrationStep>('review');
  const [error, setError] = useState<string | null>(null);
  const [withdrawTxId, setWithdrawTxId] = useState<string | null>(null);
  const [stakeTxId, setStakeTxId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMigrate = async () => {
    try {
      setCurrentStep('withdrawing');
      setError(null);

      // Step 1: Withdraw from legacy contract
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: 'sprintfund-core',
        functionName: 'withdraw-stake',
        functionArgs: [uintCV(legacyBalance.stakedAmount)],
        onFinish: (data) => {
          setWithdrawTxId(data.txId);
          handleStake();
        },
        onCancel: () => {
          setCurrentStep('review');
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw from legacy contract');
      setCurrentStep('error');
    }
  };

  const handleStake = async () => {
    try {
      setCurrentStep('staking');

      // Step 2: Stake in new contract
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: 'sprintfund-core-v3',
        functionName: 'stake',
        functionArgs: [uintCV(legacyBalance.stakedAmount)],
        onFinish: (data) => {
          setStakeTxId(data.txId);
          setCurrentStep('complete');
        },
        onCancel: () => {
          setError('Stake transaction cancelled. Your STX has been withdrawn but not re-staked.');
          setCurrentStep('error');
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to stake in new contract');
      setCurrentStep('error');
    }
  };

  const handleClose = () => {
    setCurrentStep('review');
    setError(null);
    setWithdrawTxId(null);
    setStakeTxId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Migrate to New Contract
                </h3>

                {currentStep === 'review' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Migration Details</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Staked Amount:</dt>
                          <dd className="font-medium text-gray-900">{legacyBalance.stakedSTX.toFixed(2)} STX</dd>
                        </div>
                        {legacyBalance.reputation > 0 && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Reputation:</dt>
                            <dd className="font-medium text-gray-900">{legacyBalance.reputation}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Estimated Fees:</dt>
                          <dd className="font-medium text-gray-900">~0.025 STX</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-yellow-900 mb-2">What Happens</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                        <li>Withdraw your STX from the old contract</li>
                        <li>Re-stake in the new contract</li>
                        <li>Your voting power will be recalculated</li>
                        <li>Reputation will be preserved</li>
                      </ol>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Important Notes</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>This process requires two transactions</li>
                        <li>Each transaction needs wallet approval</li>
                        <li>Transactions may take 10-30 minutes to confirm</li>
                        <li>You can close this window during confirmation</li>
                      </ul>
                    </div>
                  </div>
                )}

                {currentStep === 'withdrawing' && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700">Withdrawing from legacy contract...</p>
                    <p className="text-sm text-gray-500 mt-2">Please approve the transaction in your wallet</p>
                  </div>
                )}

                {currentStep === 'staking' && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700">Staking in new contract...</p>
                    <p className="text-sm text-gray-500 mt-2">Please approve the transaction in your wallet</p>
                    {withdrawTxId && (
                      <p className="text-xs text-gray-400 mt-4">
                        Withdrawal TX: {withdrawTxId.substring(0, 8)}...
                      </p>
                    )}
                  </div>
                )}

                {currentStep === 'complete' && (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg
                        className="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Migration Complete!</h4>
                    <p className="text-gray-700 mb-4">
                      Your stake has been successfully migrated to the new contract.
                    </p>
                    <div className="bg-gray-50 rounded-md p-4 text-left">
                      <p className="text-sm text-gray-700 mb-2">Transaction IDs:</p>
                      {withdrawTxId && (
                        <p className="text-xs text-gray-600 mb-1">
                          Withdraw: <span className="font-mono">{withdrawTxId.substring(0, 16)}...</span>
                        </p>
                      )}
                      {stakeTxId && (
                        <p className="text-xs text-gray-600">
                          Stake: <span className="font-mono">{stakeTxId.substring(0, 16)}...</span>
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Transactions may take 10-30 minutes to confirm.
                    </p>
                  </div>
                )}

                {currentStep === 'error' && (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Migration Failed</h4>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">
                      Please try again or contact support if the issue persists.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {currentStep === 'review' && (
              <>
                <button
                  type="button"
                  onClick={handleMigrate}
                  disabled={!legacyBalance.canMigrateNow}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Start Migration
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </>
            )}

            {(currentStep === 'complete' || currentStep === 'error') && (
              <button
                type="button"
                onClick={handleClose}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

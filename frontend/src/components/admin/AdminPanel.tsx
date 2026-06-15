'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV, AnchorMode } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, microToStx, stxToMicro } from '../../../config';
import { fetchMinStakeAmount, fetchContractOwner, isContractOwner } from '../../lib/contract-info';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  userAddress?: string;
}

export default function AdminPanel({ userAddress }: AdminPanelProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMinStake, setCurrentMinStake] = useState<number>(100);
  const [newMinStake, setNewMinStake] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userAddress) {
      checkOwnership();
      loadMinStake();
    }
  }, [userAddress]);

  async function checkOwnership() {
    if (!userAddress) return;
    setLoading(true);
    try {
      const ownerStatus = await isContractOwner(userAddress);
      setIsOwner(ownerStatus);
    } catch (error) {
      console.error('Failed to check ownership:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMinStake() {
    try {
      const minStake = await fetchMinStakeAmount();
      setCurrentMinStake(minStake);
    } catch (error) {
      console.error('Failed to load min stake:', error);
    }
  }

  async function handleUpdateMinStake(e: React.FormEvent) {
    e.preventDefault();
    if (!newMinStake || !userAddress) return;

    const microAmount = stxToMicro(parseFloat(newMinStake));
    if (microAmount <= 0) {
      toast.error('Minimum stake must be greater than 0');
      return;
    }

    setUpdating(true);
    try {
      await openContractCall({
        network: STACKS_MAINNET,
        anchorMode: AnchorMode.Any,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'set-min-stake-amount',
        functionArgs: [uintCV(microAmount)],
        onFinish: (data) => {
          toast.success('Minimum stake update submitted!');
          setNewMinStake('');
          setTimeout(loadMinStake, 3000);
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Failed to update min stake:', error);
      toast.error('Failed to update minimum stake');
    } finally {
      setUpdating(false);
    }
  }

  async function handleTransferOwnership(e: React.FormEvent) {
    e.preventDefault();
    if (!newOwner || !userAddress) return;

    // Basic principal validation
    if (!newOwner.startsWith('SP') && !newOwner.startsWith('ST')) {
      toast.error('Invalid principal address');
      return;
    }

    setUpdating(true);
    try {
      await openContractCall({
        network: STACKS_MAINNET,
        anchorMode: AnchorMode.Any,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'transfer-ownership',
        functionArgs: [principalCV(newOwner)],
        onFinish: (data) => {
          toast.success('Ownership transfer submitted!');
          setNewOwner('');
          setTimeout(checkOwnership, 3000);
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Failed to transfer ownership:', error);
      toast.error('Failed to transfer ownership');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <p className="text-slate-400">Loading admin panel...</p>
      </div>
    );
  }

  if (!isOwner) {
    return null; // Don't show admin panel to non-owners
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
          <span className="text-2xl">👑</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Admin Panel</h3>
          <p className="text-sm text-purple-300">Contract Owner Controls</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Settings */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Current Settings</h4>
          <div className="text-white">
            <span className="text-sm text-slate-400">Minimum Stake: </span>
            <span className="font-mono text-lg">{microToStx(currentMinStake)} STX</span>
            <span className="text-xs text-slate-500 ml-2">({currentMinStake} microSTX)</span>
          </div>
        </div>

        {/* Update Minimum Stake */}
        <form onSubmit={handleUpdateMinStake} className="space-y-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300 mb-2 block">
              Update Minimum Stake
            </span>
            <input
              type="number"
              step="0.000001"
              min="0.000001"
              value={newMinStake}
              onChange={(e) => setNewMinStake(e.target.value)}
              placeholder="Enter new minimum stake (STX)"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </label>
          <button
            type="submit"
            disabled={updating || !newMinStake}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
          >
            {updating ? 'Updating...' : 'Update Minimum Stake'}
          </button>
        </form>

        {/* Transfer Ownership */}
        <form onSubmit={handleTransferOwnership} className="space-y-3 pt-6 border-t border-slate-700">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300 mb-2 block">
              Transfer Ownership
            </span>
            <input
              type="text"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder="Enter new owner address (SP...)"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
            />
          </label>
          <p className="text-xs text-orange-400">
            ⚠️ Warning: This action is irreversible. You will lose admin access.
          </p>
          <button
            type="submit"
            disabled={updating || !newOwner}
            className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
          >
            {updating ? 'Transferring...' : 'Transfer Ownership'}
          </button>
        </form>
      </div>
    </div>
  );
}

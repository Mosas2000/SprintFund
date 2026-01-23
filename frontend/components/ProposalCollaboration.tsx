'use client';

import { useState, useEffect } from 'react';

interface Contributor {
  address: string;
  role: 'author' | 'reviewer' | 'supporter';
  contribution: string;
  addedAt: number;
  rewardShare: number;
}

interface ProposalCollaborationProps {
  proposalId: number;
  authorAddress: string;
}

export default function ProposalCollaboration({ proposalId, authorAddress }: ProposalCollaborationProps) {
  const [contributors, setContributors] = useState<Contributor[]>([
    {
      address: authorAddress,
      role: 'author',
      contribution: 'Original proposal creator',
      addedAt: Date.now(),
      rewardShare: 60
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContributor, setNewContributor] = useState({
    address: '',
    role: 'supporter' as 'author' | 'reviewer' | 'supporter',
    contribution: '',
    rewardShare: 10
  });

  useEffect(() => {
    const stored = localStorage.getItem(`proposal-${proposalId}-contributors`);
    if (stored) {
      setContributors(JSON.parse(stored));
    }
  }, [proposalId]);

  const saveContributors = (updated: Contributor[]) => {
    localStorage.setItem(`proposal-${proposalId}-contributors`, JSON.stringify(updated));
    setContributors(updated);
  };

  const addContributor = () => {
    if (!newContributor.address || !newContributor.contribution) return;

    const contributor: Contributor = {
      ...newContributor,
      addedAt: Date.now()
    };

    // Adjust reward shares
    const totalOtherShares = contributors.reduce((sum, c) => sum + c.rewardShare, 0);
    if (totalOtherShares + newContributor.rewardShare > 100) {
      alert('Total reward shares cannot exceed 100%');
      return;
    }

    saveContributors([...contributors, contributor]);
    setNewContributor({
      address: '',
      role: 'supporter',
      contribution: '',
      rewardShare: 10
    });
    setShowAddForm(false);
  };

  const removeContributor = (address: string) => {
    if (address === authorAddress) {
      alert('Cannot remove the original author');
      return;
    }
    saveContributors(contributors.filter(c => c.address !== address));
  };

  const updateRewardShare = (address: string, newShare: number) => {
    const updated = contributors.map(c =>
      c.address === address ? { ...c, rewardShare: newShare } : c
    );
    const totalShares = updated.reduce((sum, c) => sum + c.rewardShare, 0);
    if (totalShares <= 100) {
      saveContributors(updated);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'author': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'reviewer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'supporter': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'author': return '✍️';
      case 'reviewer': return '👁️';
      case 'supporter': return '🤝';
      default: return '👤';
    }
  };

  const totalShares = contributors.reduce((sum, c) => sum + c.rewardShare, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">👥 Proposal Collaborators</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Collaborator
        </button>
      </div>

      {/* Add Contributor Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-4">Add New Collaborator</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Wallet Address</label>
              <input
                type="text"
                value={newContributor.address}
                onChange={(e) => setNewContributor({ ...newContributor, address: e.target.value })}
                placeholder="SP1ABC..."
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={newContributor.role}
                onChange={(e) => setNewContributor({ ...newContributor, role: e.target.value as any })}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="supporter">Supporter</option>
                <option value="reviewer">Reviewer</option>
                <option value="author">Co-Author</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contribution</label>
              <textarea
                value={newContributor.contribution}
                onChange={(e) => setNewContributor({ ...newContributor, contribution: e.target.value })}
                placeholder="Describe their contribution..."
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reward Share (%)</label>
              <input
                type="number"
                value={newContributor.rewardShare}
                onChange={(e) => setNewContributor({ ...newContributor, rewardShare: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={addContributor}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Add Collaborator
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contributors List */}
      <div className="space-y-4 mb-6">
        {contributors.map((contributor) => (
          <div
            key={contributor.address}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getRoleIcon(contributor.role)}</span>
                <div>
                  <div className="font-mono text-sm mb-1">
                    {contributor.address.slice(0, 10)}...{contributor.address.slice(-8)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(contributor.role)}`}>
                    {contributor.role.charAt(0).toUpperCase() + contributor.role.slice(1)}
                  </span>
                </div>
              </div>
              {contributor.address !== authorAddress && (
                <button
                  onClick={() => removeContributor(contributor.address)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{contributor.contribution}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Reward Share:</span>
                <input
                  type="number"
                  value={contributor.rewardShare}
                  onChange={(e) => updateRewardShare(contributor.address, parseInt(e.target.value))}
                  disabled={contributor.address === authorAddress}
                  className="w-16 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700 text-sm"
                  min="0"
                  max="100"
                />
                <span className="text-sm">%</span>
              </div>
              <span className="text-xs text-gray-500">
                Added {new Date(contributor.addedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reward Distribution Summary */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Total Reward Allocation</span>
          <span className={`font-bold ${totalShares === 100 ? 'text-green-600' : 'text-orange-600'}`}>
            {totalShares}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              totalShares === 100 ? 'bg-green-500' : totalShares > 100 ? 'bg-red-500' : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(totalShares, 100)}%` }}
          />
        </div>
        {totalShares !== 100 && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {totalShares > 100
              ? '⚠️ Total exceeds 100%. Please adjust shares.'
              : `${100 - totalShares}% unallocated`}
          </p>
        )}
      </div>
    </div>
  );
}

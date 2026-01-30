'use client';

import { useState } from 'react';

interface Dependency {
  proposalId: number;
  proposalTitle: string;
  type: 'requires' | 'blocks' | 'follows';
  status: 'pending' | 'active' | 'completed' | 'failed';
}

interface ProposalDependenciesProps {
  proposalId: number;
  currentProposalTitle: string;
}

export default function ProposalDependencies({ proposalId, currentProposalTitle }: ProposalDependenciesProps) {
  const [dependencies, setDependencies] = useState<Dependency[]>([
    {
      proposalId: 12,
      proposalTitle: 'Upgrade Smart Contract Infrastructure',
      type: 'requires',
      status: 'completed'
    },
    {
      proposalId: 18,
      proposalTitle: 'Community Voting System v2',
      type: 'blocks',
      status: 'pending'
    },
    {
      proposalId: 15,
      proposalTitle: 'Token Economics Revision',
      type: 'follows',
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDependency, setNewDependency] = useState({
    proposalId: 0,
    proposalTitle: '',
    type: 'requires' as 'requires' | 'blocks' | 'follows'
  });

  const addDependency = () => {
    if (newDependency.proposalId && newDependency.proposalTitle) {
      setDependencies([
        ...dependencies,
        {
          ...newDependency,
          status: 'pending'
        }
      ]);
      setNewDependency({ proposalId: 0, proposalTitle: '', type: 'requires' });
      setShowAddForm(false);
    }
  };

  const removeDependency = (depProposalId: number) => {
    setDependencies(dependencies.filter((d) => d.proposalId !== depProposalId));
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'requires':
        return {
          icon: '🔗',
          label: 'Requires',
          description: 'This proposal cannot proceed until the dependency is completed',
          color: 'blue'
        };
      case 'blocks':
        return {
          icon: '🚫',
          label: 'Blocks',
          description: 'The dependent proposal cannot proceed until this one is completed',
          color: 'red'
        };
      case 'follows':
        return {
          icon: '➡️',
          label: 'Follows',
          description: 'This proposal should be executed after the dependency',
          color: 'green'
        };
      default:
        return { icon: '🔗', label: 'Unknown', description: '', color: 'gray' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: '✅', color: 'green', text: 'Completed' };
      case 'active':
        return { icon: '🔄', color: 'blue', text: 'Active' };
      case 'pending':
        return { icon: '⏳', color: 'yellow', text: 'Pending' };
      case 'failed':
        return { icon: '❌', color: 'red', text: 'Failed' };
      default:
        return { icon: '❓', color: 'gray', text: 'Unknown' };
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      red: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      green: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      gray: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700'
    };
    return colors[color];
  };

  const canExecute = () => {
    const blockers = dependencies.filter((d) => d.type === 'requires' && d.status !== 'completed');
    return blockers.length === 0;
  };

  const getBlockers = () => dependencies.filter((d) => d.type === 'requires' && d.status !== 'completed');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">🔗 Proposal Dependencies</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Dependency
        </button>
      </div>

      {/* Execution Status */}
      {!canExecute() && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">Execution Blocked</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                This proposal cannot be executed until the following dependencies are completed:
              </p>
              <ul className="mt-2 space-y-1">
                {getBlockers().map((blocker) => (
                  <li key={blocker.proposalId} className="text-sm text-red-600 dark:text-red-400">
                    • Proposal #{blocker.proposalId}: {blocker.proposalTitle}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Dependency Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-4">Add Dependency</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Proposal ID</label>
              <input
                type="number"
                value={newDependency.proposalId || ''}
                onChange={(e) =>
                  setNewDependency({ ...newDependency, proposalId: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Proposal Title</label>
              <input
                type="text"
                value={newDependency.proposalTitle}
                onChange={(e) => setNewDependency({ ...newDependency, proposalTitle: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dependency Type</label>
              <select
                value={newDependency.type}
                onChange={(e) =>
                  setNewDependency({ ...newDependency, type: e.target.value as any })
                }
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="requires">Requires (Must be completed first)</option>
                <option value="blocks">Blocks (Blocks other proposal)</option>
                <option value="follows">Follows (Should execute after)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addDependency}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Add Dependency
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

      {/* Dependencies List */}
      <div className="space-y-4">
        {dependencies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔗</div>
            <p>No dependencies defined</p>
          </div>
        ) : (
          dependencies.map((dep) => {
            const typeInfo = getTypeInfo(dep.type);
            const statusInfo = getStatusInfo(dep.status);

            return (
              <div
                key={dep.proposalId}
                className={`p-4 rounded-lg border-2 ${getColorClasses(typeInfo.color)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Proposal #{dep.proposalId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorClasses(statusInfo.color)}`}>
                          {statusInfo.icon} {statusInfo.text}
                        </span>
                      </div>
                      <h4 className="font-medium mb-2">{dep.proposalTitle}</h4>
                      <p className="text-sm opacity-80">{typeInfo.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDependency(dep.proposalId)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full font-medium ${getColorClasses(typeInfo.color)}`}>
                    {typeInfo.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dependency Graph Visualization */}
      {dependencies.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-semibold mb-4">Dependency Chain</h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {dependencies
              .filter((d) => d.type === 'requires')
              .map((dep, idx) => (
                <div key={dep.proposalId} className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-sm whitespace-nowrap">
                    #{dep.proposalId}
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              ))}
            <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 rounded border border-blue-300 dark:border-blue-800 text-sm font-semibold whitespace-nowrap">
              #{proposalId} (Current)
            </div>
            {dependencies
              .filter((d) => d.type === 'blocks')
              .map((dep) => (
                <div key={dep.proposalId} className="flex items-center gap-2">
                  <span className="text-gray-400">→</span>
                  <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-sm whitespace-nowrap">
                    #{dep.proposalId}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

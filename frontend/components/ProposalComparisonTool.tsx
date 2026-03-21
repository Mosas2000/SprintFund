'use client';

import { useState } from 'react';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';
import { X } from 'lucide-react';

export function ProposalComparisonTool() {
  const { proposals, loading } = useGovernanceAnalytics();
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectProposal = (id: string) => {
    if (selectedProposals.includes(id)) {
      setSelectedProposals(selectedProposals.filter((p) => p !== id));
    } else if (selectedProposals.length < 3) {
      setSelectedProposals([...selectedProposals, id]);
    }
  };

  const getSelectedProposalDetails = () => {
    return selectedProposals
      .map((id) => proposals.find((p) => p.id === id))
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <p className="text-white/60">Loading proposals...</p>
      </div>
    );
  }

  const details = getSelectedProposalDetails();

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Compare Proposals</h3>
        <p className="text-sm text-white/60 mb-4">
          Select up to 3 proposals to compare (selected: {selectedProposals.length}/3)
        </p>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {proposals.slice(0, 20).map((p) => (
            <label
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                selectedProposals.includes(p.id)
                  ? 'bg-purple-600/20 border border-purple-500'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedProposals.includes(p.id)}
                onChange={() => handleSelectProposal(p.id)}
                disabled={
                  selectedProposals.length >= 3 &&
                  !selectedProposals.includes(p.id)
                }
                className="w-4 h-4"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.title}</p>
                <p className="text-xs text-white/40">{p.status}</p>
              </div>
              <span className="text-xs text-purple-400">
                {((p.requestedAmount || 0) / 1_000_000).toFixed(0)} STX
              </span>
            </label>
          ))}
        </div>

        {selectedProposals.length > 0 && (
          <button
            onClick={() => setShowComparison(true)}
            className="mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Compare ({selectedProposals.length})
          </button>
        )}
      </div>

      {showComparison && details.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Comparison</h3>
            <button
              onClick={() => setShowComparison(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-4 text-white/60">Metric</th>
                  {details.map((p) => (
                    <th key={p.id} className="text-center py-2 px-4 text-white">
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-4 text-white/60">Status</td>
                  {details.map((p) => (
                    <td key={p.id} className="py-2 px-4 text-center text-white">
                      {p.status}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-4 text-white/60">Requested Amount</td>
                  {details.map((p) => (
                    <td key={p.id} className="py-2 px-4 text-center text-white">
                      {((p.requestedAmount || 0) / 1_000_000).toFixed(2)} STX
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-4 text-white/60">Votes</td>
                  {details.map((p) => (
                    <td key={p.id} className="py-2 px-4 text-center text-white">
                      {p.votes?.length || 0}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white/60">Created</td>
                  {details.map((p) => (
                    <td key={p.id} className="py-2 px-4 text-center text-white text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

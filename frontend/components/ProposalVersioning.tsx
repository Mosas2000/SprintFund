'use client';

import { useState, useEffect } from 'react';

interface Version {
  id: number;
  timestamp: number;
  editor: string;
  changes: {
    title?: { old: string; new: string };
    description?: { old: string; new: string };
    amount?: { old: number; new: number };
  };
  changeNote: string;
}

interface ProposalVersioningProps {
  proposalId: number;
  currentData: {
    title: string;
    description: string;
    amount: number;
  };
}

export default function ProposalVersioning({ proposalId, currentData }: ProposalVersioningProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`proposal-${proposalId}-versions`);
    if (stored) {
      setVersions(JSON.parse(stored));
    }
  }, [proposalId]);

  const saveVersion = (changes: Version['changes'], changeNote: string) => {
    const newVersion: Version = {
      id: versions.length + 1,
      timestamp: Date.now(),
      editor: 'SP1ABC...XYZ', // Would come from user context
      changes,
      changeNote
    };

    const updated = [...versions, newVersion];
    localStorage.setItem(`proposal-${proposalId}-versions`, JSON.stringify(updated));
    setVersions(updated);
  };

  const revertToVersion = (version: Version) => {
    if (confirm(`Are you sure you want to revert to version ${version.id}?`)) {
      // In real implementation, would update the proposal with version data
      alert('Proposal reverted successfully');
      setShowHistory(false);
    }
  };

  const renderDiff = (old: string, newText: string) => {
    const oldLines = old.split('\n');
    const newLines = newText.split('\n');
    const maxLength = Math.max(oldLines.length, newLines.length);

    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-semibold mb-2 text-red-600">Previous Version</h5>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
            {oldLines.map((line, idx) => (
              <div key={idx} className={newLines[idx] !== line ? 'bg-red-200 dark:bg-red-800/30' : ''}>
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-semibold mb-2 text-green-600">Current Version</h5>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
            {newLines.map((line, idx) => (
              <div key={idx} className={oldLines[idx] !== line ? 'bg-green-200 dark:bg-green-800/30' : ''}>
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">📜 Version History</h3>
          {versions.length > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 
                           rounded-full text-sm font-medium">
              {versions.length} {versions.length === 1 ? 'revision' : 'revisions'}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {showHistory ? 'Hide History' : 'View History'}
        </button>
      </div>

      {/* Edited Badge */}
      {versions.length > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 
                      text-yellow-700 dark:text-yellow-300 rounded-full text-sm mb-4">
          <span>✏️ Edited</span>
          <span className="font-semibold">v{versions.length + 1}</span>
        </div>
      )}

      {/* Version History */}
      {showHistory && (
        <div className="space-y-4">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>No revisions yet</p>
            </div>
          ) : (
            versions.map((version, index) => (
              <div
                key={version.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Version {version.id}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(version.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Edited by {version.editor}
                    </div>
                    {version.changeNote && (
                      <div className="text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                        💬 {version.changeNote}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedVersion(version);
                        setShowDiff(true);
                      }}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 
                               rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30"
                    >
                      View Diff
                    </button>
                    {index === versions.length - 1 && (
                      <button
                        onClick={() => revertToVersion(version)}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 
                                 rounded text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/30"
                      >
                        Revert
                      </button>
                    )}
                  </div>
                </div>

                {/* Changes Summary */}
                <div className="space-y-2">
                  {version.changes.title && (
                    <div className="text-sm">
                      <span className="font-medium">Title: </span>
                      <span className="line-through text-red-600">{version.changes.title.old}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-600">{version.changes.title.new}</span>
                    </div>
                  )}
                  {version.changes.amount && (
                    <div className="text-sm">
                      <span className="font-medium">Amount: </span>
                      <span className="line-through text-red-600">{version.changes.amount.old} STX</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-600">{version.changes.amount.new} STX</span>
                    </div>
                  )}
                  {version.changes.description && (
                    <div className="text-sm">
                      <span className="font-medium">Description modified</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Diff View Modal */}
      {showDiff && selectedVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Changes in Version {selectedVersion.id}</h3>
                <button
                  onClick={() => {
                    setShowDiff(false);
                    setSelectedVersion(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {selectedVersion.changes.title && (
                  <div>
                    <h4 className="font-semibold mb-2">Title Changes</h4>
                    {renderDiff(selectedVersion.changes.title.old, selectedVersion.changes.title.new)}
                  </div>
                )}

                {selectedVersion.changes.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description Changes</h4>
                    {renderDiff(selectedVersion.changes.description.old, selectedVersion.changes.description.new)}
                  </div>
                )}

                {selectedVersion.changes.amount && (
                  <div>
                    <h4 className="font-semibold mb-2">Amount Change</h4>
                    <div className="flex items-center gap-4 text-lg">
                      <span className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 
                                     rounded line-through">
                        {selectedVersion.changes.amount.old} STX
                      </span>
                      <span>→</span>
                      <span className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 
                                     rounded font-semibold">
                        {selectedVersion.changes.amount.new} STX
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => revertToVersion(selectedVersion)}
                  className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
                >
                  Revert to This Version
                </button>
                <button
                  onClick={() => {
                    setShowDiff(false);
                    setSelectedVersion(null);
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

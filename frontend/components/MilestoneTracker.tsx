'use client';

import { useState, useEffect } from 'react';

interface Milestone {
  id: number;
  name: string;
  description: string;
  percentage: number;
  fundAmount: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'verified' | 'completed';
  submittedAt?: number;
  verifiedAt?: number;
  verifications: {
    address: string;
    approved: boolean;
    comment: string;
    timestamp: number;
  }[];
  deliverables: string[];
}

interface MilestoneTrackerProps {
  proposalId: number;
  totalFunding: number;
}

export default function MilestoneTracker({ proposalId, totalFunding }: MilestoneTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      name: 'Project Kickoff',
      description: 'Initial setup and planning phase',
      percentage: 25,
      fundAmount: totalFunding * 0.25,
      status: 'completed',
      verifications: [],
      deliverables: ['Project plan', 'Technical specification']
    },
    {
      id: 2,
      name: 'Development Phase 1',
      description: 'Core functionality implementation',
      percentage: 50,
      fundAmount: totalFunding * 0.25,
      status: 'in-progress',
      verifications: [],
      deliverables: ['Working prototype', 'Test coverage']
    },
    {
      id: 3,
      name: 'Development Phase 2',
      description: 'Advanced features and integration',
      percentage: 75,
      fundAmount: totalFunding * 0.25,
      status: 'pending',
      verifications: [],
      deliverables: ['Feature complete', 'Integration tests']
    },
    {
      id: 4,
      name: 'Launch & Delivery',
      description: 'Final testing and deployment',
      percentage: 100,
      fundAmount: totalFunding * 0.25,
      status: 'pending',
      verifications: [],
      deliverables: ['Production deployment', 'Documentation']
    }
  ]);

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [verificationComment, setVerificationComment] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`proposal-${proposalId}-milestones`);
    if (stored) {
      setMilestones(JSON.parse(stored));
    }
  }, [proposalId]);

  const saveMilestones = (updated: Milestone[]) => {
    localStorage.setItem(`proposal-${proposalId}-milestones`, JSON.stringify(updated));
    setMilestones(updated);
  };

  const submitMilestone = (milestoneId: number) => {
    const updated = milestones.map(m =>
      m.id === milestoneId ? { ...m, status: 'submitted' as const, submittedAt: Date.now() } : m
    );
    saveMilestones(updated);
  };

  const verifyMilestone = (milestoneId: number, approved: boolean) => {
    if (!verificationComment) {
      alert('Please add a comment');
      return;
    }

    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        const newVerification = {
          address: 'SP1ABC...XYZ',
          approved,
          comment: verificationComment,
          timestamp: Date.now()
        };

        const verifications = [...m.verifications, newVerification];
        const approvedCount = verifications.filter(v => v.approved).length;

        // Need 3 approvals to verify
        if (approvedCount >= 3) {
          return {
            ...m,
            verifications,
            status: 'verified' as const,
            verifiedAt: Date.now()
          };
        }

        return { ...m, verifications };
      }
      return m;
    });

    saveMilestones(updated);
    setVerificationComment('');
    setSelectedMilestone(null);
  };

  const releaseFunds = (milestoneId: number) => {
    if (confirm('Release funds for this milestone?')) {
      const updated = milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'completed' as const } : m
      );
      saveMilestones(updated);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'verified': return 'bg-blue-500';
      case 'submitted': return 'bg-yellow-500';
      case 'in-progress': return 'bg-orange-500';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const overallProgress = (completedMilestones / milestones.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6">🎯 Milestone Tracker</h3>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Overall Progress</span>
          <span className="text-gray-600 dark:text-gray-400">
            {completedMilestones} of {milestones.length} milestones completed
          </span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          />
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="absolute top-0 h-4 w-1 bg-white dark:bg-gray-800"
              style={{ left: `${milestone.percentage}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {milestones.map((milestone) => (
            <span key={milestone.id}>{milestone.percentage}%</span>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`border-2 rounded-lg p-4 transition ${
              milestone.status === 'in-progress'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getStatusColor(
                    milestone.status
                  )}`}
                >
                  {milestone.status === 'completed' ? '✓' : index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{milestone.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{milestone.description}</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)} text-white`}>
                      {getStatusText(milestone.status)}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {milestone.fundAmount.toLocaleString()} STX
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="mb-3 pl-13">
              <h5 className="text-sm font-semibold mb-2">Deliverables:</h5>
              <div className="space-y-1">
                {milestone.deliverables.map((deliverable, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>•</span>
                    <span>{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verifications */}
            {milestone.verifications.length > 0 && (
              <div className="mb-3 pl-13">
                <h5 className="text-sm font-semibold mb-2">
                  Community Verifications ({milestone.verifications.filter(v => v.approved).length}/3 approved):
                </h5>
                <div className="space-y-2">
                  {milestone.verifications.slice(0, 3).map((verification, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs ${
                        verification.approved
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{verification.approved ? '✓' : '✗'}</span>
                        <span className="font-mono">{verification.address}</span>
                      </div>
                      <p>{verification.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pl-13 flex gap-2">
              {milestone.status === 'in-progress' && (
                <button
                  onClick={() => submitMilestone(milestone.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Submit for Verification
                </button>
              )}
              {milestone.status === 'submitted' && (
                <button
                  onClick={() => setSelectedMilestone(milestone)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                  Verify Milestone
                </button>
              )}
              {milestone.status === 'verified' && (
                <button
                  onClick={() => releaseFunds(milestone.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Release Funds
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Verify Milestone: {selectedMilestone.name}</h3>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Deliverables:</h4>
              {selectedMilestone.deliverables.map((d, idx) => (
                <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">• {d}</div>
              ))}
            </div>

            <textarea
              value={verificationComment}
              onChange={(e) => setVerificationComment(e.target.value)}
              placeholder="Add your verification comment..."
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700 mb-4"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => verifyMilestone(selectedMilestone.id, true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => verifyMilestone(selectedMilestone.id, false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                ✗ Reject
              </button>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

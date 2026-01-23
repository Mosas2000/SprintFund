'use client';

import { useState, useEffect } from 'react';

type Stage = 'Draft' | 'Review' | 'Active' | 'Voting' | 'Executed';

interface ProposalWorkflowProps {
  proposalId: number;
  initialStage?: Stage;
  onStageChange?: (stage: Stage) => void;
}

interface StageConfig {
  name: Stage;
  description: string;
  requirements: string[];
  actions: string[];
  autoTransition?: {
    condition: string;
    nextStage: Stage;
  };
}

const STAGES: StageConfig[] = [
  {
    name: 'Draft',
    description: 'Proposal is being created and refined',
    requirements: ['Complete all required fields', 'Add detailed description'],
    actions: ['Edit proposal', 'Add collaborators', 'Submit for review'],
    autoTransition: {
      condition: 'All required fields complete',
      nextStage: 'Review'
    }
  },
  {
    name: 'Review',
    description: 'Community members review and provide feedback',
    requirements: ['Minimum 3 reviewer approvals', '48 hour review period'],
    actions: ['Request changes', 'Approve proposal', 'Reject proposal'],
    autoTransition: {
      condition: '3+ approvals and 48 hours elapsed',
      nextStage: 'Active'
    }
  },
  {
    name: 'Active',
    description: 'Proposal is open for community engagement',
    requirements: ['Minimum engagement threshold', '7 day discussion period'],
    actions: ['Add comments', 'Share proposal', 'Start voting'],
    autoTransition: {
      condition: 'Discussion period complete',
      nextStage: 'Voting'
    }
  },
  {
    name: 'Voting',
    description: 'Community votes on the proposal',
    requirements: ['Minimum quorum reached', 'Voting period complete'],
    actions: ['Cast vote', 'Delegate vote', 'View results'],
    autoTransition: {
      condition: 'Quorum reached and period ended',
      nextStage: 'Executed'
    }
  },
  {
    name: 'Executed',
    description: 'Proposal has been approved and executed',
    requirements: ['Majority approval', 'Transaction confirmed'],
    actions: ['View results', 'Track milestones', 'Submit report'],
    autoTransition: undefined
  }
];

export default function ProposalWorkflow({ proposalId, initialStage = 'Draft', onStageChange }: ProposalWorkflowProps) {
  const [currentStage, setCurrentStage] = useState<Stage>(initialStage);
  const [stageProgress, setStageProgress] = useState<Record<Stage, number>>({
    Draft: 0,
    Review: 0,
    Active: 0,
    Voting: 0,
    Executed: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem(`proposal-${proposalId}-workflow`);
    if (stored) {
      const data = JSON.parse(stored);
      setCurrentStage(data.currentStage);
      setStageProgress(data.stageProgress);
    }
  }, [proposalId]);

  const updateStage = (newStage: Stage) => {
    setCurrentStage(newStage);
    const data = { currentStage: newStage, stageProgress };
    localStorage.setItem(`proposal-${proposalId}-workflow`, JSON.stringify(data));
    onStageChange?.(newStage);
  };

  const getCurrentStageIndex = () => STAGES.findIndex(s => s.name === currentStage);

  const canProgressToNextStage = () => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex === STAGES.length - 1) return false;
    
    const progress = stageProgress[currentStage];
    return progress >= 100;
  };

  const progressToNextStage = () => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex < STAGES.length - 1) {
      updateStage(STAGES[currentIndex + 1].name);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6">📋 Proposal Workflow</h3>

      {/* Timeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STAGES.map((stage, index) => {
            const isCompleted = index < getCurrentStageIndex();
            const isCurrent = stage.name === currentStage;
            const isUpcoming = index > getCurrentStageIndex();

            return (
              <div key={stage.name} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div
                    className={`text-sm font-medium text-center ${
                      isCurrent ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {stage.name}
                  </div>
                </div>
                {index < STAGES.length - 1 && (
                  <div
                    className={`h-1 flex-1 transition ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Details */}
      {STAGES.map(
        (stage) =>
          stage.name === currentStage && (
            <div key={stage.name} className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Current Stage: {stage.name}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">{stage.description}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Stage Progress</span>
                  <span className="text-gray-600 dark:text-gray-400">{stageProgress[currentStage]}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${stageProgress[currentStage]}%` }}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h5 className="font-semibold mb-3">Requirements</h5>
                <div className="space-y-2">
                  {stage.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          stageProgress[currentStage] > idx * (100 / stage.requirements.length)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        {stageProgress[currentStage] > idx * (100 / stage.requirements.length) ? '✓' : ''}
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Actions */}
              <div>
                <h5 className="font-semibold mb-3">Available Actions</h5>
                <div className="grid grid-cols-2 gap-3">
                  {stage.actions.map((action, idx) => (
                    <button
                      key={idx}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium
                               hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-transition Info */}
              {stage.autoTransition && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-sm">
                    <span className="font-semibold text-purple-900 dark:text-purple-100">Auto-transition: </span>
                    <span className="text-purple-700 dark:text-purple-300">{stage.autoTransition.condition}</span>
                    <span className="text-purple-600 dark:text-purple-400">
                      {' '}
                      → {stage.autoTransition.nextStage}
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Button */}
              {canProgressToNextStage() && (
                <button
                  onClick={progressToNextStage}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold
                           hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  Proceed to {STAGES[getCurrentStageIndex() + 1]?.name} →
                </button>
              )}
            </div>
          )
      )}
    </div>
  );
}

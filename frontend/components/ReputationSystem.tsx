'use client';

import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

interface ReputationSystemProps {
  userAddress: string;
  reputation: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-proposal', name: 'First Steps', description: 'Created your first proposal', icon: '📝', maxProgress: 1 },
  { id: 'ten-votes', name: 'Active Voter', description: 'Cast 10 votes', icon: '🗳️', maxProgress: 10 },
  { id: 'fifty-votes', name: 'Voting Champion', description: 'Cast 50 votes', icon: '⭐', maxProgress: 50 },
  { id: 'proposal-passed', name: 'Success Story', description: 'Had a proposal approved', icon: '✅', maxProgress: 1 },
  { id: 'five-proposals', name: 'Prolific Creator', description: 'Created 5 proposals', icon: '🎨', maxProgress: 5 },
  { id: 'helpful-reviewer', name: 'Helpful Reviewer', description: 'Reviewed 10 proposals', icon: '👁️', maxProgress: 10 },
  { id: 'community-leader', name: 'Community Leader', description: 'Reached 1000 reputation', icon: '👑', maxProgress: 1000 },
  { id: 'early-adopter', name: 'Early Adopter', description: 'Joined in the first month', icon: '🚀', maxProgress: 1 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Voted 7 days in a row', icon: '🔥', maxProgress: 7 },
  { id: 'streak-30', name: 'Monthly Maestro', description: 'Voted 30 days in a row', icon: '💪', maxProgress: 30 },
  { id: 'collaborator', name: 'Team Player', description: 'Collaborated on 3 proposals', icon: '🤝', maxProgress: 3 },
  { id: 'big-spender', name: 'Whale Watcher', description: 'Funded 100K+ STX in proposals', icon: '🐋', maxProgress: 100000 }
];

export default function ReputationSystem({ userAddress, reputation }: ReputationSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`achievements-${userAddress}`);
    if (stored) {
      setAchievements(JSON.parse(stored));
    } else {
      // Simulate some unlocked achievements
      const simulated = ACHIEVEMENTS.map(ach => {
        const random = Math.random();
        if (random > 0.7) {
          return { ...ach, unlockedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 };
        } else if (random > 0.4) {
          return { ...ach, progress: Math.floor(Math.random() * (ach.maxProgress || 1)) };
        }
        return ach;
      });
      setAchievements(simulated);
    }
  }, [userAddress]);

  useEffect(() => {
    setUnlockedCount(achievements.filter(a => a.unlockedAt).length);
  }, [achievements]);

  const getTier = (rep: number) => {
    if (rep >= 2000) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500', icon: '💎', min: 2000, max: 999999 };
    if (rep >= 1000) return { name: 'Platinum', color: 'from-gray-300 to-gray-500', icon: '🏆', min: 1000, max: 2000 };
    if (rep >= 500) return { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: '🥇', min: 500, max: 1000 };
    if (rep >= 100) return { name: 'Silver', color: 'from-gray-400 to-gray-600', icon: '🥈', min: 100, max: 500 };
    return { name: 'Bronze', color: 'from-orange-400 to-orange-600', icon: '🥉', min: 0, max: 100 };
  };

  const currentTier = getTier(reputation);
  const nextTier = reputation < 2000 ? getTier(currentTier.max) : null;
  const tierProgress = nextTier ? ((reputation - currentTier.min) / (currentTier.max - currentTier.min)) * 100 : 100;

  const getReputationBreakdown = () => [
    { source: 'Proposals Created', points: 250, color: 'blue' },
    { source: 'Successful Proposals', points: 400, color: 'green' },
    { source: 'Votes Cast', points: 180, color: 'purple' },
    { source: 'Comments & Reviews', points: 120, color: 'orange' },
    { source: 'Community Support', points: 50, color: 'pink' }
  ];

  const breakdown = getReputationBreakdown();

  return (
    <div className="space-y-6">
      {/* Current Tier Card */}
      <div className={`bg-gradient-to-r ${currentTier.color} rounded-lg p-8 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">Current Tier</div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{currentTier.icon}</span>
              <div>
                <h2 className="text-3xl font-bold">{currentTier.name}</h2>
                <p className="text-white/80">{reputation.toLocaleString()} Reputation Points</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{unlockedCount}/{ACHIEVEMENTS.length}</div>
            <div className="text-sm opacity-90">Achievements</div>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to {nextTier.name}</span>
              <span>{Math.floor(tierProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-80">
              {currentTier.max - reputation} points until {nextTier.name} tier
            </p>
          </div>
        )}
      </div>

      {/* Achievements Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map(achievement => {
            const isUnlocked = !!achievement.unlockedAt;
            const progress = achievement.progress || 0;
            const maxProgress = achievement.maxProgress || 1;
            const progressPercent = (progress / maxProgress) * 100;

            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 transition ${
                  isUnlocked
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </p>

                  {isUnlocked ? (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓ Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </div>
                  ) : progress > 0 ? (
                    <div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {progress}/{maxProgress}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">Locked</div>
                  )}
                </div>

                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reputation Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4">📊 Reputation Breakdown</h3>
        <div className="space-y-4">
          {breakdown.map(item => (
            <div key={item.source}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.source}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  +{item.points} points
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${item.color}-500`}
                  style={{ width: `${(item.points / reputation) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold mb-2">How to Earn Reputation</h4>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• Create proposals: +50 points</li>
            <li>• Successful proposal: +200 points</li>
            <li>• Cast votes: +3 points each</li>
            <li>• Review proposals: +10 points each</li>
            <li>• Receive community support: +5 points per upvote</li>
          </ul>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">🎯 Leaderboard</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Full Leaderboard →
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { rank: 1, address: 'alice.btc', reputation: 2450, tier: '💎' },
            { rank: 2, address: 'bob.btc', reputation: 2180, tier: '💎' },
            { rank: 3, address: 'carol.btc', reputation: 1890, tier: '🏆' },
            { rank: 12, address: userAddress.slice(0, 12) + '...', reputation, tier: currentTier.icon, isYou: true }
          ].map(user => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isYou
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg w-8">#{user.rank}</span>
                <span className="text-xl">{user.tier}</span>
                <span className="font-medium">
                  {user.address}
                  {user.isYou && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                </span>
              </div>
              <span className="font-semibold">{user.reputation.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

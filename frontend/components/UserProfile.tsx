'use client';

import { useState, useEffect } from 'react';

interface UserProfileData {
  address: string;
  bnsName?: string;
  bio: string;
  avatar?: string;
  reputation: number;
  totalProposals: number;
  votesCast: number;
  successRate: number;
  memberSince: number;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
    website?: string;
  };
  customization: {
    theme: 'default' | 'dark' | 'blue' | 'purple' | 'green';
    accentColor: string;
  };
}

interface UserProfileProps {
  userAddress: string;
  isOwnProfile?: boolean;
}

export default function UserProfile({ userAddress, isOwnProfile = false }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileData>({
    address: userAddress,
    bio: '',
    reputation: 0,
    totalProposals: 0,
    votesCast: 0,
    successRate: 0,
    memberSince: Date.now(),
    socialLinks: {},
    customization: {
      theme: 'default',
      accentColor: '#3B82F6'
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    const stored = localStorage.getItem(`user-profile-${userAddress}`);
    if (stored) {
      const data = JSON.parse(stored);
      setProfile(data);
      setEditForm(data);
    } else {
      // Generate initial data
      const initial = {
        ...profile,
        reputation: Math.floor(Math.random() * 2000),
        totalProposals: Math.floor(Math.random() * 25),
        votesCast: Math.floor(Math.random() * 150),
        successRate: Math.random() * 100
      };
      setProfile(initial);
      setEditForm(initial);
    }
  }, [userAddress]);

  const saveProfile = () => {
    localStorage.setItem(`user-profile-${userAddress}`, JSON.stringify(editForm));
    setProfile(editForm);
    setIsEditing(false);
  };

  const generateAvatar = (address: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#6C5CE7', '#A29BFE'];
    const index = parseInt(address.slice(-2), 16) % colors.length;
    return colors[index];
  };

  const getReputationTier = (rep: number) => {
    if (rep >= 2000) return { name: 'Diamond', color: '#B9F2FF', icon: '💎' };
    if (rep >= 1000) return { name: 'Platinum', color: '#E5E4E2', icon: '🏆' };
    if (rep >= 500) return { name: 'Gold', color: '#FFD700', icon: '🥇' };
    if (rep >= 100) return { name: 'Silver', color: '#C0C0C0', icon: '🥈' };
    return { name: 'Bronze', color: '#CD7F32', icon: '🥉' };
  };

  const tier = getReputationTier(profile.reputation);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div
        className="rounded-lg p-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${profile.customization.accentColor} 0%, ${profile.customization.accentColor}99 100%)` }}
      >
        <div className="relative z-10 flex items-start gap-6">
          {/* Avatar */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl"
            style={{ backgroundColor: generateAvatar(profile.address) }}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : profile.bnsName ? (
              profile.bnsName.slice(0, 2).toUpperCase()
            ) : (
              profile.address.slice(0, 2).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {profile.bnsName || `${profile.address.slice(0, 8)}...${profile.address.slice(-6)}`}
                </h1>
                <p className="text-white/80 text-sm font-mono">{profile.address}</p>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition"
                >
                  {isEditing ? 'Cancel' : '✏️ Edit Profile'}
                </button>
              )}
            </div>

            {/* Reputation Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{tier.icon}</span>
              <span className="text-xl font-semibold" style={{ color: tier.color }}>
                {tier.name} Member
              </span>
              <span className="text-white/80">• {profile.reputation} Rep</span>
            </div>

            {/* Bio */}
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell the community about yourself..."
                className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50"
                rows={3}
              />
            ) : (
              <p className="text-white/90 mb-4">
                {profile.bio || 'No bio yet. Share something about yourself!'}
              </p>
            )}

            {/* Social Links */}
            <div className="flex gap-3">
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={editForm.socialLinks.twitter || ''}
                    onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, twitter: e.target.value }})}
                    placeholder="Twitter username"
                    className="px-3 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.socialLinks.github || ''}
                    onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, github: e.target.value }})}
                    placeholder="GitHub username"
                    className="px-3 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.socialLinks.discord || ''}
                    onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, discord: e.target.value }})}
                    placeholder="Discord username"
                    className="px-3 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 text-sm"
                  />
                </div>
              ) : (
                <>
                  {profile.socialLinks.twitter && (
                    <a href={`https://twitter.com/${profile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer"
                       className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition text-sm">
                      🐦 Twitter
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a href={`https://github.com/${profile.socialLinks.github}`} target="_blank" rel="noopener noreferrer"
                       className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition text-sm">
                      💻 GitHub
                    </a>
                  )}
                  {profile.socialLinks.discord && (
                    <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm text-sm">
                      💬 {profile.socialLinks.discord}
                    </span>
                  )}
                </>
              )}
            </div>

            {isEditing && (
              <button
                onClick={saveProfile}
                className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {profile.totalProposals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Proposals Created</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {profile.votesCast}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Votes Cast</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {profile.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {Math.floor((Date.now() - profile.memberSince) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
        </div>
      </div>

      {/* Theme Customization */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-4">Profile Customization</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-2">
                {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map(color => (
                  <button
                    key={color}
                    onClick={() => setEditForm({ ...editForm, customization: { ...editForm.customization, accentColor: color }})}
                    className={`w-10 h-10 rounded-full border-4 transition ${
                      editForm.customization.accentColor === color ? 'border-white shadow-lg scale-110' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

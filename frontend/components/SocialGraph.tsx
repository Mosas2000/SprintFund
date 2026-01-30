'use client';

import { useState, useEffect } from 'react';

interface User {
  address: string;
  username: string;
  avatar: string;
  reputation: number;
  followers: number;
  following: number;
  bio?: string;
  isFollowing?: boolean;
  mutualConnections?: number;
  lastActive?: number;
}

interface Activity {
  id: number;
  user: User;
  type: 'proposal' | 'vote' | 'comment' | 'achievement';
  content: string;
  timestamp: number;
}

interface SocialGraphProps {
  currentUser: string;
}

export default function SocialGraph({ currentUser }: SocialGraphProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'discover'>('following');
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReputation, setFilterReputation] = useState<'all' | 'high' | 'medium'>('all');

  useEffect(() => {
    // Load mock data
    const mockUsers: User[] = [
      {
        address: 'SP1ABC...DEF',
        username: 'alice_dao',
        avatar: '👩‍💼',
        reputation: 8500,
        followers: 342,
        following: 89,
        bio: 'DeFi enthusiast | Building the future of finance',
        isFollowing: true,
        mutualConnections: 12,
        lastActive: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        address: 'SP2XYZ...GHI',
        username: 'bob_builder',
        avatar: '👨‍💻',
        reputation: 6200,
        followers: 215,
        following: 156,
        bio: 'Smart contract developer | Open source contributor',
        isFollowing: true,
        mutualConnections: 8,
        lastActive: Date.now() - 5 * 60 * 60 * 1000
      },
      {
        address: 'SP3MNO...PQR',
        username: 'carol_artist',
        avatar: '🎨',
        reputation: 7800,
        followers: 498,
        following: 203,
        bio: 'NFT creator | Community advocate',
        isFollowing: false,
        mutualConnections: 5,
        lastActive: Date.now() - 24 * 60 * 60 * 1000
      },
      {
        address: 'SP4STU...VWX',
        username: 'dave_investor',
        avatar: '💼',
        reputation: 9200,
        followers: 621,
        following: 45,
        bio: 'VC | Crypto investor | Supporting innovation',
        isFollowing: false,
        mutualConnections: 15,
        lastActive: Date.now() - 1 * 60 * 60 * 1000
      }
    ];

    const mockActivities: Activity[] = [
      {
        id: 1,
        user: mockUsers[0],
        type: 'proposal',
        content: 'Created proposal: DeFi Lending Protocol v2',
        timestamp: Date.now() - 3 * 60 * 60 * 1000
      },
      {
        id: 2,
        user: mockUsers[1],
        type: 'vote',
        content: 'Voted YES on "Community NFT Marketplace"',
        timestamp: Date.now() - 5 * 60 * 60 * 1000
      },
      {
        id: 3,
        user: mockUsers[0],
        type: 'achievement',
        content: 'Earned "Top Contributor" badge 🏆',
        timestamp: Date.now() - 12 * 60 * 60 * 1000
      },
      {
        id: 4,
        user: mockUsers[1],
        type: 'comment',
        content: 'Commented on proposal #42',
        timestamp: Date.now() - 18 * 60 * 60 * 1000
      }
    ];

    setUsers(mockUsers);
    setActivities(mockActivities);
  }, []);

  const followUser = (address: string) => {
    setUsers(users.map(user => 
      user.address === address 
        ? { ...user, isFollowing: true, followers: user.followers + 1 }
        : user
    ));
  };

  const unfollowUser = (address: string) => {
    setUsers(users.map(user => 
      user.address === address 
        ? { ...user, isFollowing: false, followers: user.followers - 1 }
        : user
    ));
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesReputation = filterReputation === 'all' ||
                             (filterReputation === 'high' && user.reputation >= 8000) ||
                             (filterReputation === 'medium' && user.reputation >= 5000 && user.reputation < 8000);
    
    return matchesSearch && matchesReputation;
  });

  const displayedUsers = activeTab === 'following' 
    ? filteredUsers.filter(u => u.isFollowing)
    : activeTab === 'followers'
    ? filteredUsers
    : filteredUsers.filter(u => !u.isFollowing);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">🌐 Social Graph</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect with {users.filter(u => u.isFollowing).length} community members
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">{users.filter(u => u.isFollowing).length}</div>
          <div className="text-sm opacity-90">Following</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">142</div>
          <div className="text-sm opacity-90">Followers</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm opacity-90">Mutual</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'following'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Following ({users.filter(u => u.isFollowing).length})
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'followers'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Followers (142)
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'discover'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Discover
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterReputation}
          onChange={(e) => setFilterReputation(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Reputation</option>
          <option value="high">High (8000+)</option>
          <option value="medium">Medium (5000+)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2 space-y-3">
          {displayedUsers.map(user => (
            <div
              key={user.address}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="text-4xl">{user.avatar}</div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{user.username}</h3>
                    {user.reputation >= 8000 && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 
                                     text-yellow-700 dark:text-yellow-300 rounded-full">
                        ⭐ Top Contributor
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {user.address}
                  </p>
                  
                  {user.bio && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {user.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <span>🏆 {user.reputation.toLocaleString()}</span>
                    <span>👥 {user.followers} followers</span>
                    <span>📝 {user.following} following</span>
                    {user.mutualConnections && user.mutualConnections > 0 && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {user.mutualConnections} mutual
                      </span>
                    )}
                  </div>

                  {/* Last Active */}
                  {user.lastActive && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last active {formatTimeAgo(user.lastActive)}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div>
                  {user.isFollowing ? (
                    <button
                      onClick={() => unfollowUser(user.address)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                               rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={() => followUser(user.address)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium 
                               hover:bg-blue-700 transition"
                    >
                      Follow
                    </button>
                  )}
                  
                  <button className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                                   rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    💬 Message
                  </button>
                </div>
              </div>
            </div>
          ))}

          {displayedUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No users found matching your filters
            </div>
          )}
        </div>

        {/* Activity Feed Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="text-2xl">{activity.user.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{activity.user.username}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {activity.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mutual Connections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Mutual Connections</h3>
            <div className="space-y-3">
              {users.filter(u => u.mutualConnections && u.mutualConnections > 0).slice(0, 3).map(user => (
                <div key={user.address} className="flex items-center gap-2">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{user.username}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {user.mutualConnections} mutual
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Users */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                        rounded-lg border border-purple-200 dark:border-purple-700 p-4">
            <h3 className="font-semibold mb-2">✨ Suggested for you</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Based on your activity and interests
            </p>
            <div className="space-y-2">
              {users.filter(u => !u.isFollowing).slice(0, 2).map(user => (
                <div key={user.address} className="flex items-center gap-2">
                  <div className="text-xl">{user.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{user.username}</div>
                  </div>
                  <button
                    onClick={() => followUser(user.address)}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium 
                             hover:bg-purple-700 transition"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

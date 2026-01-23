'use client';

import { useState, useEffect } from 'react';

interface Connection {
  address: string;
  username: string;
  avatar: string;
  reputation: number;
  relationship: 'following' | 'follower' | 'mutual';
  sharedInterests: string[];
  collaborations: number;
}

interface Message {
  id: number;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  user: Connection;
  lastMessage: Message;
  unreadCount: number;
}

interface UserNetworkProps {
  currentUser: string;
}

export default function UserNetwork({ currentUser }: UserNetworkProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'connections' | 'messages'>('connections');
  const [filterRelationship, setFilterRelationship] = useState<'all' | 'mutual' | 'following'>('all');

  useEffect(() => {
    // Load mock data
    const mockConnections: Connection[] = [
      {
        address: 'SP1ABC...DEF',
        username: 'alice_dao',
        avatar: '👩‍💼',
        reputation: 8500,
        relationship: 'mutual',
        sharedInterests: ['DeFi', 'Governance'],
        collaborations: 3
      },
      {
        address: 'SP2XYZ...GHI',
        username: 'bob_builder',
        avatar: '👨‍💻',
        reputation: 6200,
        relationship: 'mutual',
        sharedInterests: ['Infrastructure', 'Development'],
        collaborations: 1
      },
      {
        address: 'SP3MNO...PQR',
        username: 'carol_artist',
        avatar: '🎨',
        reputation: 7800,
        relationship: 'following',
        sharedInterests: ['NFT', 'Community'],
        collaborations: 0
      },
      {
        address: 'SP4STU...VWX',
        username: 'dave_investor',
        avatar: '💼',
        reputation: 9200,
        relationship: 'follower',
        sharedInterests: ['Treasury', 'Strategy'],
        collaborations: 0
      }
    ];

    const mockMessages: Message[] = [
      {
        id: 1,
        from: 'SP1ABC...DEF',
        to: currentUser,
        content: 'Hey! Would love to collaborate on the DeFi proposal',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        read: false
      },
      {
        id: 2,
        from: currentUser,
        to: 'SP1ABC...DEF',
        content: 'Absolutely! Let\'s discuss the details',
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
        read: true
      },
      {
        id: 3,
        from: 'SP2XYZ...GHI',
        to: currentUser,
        content: 'Great work on your last proposal!',
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
        read: false
      }
    ];

    const mockConversations: Conversation[] = [
      {
        user: mockConnections[0],
        lastMessage: mockMessages[1],
        unreadCount: 1
      },
      {
        user: mockConnections[1],
        lastMessage: mockMessages[2],
        unreadCount: 1
      }
    ];

    setConnections(mockConnections);
    setMessages(mockMessages);
    setConversations(mockConversations);
  }, [currentUser]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: messages.length + 1,
      from: currentUser,
      to: selectedConversation.address,
      content: newMessage,
      timestamp: Date.now(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRelationship === 'all' || conn.relationship === filterRelationship;
    return matchesSearch && matchesFilter;
  });

  const conversationMessages = selectedConversation
    ? messages.filter(m => 
        (m.from === selectedConversation.address && m.to === currentUser) ||
        (m.from === currentUser && m.to === selectedConversation.address)
      )
    : [];

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">🌐 User Network</h2>
          {totalUnread > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'connections'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            👥 Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            💬 Messages {totalUnread > 0 && `(${totalUnread})`}
          </button>
        </div>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterRelationship}
              onChange={(e) => setFilterRelationship(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Connections</option>
              <option value="mutual">Mutual</option>
              <option value="following">Following</option>
            </select>
          </div>

          {/* Collaboration Graph Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                        rounded-lg border border-purple-200 dark:border-purple-700 p-6">
            <h3 className="font-semibold mb-3">🕸️ Collaboration Graph</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {connections.filter(c => c.relationship === 'mutual').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Mutual</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {connections.reduce((sum, c) => sum + c.collaborations, 0)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Collaborations</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(connections.flatMap(c => c.sharedInterests)).size}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Shared Topics</div>
              </div>
            </div>
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 text-sm mb-2">Interactive network visualization</div>
              <div className="text-4xl">🕸️</div>
            </div>
          </div>

          {/* Connections List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConnections.map(connection => (
              <div
                key={connection.address}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{connection.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{connection.username}</h3>
                      {connection.relationship === 'mutual' && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/20 
                                       text-green-700 dark:text-green-300 rounded-full">
                          ⭐ Mutual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {connection.address}
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      🏆 {connection.reputation.toLocaleString()} • 
                      🤝 {connection.collaborations} collaborations
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {connection.sharedInterests.map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 
                                   rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedConversation(connection);
                          setActiveTab('messages');
                        }}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium 
                                 hover:bg-blue-700 transition"
                      >
                        💬 Message
                      </button>
                      <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs 
                                       font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        👤 View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Conversations</h3>
            {conversations.map(conv => (
              <div
                key={conv.user.address}
                onClick={() => setSelectedConversation(conv.user)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedConversation?.address === conv.user.address
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{conv.user.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{conv.user.username}</span>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {conv.lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formatTimeAgo(conv.lastMessage.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                        flex flex-col h-[600px]">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <div className="text-2xl">{selectedConversation.avatar}</div>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.username}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      🏆 {selectedConversation.reputation.toLocaleString()} reputation
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {conversationMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === currentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.from === currentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.from === currentUser
                            ? 'text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTimeAgo(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
                               disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <div>Select a conversation to start messaging</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

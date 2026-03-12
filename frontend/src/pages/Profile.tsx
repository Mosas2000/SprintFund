import { useEffect, useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { useWalletAddress, useWalletConnected, useWalletConnect } from '../store/wallet-selectors';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFocusOnMount } from '../hooks/useFocusOnMount';
import { fetchUserProfile } from '../lib/profile-data';
import { toErrorMessage } from '../lib/errors';
import {
  ProfileHeader,
  ProfileStatsGrid,
  UserProposals,
  VotingHistory,
  ActivityTimeline,
  ProfileSkeleton,
} from '../components/profile';
import { ErrorState } from '../components/ErrorState';
import type { UserProfile, ProfileTab } from '../types/profile';

/* ── Tab definitions ──────────────────────────── */

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'votes', label: 'Votes' },
  { id: 'activity', label: 'Activity' },
];

/* ── Not-connected state ──────────────────────── */

function NotConnected({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-white mb-3">Your Profile</h1>
      <p className="text-zinc-400 mb-6">
        Connect your wallet to view your profile and activity history.
      </p>
      <button
        type="button"
        onClick={onConnect}
        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        Connect Wallet
      </button>
    </div>
  );
}

/* ── Tab bar with keyboard navigation ─────────── */

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % TABS.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    onTabChange(TABS[nextIndex].id);

    // Move focus to the newly active tab button
    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div
      ref={tabListRef}
      className="flex gap-1 border-b border-white/10 pb-px"
      role="tablist"
      aria-label="Profile sections"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`profile-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`profile-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isActive
                ? 'bg-white/10 text-white border-b-2 border-indigo-500'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Tab panel content ────────────────────────── */

function TabPanel({
  activeTab,
  profile,
}: {
  activeTab: ProfileTab;
  profile: UserProfile;
}) {
  return (
    <div
      id={`profile-panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`profile-tab-${activeTab}`}
    >
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <ProfileStatsGrid stats={profile.stats} />
          <UserProposals proposals={profile.proposals} />
          <ActivityTimeline activity={profile.activity.slice(0, 5)} />
        </div>
      )}

      {activeTab === 'proposals' && (
        <UserProposals proposals={profile.proposals} />
      )}

      {activeTab === 'votes' && (
        <VotingHistory votes={profile.votes} />
      )}

      {activeTab === 'activity' && (
        <ActivityTimeline activity={profile.activity} />
      )}
    </div>
  );
}

/* ── Main page component ──────────────────────── */

export function ProfilePage() {
  const connected = useWalletConnected();
  const address = useWalletAddress();
  const connect = useWalletConnect();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle('Profile');

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [retryCount, setRetryCount] = useState(0);

  const loadProfile = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserProfile(address);
      setProfile(data);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
    loadProfile();
  }, [loadProfile]);

  // Not connected
  if (!connected || !address) {
    return <NotConnected onConnect={connect} />;
  }

  // Loading
  if (loading && !profile) {
    return (
      <div>
        <h1
          ref={headingRef}
          className="text-2xl font-bold text-white mb-6"
          tabIndex={-1}
        >
          Profile
        </h1>
        <ProfileSkeleton />
      </div>
    );
  }

  // Error with no cached data
  if (error && !profile) {
    return (
      <div>
        <h1
          ref={headingRef}
          className="text-2xl font-bold text-white mb-6"
          tabIndex={-1}
        >
          Profile
        </h1>
        <ErrorState
          title="Failed to load profile"
          message={error}
          onRetry={handleRetry}
          retryCount={retryCount}
          testId="profile-error"
        />
      </div>
    );
  }

  // Loaded
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <h1
        ref={headingRef}
        className="sr-only"
        tabIndex={-1}
      >
        Profile for {address}
      </h1>

      <ProfileHeader
        address={address}
        stxBalance={profile.stats.stxBalance}
        stakedAmount={profile.stats.stakedAmount}
      />

      {/* Background refresh error banner */}
      {error && profile && (
        <div
          role="alert"
          className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300 flex items-center justify-between"
        >
          <span>Failed to refresh profile data: {error}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs text-amber-400 hover:text-amber-200 transition-colors underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Background refresh loading indicator */}
      {loading && profile && (
        <div
          role="status"
          className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs text-indigo-300 flex items-center gap-2"
        >
          <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span>Refreshing profile data...</span>
        </div>
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <TabPanel activeTab={activeTab} profile={profile} />

      {/* Refresh button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={handleRetry}
          disabled={loading}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-3 py-1 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh profile'}
        </button>
      </div>
    </div>
  );
}

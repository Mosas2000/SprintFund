'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import BadgeGallery from '@/components/common/BadgeGallery';
import InterestProfiler from '@/components/InterestProfiler';
import DelegationStats from '@/components/DelegationStats';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { ActivityTimeline, VotingHistory, UserProposals, ProfileStatsGrid } from '@/components/profile';
import { fetchUserProfile } from '@/lib/profile-data';
import { toErrorMessage } from '@/lib/errors';
import {
  useWalletAddress,
  useWalletConnect,
  useWalletConnected,
  useWalletDisconnect,
  useWalletLoading,
} from '@/store/wallet-selectors';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { UserProfile } from '@/types/profile';
import { Settings, LogOut, Wallet } from 'lucide-react';

function shortenAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function TimelinePlaceholder({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:p-8">
      <h3 className="mb-2 text-lg font-semibold text-white">Wallet activity timeline</h3>
      <p className="mb-6 text-sm text-slate-400">
        Connect your wallet to see recent proposals, votes, and execution activity.
      </p>
      <button
        type="button"
        onClick={onConnect}
        className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-500"
      >
        Connect Wallet
      </button>
    </div>
  );
}

function TimelineLoading() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-48 rounded bg-white/10" />
        <div className="h-4 w-72 rounded bg-white/10" />
        <div className="space-y-3 pt-4">
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="h-20 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

function TimelineError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 sm:p-8">
      <h3 className="mb-2 text-lg font-semibold text-white">Unable to load activity</h3>
      <p className="mb-6 text-sm text-red-200">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl border border-red-400/30 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-500/20"
      >
        Retry
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const walletLoading = useWalletLoading();
  const connected = useWalletConnected();
  const address = useWalletAddress();
  const connect = useWalletConnect();
  const disconnect = useWalletDisconnect();

  const [activeTab, setActiveTab] = useState<'activity' | 'votes' | 'proposals'>('activity');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!address || !connected) return;

    setActivityLoading(true);
    setActivityError(null);

    try {
      const data = await fetchUserProfile(address);
      setProfile(data);
    } catch (error) {
      setActivityError(toErrorMessage(error));
    } finally {
      setActivityLoading(false);
    }
  }, [address, connected]);

  useEffect(() => {
    if (!connected || !address) return;

    const timeout = window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [address, connected, loadProfile]);

  const isCurrentProfile = profile?.address === address;
  const visibleActivity = isCurrentProfile ? profile.activity : [];
  const showTimelineLoading = Boolean(connected && address && (activityLoading || !isCurrentProfile));
  const avatarInitials = address ? address.slice(0, 2).toUpperCase() : 'SP';

  if (walletLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <div className="group relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-orange-600 to-orange-500 text-3xl font-black text-white shadow-2xl sm:h-32 sm:w-32 sm:rounded-[40px] sm:text-4xl">
                {avatarInitials}
                <div className="absolute inset-0 rounded-[32px] border border-white/20 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100 sm:rounded-[40px]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Sync</span>
                </div>
                <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-white sm:text-5xl">
                  {address ? 'Wallet Profile' : 'Sprint Citizen'}
                </h2>
                <div className="flex items-center gap-3">
                  <Wallet className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-bold uppercase tracking-widest leading-relaxed text-slate-500">
                    {address ? shortenAddress(address) : 'Connect a wallet to view your profile'}
                  </p>
                  {address && (
                    <button
                      onClick={() => navigator.clipboard.writeText(address)}
                      className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-orange-400 transition-colors"
                    >
                      [Copy]
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <button className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-400 transition-all hover:bg-white/10 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>
            {connected && address ? (
              <button
                type="button"
                onClick={disconnect}
                className="flex items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-600/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-600 hover:text-white sm:px-8"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={connect}
                className="flex items-center justify-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-600/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-orange-400 transition-all hover:bg-orange-600 hover:text-white sm:px-8"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DelegationStats />
          </div>
          <div className="lg:col-span-2">
            <BadgeGallery />
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <InterestProfiler />
          <UserDashboard userAddress={address} />
        </div>

        {profile && (
          <div className="mb-12">
            <ProfileStatsGrid stats={profile.stats} />
          </div>
        )}

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                {activeTab === 'activity' ? 'Activity Timeline' : activeTab === 'votes' ? 'Voting History' : 'My Proposals'}
              </h3>
              <p className="text-sm text-slate-400">
                {activeTab === 'activity' 
                  ? 'Recent proposal, voting, and execution activity for the connected wallet.'
                  : activeTab === 'votes'
                  ? 'History of all governance votes cast by this wallet.'
                  : 'Proposals created and submitted to the DAO by this wallet.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 p-1">
              {(['activity', 'votes', 'proposals'] as const).map((tab) => (
                <button
                  key={tab} aria-label={`Switch to ${tab} view`}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {!connected || !address ? (
            <TimelinePlaceholder onConnect={connect} />
          ) : showTimelineLoading ? (
            <TimelineLoading />
          ) : activityError ? (
            <TimelineError error={activityError} onRetry={loadProfile} />
          ) : (
            <div className="mt-4">
              {activeTab === 'activity' && (
                <ActivityTimeline activity={visibleActivity} />
              )}
              {activeTab === 'votes' && (
                <VotingHistory votes={profile?.votes || []} />
              )}
              {activeTab === 'proposals' && (
                <UserProposals proposals={profile?.proposals || []} />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
// Final verified build

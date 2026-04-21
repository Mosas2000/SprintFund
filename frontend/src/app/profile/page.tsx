'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '@/components/Header';
import BadgeGallery from '@/components/common/BadgeGallery';
import InterestProfiler from '@/components/InterestProfiler';
import DelegationStats from '@/components/DelegationStats';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { ActivityTimeline } from '@/components/profile';
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
      <h3 className="text-lg font-semibold text-white mb-2">Wallet activity timeline</h3>
      <p className="text-sm text-slate-400 mb-6">
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
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
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8">
      <h3 className="text-lg font-semibold text-white mb-2">Unable to load activity</h3>
      <p className="text-sm text-red-200 mb-6">{error}</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl relative group">
              {avatarInitials}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] border border-white/20" />
            </div>
            <div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">
                {address ? 'Wallet Profile' : 'Sprint Citizen'}
              </h2>
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-slate-500" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  {address ? shortenAddress(address) : 'Connect a wallet to view your profile'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
            {connected && address ? (
              <button
                type="button"
                onClick={disconnect}
                className="flex items-center gap-3 px-8 py-4 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={connect}
                className="flex items-center gap-3 px-8 py-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <DelegationStats />
          </div>
          <div className="lg:col-span-2">
            <BadgeGallery />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <InterestProfiler />
          <UserDashboard userAddress={address} />
        </div>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Wallet activity timeline</h3>
              <p className="text-sm text-slate-400">
                Recent proposal, voting, and execution activity for the connected wallet.
              </p>
            </div>
            {address && (
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {shortenAddress(address)}
              </p>
            )}
          </div>

          {!connected || !address ? (
            <TimelinePlaceholder onConnect={connect} />
          ) : showTimelineLoading ? (
            <TimelineLoading />
          ) : activityError ? (
            <TimelineError error={activityError} onRetry={loadProfile} />
          ) : (
            <ActivityTimeline activity={visibleActivity} />
          )}
        </section>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import type { UserSession, UserData } from '@stacks/connect';
import { CONTRACT_PRINCIPAL } from '@/config';
import SprintFundHero from '@/components/ui/SprintFundHero';
import CreateProposalForm from '@/components/CreateProposalForm';
import ProposalList from '@/components/ProposalList';
import UserDashboard from '@/components/dashboard/UserDashboard';
import Stats from '@/components/Stats';
import Header from '@/components/Header';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingSpinner, LoadingOverlay } from '@/components/LoadingIndicators';
import { createLoadingState, updateLoadingState } from '@/lib/loading-state';
import type { LoadingState } from '@/lib/loading-state';

type StacksUserData = UserData;

export default function Home() {
  const [userData, setUserData] = useState<StacksUserData | null>(null);
  const [copied, setCopied] = useState(false);
  const [walletLoading, setWalletLoading] = useState<LoadingState>(createLoadingState('loading'));
  const [connectLoading, setConnectLoading] = useState<LoadingState>(createLoadingState('idle'));
  const userSessionRef = useRef<UserSession | null>(null);

  useEffect(() => {
    let timeout: number | undefined;
    (async () => {
      try {
        const { AppConfig, UserSession } = await import('@stacks/connect');
        const appConfig = new AppConfig(['store_write', 'publish_data']);
        const userSession = new UserSession({ appConfig });
        userSessionRef.current = userSession;

        if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then((data) => {
            timeout = window.setTimeout(() => {
              setUserData(data);
              setWalletLoading(updateLoadingState(walletLoading, 'success'));
            }, 0);
          });
        } else if (userSession.isUserSignedIn()) {
          timeout = window.setTimeout(() => {
            setUserData(userSession.loadUserData());
            setWalletLoading(updateLoadingState(walletLoading, 'success'));
          }, 0);
        } else {
          setWalletLoading(updateLoadingState(walletLoading, 'success'));
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
        setWalletLoading(updateLoadingState(walletLoading, 'error'));
      }
    })();
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  const connectWallet = () => {
    setConnectLoading(updateLoadingState(connectLoading, 'loading'));
    (async () => {
      try {
        const userSession = userSessionRef.current;
        if (!userSession) {
          setConnectLoading(updateLoadingState(connectLoading, 'error'));
          return;
        }

        const { showConnect } = await import('@stacks/connect');
        showConnect({
          appDetails: {
            name: 'SprintFund',
            icon: '/icon.png',
          },
          redirectTo: '/',
          onFinish: () => {
            const data = userSession.loadUserData();
            setUserData(data);
            setConnectLoading(updateLoadingState(connectLoading, 'success'));
          },
          userSession,
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setConnectLoading(updateLoadingState(connectLoading, 'error'));
      }
    })();
  };

  const disconnectWallet = () => {
    userSessionRef.current?.signUserOut();
    setUserData(null);
    setConnectLoading(updateLoadingState(connectLoading, 'idle'));
  };

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_PRINCIPAL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy contract address', error);
    }
  };

  if (walletLoading.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Initializing wallet connection...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent">
        <Header />
        <LoadingOverlay isVisible={connectLoading.isLoading} message="Connecting wallet..." />

        <SprintFundHero />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Contract Address Display */}
          <div className="text-center mb-12">
            <div className="inline-block bg-slate-800 rounded-lg px-6 py-3 border border-slate-700">
              <p className="text-sm text-slate-300 mb-1">Contract Address</p>
              <code className="text-white font-mono text-sm break-all">
                {CONTRACT_PRINCIPAL}
              </code>
            </div>
          </div>

          {/* User Dashboard */}
          <UserDashboard userAddress={userData?.profile?.stxAddress?.mainnet} />

          {/* Platform Statistics */}
          <Stats />

          {/* Features Grid */}
          <div id="create-proposal" className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Create Proposal Form */}
            <CreateProposalForm userAddress={userData?.profile?.stxAddress?.mainnet} />

            {/* Active Proposals List */}
            <ProposalList userAddress={userData?.profile?.stxAddress?.mainnet} />
          </div>

          {/* Info Section */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-orange-400 font-bold text-lg mb-2">1. Stake</div>
                <p className="text-slate-300 text-sm">
                  Stake 10 STX to gain proposal creation rights and anti-spam protection.
                </p>
              </div>
              <div>
                <div className="text-blue-400 font-bold text-lg mb-2">2. Vote</div>
                <p className="text-purple-200 text-sm">
                  Use quadratic voting (cost = weight²) to ensure fair governance.
                </p>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-lg mb-2">3. Execute</div>
                <p className="text-purple-200 text-sm">
                  Approved proposals get funded automatically in 24 hours.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700 mt-20 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Navigation</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/proposals" className="hover:text-white transition-colors">Proposals</Link></li>
                  <li><Link href="/analytics" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/api-docs" className="hover:text-white transition-colors">API Docs</Link></li>
                  <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Social</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter/X</a></li>
                  <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Contract</h4>
                <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                  <p className="text-[11px] text-slate-400 mb-1">Mainnet Contract Address</p>
                  <code className="text-xs text-slate-200 break-all">{CONTRACT_PRINCIPAL}</code>
                  <button
                    type="button"
                    onClick={copyContractAddress}
                    className="mt-3 inline-flex items-center rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
                  >
                    {copied ? 'Copied' : 'Copy Address'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Network: Mainnet Online</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>API: Operational</span>
                </div>
                <span>Version: v0.1.0</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a>
                <span>Terms and Privacy: Coming Soon</span>
              </div>
            </div>

            <p className="text-center text-slate-500 text-xs">
              SprintFund DAO on Stacks.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

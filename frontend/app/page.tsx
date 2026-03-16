'use client';

import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import SprintFundHero from '@/components/ui/SprintFundHero';
import CreateProposalForm from '@/components/CreateProposalForm';
import ProposalList from '@/components/ProposalList';
import UserDashboard from '@/components/UserDashboard';
import Stats from '@/components/Stats';
import Header from '@/components/Header';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core';

/**
 * User session data from Stacks Connect.
 * Typed shape matching the return of userSession.loadUserData().
 */
interface StacksUserData {
  appPrivateKey: string;
  hubUrl: string;
  username?: string;
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
    [key: string]: unknown;
  };
  identityAddress?: string;
  decentralizedID?: string;
}

export default function Home() {
  const [userData, setUserData] = useState<StacksUserData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: number | undefined;
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        timeout = window.setTimeout(() => setUserData(data), 0);
      });
    } else if (userSession.isUserSignedIn()) {
      timeout = window.setTimeout(() => setUserData(userSession.loadUserData()), 0);
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'SprintFund',
        icon: '/icon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
  };

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy contract address', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent">
        <Header />

        {/* Hero Section with Dithering Animation */}
        <SprintFundHero />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Contract Address Display */}
          <div className="text-center mb-12">
            <div className="inline-block bg-slate-800 rounded-lg px-6 py-3 border border-slate-700">
              <p className="text-sm text-slate-300 mb-1">Contract Address</p>
              <code className="text-white font-mono text-sm break-all">
                {CONTRACT_ADDRESS}
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
                  <code className="text-xs text-slate-200 break-all">{CONTRACT_ADDRESS}</code>
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

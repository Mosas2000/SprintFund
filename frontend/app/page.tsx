'use client';

import { useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import SprintFundHero from '@/components/ui/SprintFundHero';
import CreateProposalForm from '@/components/CreateProposalForm';
import ProposalList from '@/components/ProposalList';
import UserDashboard from '@/components/UserDashboard';
import Stats from '@/components/Stats';
import DarkModeToggle from '@/components/DarkModeToggle';
import ToastProvider from '@/components/ToastProvider';
import CopyButton from '@/components/CopyButton';
import ErrorBoundary from '@/components/ErrorBoundary';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core';

export default function Home() {
  const [userData, setUserData] = useState<any>(null);

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900">
        <ToastProvider />
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <h1 className="text-2xl font-bold text-white">SprintFund</h1>
              </div>
              <div className="flex items-center space-x-3">
                <DarkModeToggle />
                {userData ? (
                  <button
                    onClick={disconnectWallet}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 border border-slate-600"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

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
                <div className="text-blue-400 font-bold text-lg mb-2">1. Stake</div>
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
        <footer className="border-t border-slate-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-slate-400 text-sm">
              Built with ❤️ on Stacks Blockchain
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

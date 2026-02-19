'use client';

import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import SprintFundHero from '@/components/ui/SprintFundHero';
import CreateProposalForm from '@/components/CreateProposalForm';
import ProposalList from '@/components/ProposalList';
import UserDashboard from '@/components/UserDashboard';
import Stats from '@/components/Stats';
import Header from '@/components/Header';

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

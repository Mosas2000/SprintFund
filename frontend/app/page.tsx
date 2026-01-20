'use client';

import { useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import CreateProposalForm from '@/components/CreateProposalForm';
import ProposalList from '@/components/ProposalList';
import UserDashboard from '@/components/UserDashboard';
import Stats from '@/components/Stats';
import DarkModeToggle from '@/components/DarkModeToggle';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg"></div>
              <h1 className="text-2xl font-bold text-white">SprintFund</h1>
            </div>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              {userData ? (
                <button
                  onClick={disconnectWallet}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-4">
            Fund ideas in 24 hours
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Lightning-fast micro-grants DAO on Stacks blockchain
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
            <p className="text-sm text-purple-200 mb-1">Contract Address</p>
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
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Create Proposal Form */}
          <CreateProposalForm userAddress={userData?.profile?.stxAddress?.mainnet} />

          {/* Active Proposals List */}
          <ProposalList userAddress={userData?.profile?.stxAddress?.mainnet} />
        </div>

        {/* Info Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-purple-400 font-bold text-lg mb-2">1. Stake</div>
              <p className="text-purple-200 text-sm">
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
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-purple-300 text-sm">
            Built with ❤️ on Stacks Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
}

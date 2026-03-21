'use client';

import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialSharingProps {
  proposalId: string;
  proposalTitle: string;
}

export function SocialSharing({ proposalId, proposalTitle }: SocialSharingProps) {
  const [copied, setCopied] = useState(false);

  const proposalUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/proposals/${proposalId}`
    : '';

  const shareText = `Check out this proposal on SprintFund: "${proposalTitle}"`;

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(proposalUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(proposalUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(proposalUrl)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proposalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">Share This Proposal</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Twitter
          </a>

          <a
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors text-sm font-medium"
          >
            LinkedIn
          </a>

          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Facebook
          </a>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={proposalUrl}
            readOnly
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

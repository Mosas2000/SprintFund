'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface CopyButtonProps {
    text: string;
    label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 text-sm flex items-center space-x-2"
            aria-label={label}
        >
            {copied ? (
                <>
                    <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}

'use client';

import { useEffect } from 'react';
import { UserSession } from '@stacks/connect';

export function useSessionSecurity(userSession: UserSession, onDisconnect: () => void) {
    useEffect(() => {
        // Check if session is still valid
        const checkSession = () => {
            if (!userSession.isUserSignedIn()) {
                onDisconnect();
            }
        };

        // Listener for storage changes (e.g. if user signs out in another tab)
        window.addEventListener('storage', (e) => {
            if (e.key === 'stacks-session') {
                checkSession();
            }
        });

        // Heartbeat check every 30 seconds
        const interval = setInterval(checkSession, 30000);

        return () => {
            window.removeEventListener('storage', checkSession);
            clearInterval(interval);
        };
    }, [userSession, onDisconnect]);
}

export function sanitizeInput(input: string): string {
    // Simple XSS prevention for proposal titles/descriptions
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

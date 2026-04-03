'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 5000,
                style: {
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                },
                success: {
                    iconTheme: {
                        primary: '#EA580C',
                        secondary: '#fff',
                    },
                    style: {
                        border: '1px solid rgba(234, 88, 12, 0.3)',
                    }
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                    style: {
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                    }
                },
            }}
        />
    );
}

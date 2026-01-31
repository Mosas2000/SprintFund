import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✅',
                    bg: 'bg-green-50 dark:bg-green-900/30',
                    border: 'border-green-500',
                    text: 'text-green-800 dark:text-green-300',
                };
            case 'error':
                return {
                    icon: '❌',
                    bg: 'bg-red-50 dark:bg-red-900/30',
                    border: 'border-red-500',
                    text: 'text-red-800 dark:text-red-300',
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
                    border: 'border-yellow-500',
                    text: 'text-yellow-800 dark:text-yellow-300',
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    bg: 'bg-blue-50 dark:bg-blue-900/30',
                    border: 'border-blue-500',
                    text: 'text-blue-800 dark:text-blue-300',
                };
        }
    };

    const config = getToastConfig();

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 ${config.bg} ${config.border} ${config.text} shadow-lg animate-slide-in-right`}
            role="alert"
        >
            <span className="text-2xl flex-shrink-0">{config.icon}</span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// Toast Container Component
interface ToastContainerProps {
    children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {children}
        </div>
    );
}

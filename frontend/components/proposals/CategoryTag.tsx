import React from 'react';

type Category = 'development' | 'marketing' | 'community' | 'operations' | 'governance';

interface CategoryTagProps {
    category: Category;
    size?: 'sm' | 'md' | 'lg';
}

export default function CategoryTag({ category, size = 'md' }: CategoryTagProps) {
    const getCategoryConfig = () => {
        switch (category) {
            case 'development':
                return {
                    label: 'Development',
                    icon: '💻',
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-800 dark:text-blue-300',
                    border: 'border-blue-300 dark:border-blue-700',
                };
            case 'marketing':
                return {
                    label: 'Marketing',
                    icon: '📢',
                    bg: 'bg-purple-100 dark:bg-purple-900/30',
                    text: 'text-purple-800 dark:text-purple-300',
                    border: 'border-purple-300 dark:border-purple-700',
                };
            case 'community':
                return {
                    label: 'Community',
                    icon: '👥',
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-800 dark:text-green-300',
                    border: 'border-green-300 dark:border-green-700',
                };
            case 'operations':
                return {
                    label: 'Operations',
                    icon: '⚙️',
                    bg: 'bg-orange-100 dark:bg-orange-900/30',
                    text: 'text-orange-800 dark:text-orange-300',
                    border: 'border-orange-300 dark:border-orange-700',
                };
            case 'governance':
                return {
                    label: 'Governance',
                    icon: '🏛️',
                    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
                    text: 'text-indigo-800 dark:text-indigo-300',
                    border: 'border-indigo-300 dark:border-indigo-700',
                };
            default:
                return {
                    label: 'Other',
                    icon: '📋',
                    bg: 'bg-gray-100 dark:bg-gray-900/30',
                    text: 'text-gray-800 dark:text-gray-300',
                    border: 'border-gray-300 dark:border-gray-700',
                };
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-2 py-0.5 text-xs';
            case 'lg':
                return 'px-4 py-2 text-base';
            default:
                return 'px-3 py-1 text-sm';
        }
    };

    const config = getCategoryConfig();
    const sizeClasses = getSizeClasses();

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}

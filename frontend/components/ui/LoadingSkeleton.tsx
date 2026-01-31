import React from 'react';

interface LoadingSkeletonProps {
    variant?: 'text' | 'card' | 'avatar' | 'button';
    width?: string;
    height?: string;
    count?: number;
}

export default function LoadingSkeleton({
    variant = 'text',
    width = '100%',
    height,
    count = 1
}: LoadingSkeletonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'text':
                return {
                    height: height || '1rem',
                    rounded: 'rounded',
                };
            case 'card':
                return {
                    height: height || '12rem',
                    rounded: 'rounded-lg',
                };
            case 'avatar':
                return {
                    height: height || '3rem',
                    width: width || '3rem',
                    rounded: 'rounded-full',
                };
            case 'button':
                return {
                    height: height || '2.5rem',
                    rounded: 'rounded-lg',
                };
            default:
                return {
                    height: height || '1rem',
                    rounded: 'rounded',
                };
        }
    };

    const styles = getVariantStyles();

    const skeletonElement = (
        <div
            className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${styles.rounded}`}
            style={{
                width: variant === 'avatar' ? styles.width : width,
                height: styles.height
            }}
        />
    );

    if (count === 1) {
        return skeletonElement;
    }

    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>{skeletonElement}</div>
            ))}
        </div>
    );
}

// Proposal Card Skeleton
export function ProposalCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
                <LoadingSkeleton variant="text" width="60%" height="1.5rem" />
                <LoadingSkeleton variant="button" width="5rem" height="1.75rem" />
            </div>
            <LoadingSkeleton variant="text" count={2} />
            <div className="mt-4 flex items-center gap-4">
                <LoadingSkeleton variant="avatar" width="2.5rem" height="2.5rem" />
                <LoadingSkeleton variant="text" width="8rem" />
            </div>
        </div>
    );
}

// List Skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <ProposalCardSkeleton key={index} />
            ))}
        </div>
    );
}

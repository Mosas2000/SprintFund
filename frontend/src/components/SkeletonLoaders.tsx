/**
 * Skeleton loading components.
 */

import React from 'react';

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  radius?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = 16,
  width = '100%',
  radius = 4,
  className = '',
  count = 1,
}) => {
  const heightPx = typeof height === 'number' ? `${height}px` : height;
  const widthVal = typeof width === 'number' ? `${width}px` : width;
  const radiusPx = typeof radius === 'number' ? `${radius}px` : radius;

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 dark:bg-gray-700"
          style={{
            height: heightPx,
            width: widthVal,
            borderRadius: radiusPx,
            marginBottom: i < count - 1 ? '8px' : 0,
          }}
        />
      ))}
    </div>
  );
};

export const ProposalCardSkeleton: React.FC = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <div className="mb-3 flex items-start justify-between">
      <Skeleton height={24} width="70%" radius={4} />
      <Skeleton height={24} width="60px" radius={12} />
    </div>
    <Skeleton height={16} width="100%" count={2} />
    <div className="mt-4">
      <Skeleton height={8} width="100%" radius={4} />
    </div>
  </div>
);

export const StatsSkeleton: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <Skeleton height={16} width="40%" className="mb-2" />
        <Skeleton height={32} width="60%" className="mb-2" />
        <Skeleton height={12} width="50%" />
      </div>
    ))}
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <ProposalCardSkeleton key={i} />
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <Skeleton height={20} width="30%" className="mb-4" />
      <StatsSkeleton />
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <Skeleton height={20} width="25%" className="mb-4" />
      <ListSkeleton count={3} />
    </div>
  </div>
);

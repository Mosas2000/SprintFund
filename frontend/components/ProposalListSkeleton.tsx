import React from 'react';

interface ProposalListSkeletonProps {
  count?: number;
}

export const ProposalListSkeleton: React.FC<ProposalListSkeletonProps> = ({
  count = 10,
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
        >
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

import { memo } from 'react';

/**
 * Shared pulse bar building block for skeleton states.
 */
function Bar({ className }: { className: string }) {
  return (
    <div
      className={`rounded bg-white/10 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for the ProfileHeader area.
 */
function HeaderSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 animate-pulse shrink-0" />
          <div className="space-y-2">
            <Bar className="h-6 w-40" />
            <Bar className="h-3 w-28" />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="space-y-2">
            <Bar className="h-3 w-16" />
            <Bar className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Bar className="h-3 w-16" />
            <Bar className="h-5 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the stats grid.
 */
function StatsGridSkeleton() {
  return (
    <div>
      <Bar className="h-5 w-24 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`stat-skel-${i}`}
            className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5 space-y-2"
          >
            <Bar className="h-3 w-20" />
            <Bar className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for a list section (proposals, votes, or activity).
 */
function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div>
      <Bar className="h-5 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={`list-skel-${i}`}
            className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Bar className="h-4 w-48" />
              <Bar className="h-4 w-16" />
            </div>
            <Bar className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full profile page skeleton matching the layout of the loaded state.
 * Shows pulsing placeholders for header, stats, and content sections.
 */
function ProfileSkeletonBase() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading profile">
      <HeaderSkeleton />
      <StatsGridSkeleton />

      {/* Tab bar skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Bar key={`tab-skel-${i}`} className="h-8 w-24 rounded-lg" />
        ))}
      </div>

      <ListSkeleton rows={3} />

      <span className="sr-only">Loading profile data, please wait.</span>
    </div>
  );
}

const ProfileSkeleton = memo(ProfileSkeletonBase);
ProfileSkeleton.displayName = 'ProfileSkeleton';
export default ProfileSkeleton;

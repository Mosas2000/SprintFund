/**
 * Barrel exports for all profile-related components.
 *
 * Allows consumers to import profile UI pieces from a single path
 * instead of five separate component files:
 *
 *   import {
 *     ProfileHeader,
 *     ProfileStatsGrid,
 *     UserProposals,
 *     VotingHistory,
 *     ActivityTimeline,
 *     ProfileSkeleton,
 *   } from '../components/profile';
 */

export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileStatsGrid } from './ProfileStatsGrid';
export { default as UserProposals } from './UserProposals';
export { default as VotingHistory } from './VotingHistory';
export { default as ActivityTimeline } from './ActivityTimeline';
export { default as ProfileSkeleton } from './ProfileSkeleton';

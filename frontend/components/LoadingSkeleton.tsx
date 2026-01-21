export default function LoadingSkeleton() {
    return (
        <div className="bg-white/5 dark:bg-gray-800/50 border border-white/10 dark:border-gray-700 rounded-xl p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            </div>

            {/* Details skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
            </div>

            {/* Voting stats skeleton */}
            <div className="bg-white/5 dark:bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
            </div>
        </div>
    );
}

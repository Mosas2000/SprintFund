export default function LoadingSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                </div>
            </div>

            {/* Details skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="h-3 bg-white/10 rounded w-1/2 mb-1"></div>
                    <div className="h-5 bg-white/10 rounded w-3/4"></div>
                </div>
                <div>
                    <div className="h-3 bg-white/10 rounded w-1/2 mb-1"></div>
                    <div className="h-5 bg-white/10 rounded w-3/4"></div>
                </div>
            </div>

            {/* Voting stats skeleton */}
            <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/6"></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/6"></div>
                </div>
            </div>
        </div>
    );
}

'use client';

export function ProposalDetailSkeleton() {
  return (
    <div className="min-h-screen py-8 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="h-10 w-32 bg-white/10 rounded"></div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-12 w-3/4 bg-white/10 rounded"></div>

            <div className="flex gap-3">
              <div className="h-8 w-24 bg-white/10 rounded-full"></div>
              <div className="h-8 w-48 bg-white/10 rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-6 w-full bg-white/10 rounded"></div>
              <div className="h-6 w-5/6 bg-white/10 rounded"></div>
              <div className="h-6 w-4/5 bg-white/10 rounded"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/10 rounded-lg"></div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

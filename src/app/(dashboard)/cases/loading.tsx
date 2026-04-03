export default function CasesLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header skeleton */}
      <div className="flex flex-col gap-1">
        <div className="h-8 w-32 bg-surface-container rounded animate-pulse"></div>
        <div className="h-4 w-80 bg-surface-container-low rounded animate-pulse"></div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm">
            <div className="h-3 w-24 bg-surface-container-low rounded animate-pulse mb-3"></div>
            <div className="h-8 w-12 bg-surface-container rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-surface-container-low rounded animate-pulse"></div>
          <div className="h-8 w-28 bg-surface-container-low rounded animate-pulse"></div>
          <div className="h-8 w-28 bg-surface-container-low rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-surface-container-low rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="bg-surface-container-low border-b border-outline-variant/20 px-6 py-4">
          <div className="flex gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-3 w-16 bg-surface-container rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-outline-variant/10 flex gap-8 items-center">
            <div className="h-4 w-16 bg-surface-container-low rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-surface-container-low rounded animate-pulse"></div>
            <div className="h-5 w-20 bg-surface-container-low rounded-full animate-pulse"></div>
            <div className="h-4 w-12 bg-surface-container-low rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-surface-container-low rounded animate-pulse"></div>
            <div className="h-3 w-10 bg-surface-container-low rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

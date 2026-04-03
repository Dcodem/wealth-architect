export default function SettingsLoading() {
  return (
    <div className="max-w-[800px] mx-auto py-12 px-8">
      {/* Header skeleton */}
      <div className="mb-12 border-b border-outline-variant/20 pb-8">
        <div className="h-10 w-48 bg-surface-container-low rounded animate-pulse" />
        <div className="h-5 w-80 bg-surface-container-low rounded animate-pulse mt-3" />
      </div>
      <div className="space-y-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-surface-container-low rounded animate-pulse" />
                <div className="h-6 w-56 bg-surface-container-low rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-surface-container-low rounded animate-pulse" />
              <div className="space-y-4 mt-6">
                <div className="h-10 w-full bg-surface-container-low rounded animate-pulse" />
                <div className="h-10 w-full bg-surface-container-low rounded animate-pulse" />
              </div>
            </div>
            <div className="bg-surface-container-low border-t border-outline-variant/20 px-8 py-4 flex justify-end">
              <div className="h-9 w-32 bg-surface-container-low rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

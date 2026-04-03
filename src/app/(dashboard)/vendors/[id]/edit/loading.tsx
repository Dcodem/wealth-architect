export default function EditVendorLoading() {
  return (
    <div className="pt-8 pb-12 px-12">
      {/* Header skeleton */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="h-3 w-48 bg-surface-container-high rounded animate-pulse mb-3" />
          <div className="h-12 w-80 bg-surface-container-high rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-24 bg-surface-container-high rounded-lg animate-pulse" />
          <div className="h-12 w-32 bg-surface-container-high rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        {/* Form skeleton */}
        <div className="col-span-8 space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <section key={i}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-6 w-48 bg-surface-container-high rounded animate-pulse" />
                <div className="h-[1px] flex-1 bg-surface-container-high" />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-12 bg-surface-container-low rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-12 bg-surface-container-low rounded animate-pulse" />
                </div>
              </div>
            </section>
          ))}
        </div>
        {/* Sidebar skeleton */}
        <div className="col-span-4 space-y-8">
          <div className="bg-surface-container-lowest p-8 border border-outline-variant/10 shadow-sm">
            <div className="h-6 w-48 bg-surface-container-high rounded animate-pulse mb-6" />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
                    <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-surface-container-high rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="px-2 space-y-6">
            <div className="h-4 w-36 bg-surface-container-high rounded animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="pl-8 space-y-1">
                <div className="h-3 w-40 bg-surface-container-high rounded animate-pulse" />
                <div className="h-3 w-32 bg-surface-container-high rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

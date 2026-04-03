export default function AddVendorLoading() {
  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse mb-3" />
          <div className="h-10 w-72 bg-surface-container-high rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-[32rem] bg-surface-container-high rounded animate-pulse" />
        </div>
        {/* Upload section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          <div>
            <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse mb-2" />
            <div className="h-4 w-56 bg-surface-container-high rounded animate-pulse" />
          </div>
          <div className="lg:col-span-2">
            <div className="border-2 border-dashed border-surface-container-high rounded-xl p-10 flex flex-col items-center">
              <div className="h-12 w-12 bg-surface-container-high rounded-full animate-pulse mb-4" />
              <div className="h-5 w-64 bg-surface-container-high rounded animate-pulse mb-2" />
              <div className="h-4 w-80 bg-surface-container-high rounded animate-pulse mb-6" />
              <div className="h-10 w-40 bg-surface-container-high rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        {/* Form sections skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12 pt-8 border-t border-outline-variant/10">
            <div>
              <div className="h-6 w-48 bg-surface-container-high rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-surface-container-high rounded animate-pulse" />
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 h-12 bg-surface-container-low rounded-lg animate-pulse" />
                <div className="h-12 bg-surface-container-low rounded-lg animate-pulse" />
                <div className="h-12 bg-surface-container-low rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

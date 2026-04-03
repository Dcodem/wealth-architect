export default function VendorDetailLoading() {
  return (
    <div className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header skeleton */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-xl bg-primary-fixed animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-10 w-72 bg-primary-fixed rounded-lg animate-pulse" />
              <div className="h-5 w-48 bg-primary-fixed rounded animate-pulse" />
              <div className="h-4 w-56 bg-primary-fixed rounded animate-pulse mt-1" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-primary-fixed rounded animate-pulse" />
            <div className="h-10 w-32 bg-primary-fixed rounded animate-pulse" />
          </div>
        </header>

        {/* Metrics skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
              <div className="h-3 w-24 bg-primary-fixed rounded animate-pulse mb-4" />
              <div className="h-10 w-20 bg-primary-fixed rounded animate-pulse" />
              <div className="h-3 w-32 bg-primary-fixed rounded animate-pulse mt-2" />
            </div>
          ))}
        </section>

        {/* Main split skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Active Assignments skeleton */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-outline-variant/10">
                <div className="h-6 w-48 bg-primary-fixed rounded animate-pulse" />
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="px-8 py-6 border-b border-outline-variant/10">
                  <div className="h-3 w-20 bg-primary-fixed rounded animate-pulse mb-2" />
                  <div className="h-5 w-64 bg-primary-fixed rounded animate-pulse mb-3" />
                  <div className="h-4 w-full bg-primary-fixed rounded animate-pulse mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed animate-pulse" />
                      <div className="w-8 h-8 rounded-full bg-primary-fixed animate-pulse" />
                    </div>
                    <div className="h-4 w-24 bg-primary-fixed rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* History skeleton */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <div className="h-6 w-36 bg-primary-fixed rounded animate-pulse" />
                <div className="h-4 w-20 bg-primary-fixed rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-low p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded bg-primary-fixed animate-pulse" />
                      <div>
                        <div className="h-3 w-24 bg-primary-fixed rounded animate-pulse mb-1" />
                        <div className="h-4 w-32 bg-primary-fixed rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-3 w-40 bg-primary-fixed rounded animate-pulse mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-primary-fixed rounded animate-pulse" />
                      <div className="h-4 w-16 bg-primary-fixed rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full mt-6 h-12 bg-primary-fixed rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="h-32 bg-primary-fixed animate-pulse" />
              <div className="p-6 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-primary-fixed rounded animate-pulse" />
                    <div>
                      <div className="h-3 w-16 bg-primary-fixed rounded animate-pulse mb-1" />
                      <div className="h-4 w-36 bg-primary-fixed rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

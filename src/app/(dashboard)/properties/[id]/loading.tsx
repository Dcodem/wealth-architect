export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero skeleton */}
      <section className="pt-8 px-8">
        <div className="relative h-96 rounded-xl overflow-hidden bg-surface-container animate-pulse">
          <div className="absolute bottom-0 left-0 p-10 w-full">
            <div className="h-6 w-32 bg-surface-container-high rounded-full mb-4" />
            <div className="h-12 w-96 bg-surface-container-high rounded mb-3" />
            <div className="h-5 w-64 bg-surface-container-high/60 rounded" />
          </div>
        </div>
      </section>

      {/* Metric cards skeleton */}
      <section className="px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col justify-between h-48"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low animate-pulse" />
              <div className="w-16 h-6 rounded bg-surface-container-low animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse mb-2" />
              <div className="h-9 w-16 bg-surface-container rounded animate-pulse" />
            </div>
          </div>
        ))}
      </section>

      {/* Maintenance section skeleton */}
      <div className="px-8 mt-12 space-y-12">
        <section>
          <div className="h-7 w-56 bg-surface-container rounded animate-pulse mb-4" />
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="h-3 w-28 bg-surface-container-low rounded animate-pulse" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pl-8 space-y-2">
                    <div className="h-3 w-24 bg-surface-container-low rounded animate-pulse" />
                    <div className="h-5 w-48 bg-surface-container rounded animate-pulse" />
                    <div className="h-4 w-72 bg-surface-container-low rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="h-3 w-32 bg-surface-container-low rounded animate-pulse" />
                <div className="p-6 rounded-xl border border-outline-variant/10">
                  <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse mb-3" />
                  <div className="h-9 w-16 bg-surface-container rounded animate-pulse" />
                </div>
                <div className="p-6 rounded-xl border border-outline-variant/10">
                  <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse mb-3" />
                  <div className="h-9 w-16 bg-surface-container rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unit table skeleton */}
        <section>
          <div className="h-7 w-40 bg-surface-container rounded animate-pulse mb-6" />
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-surface-container-low">
              <div className="h-3 w-full bg-surface-container-low rounded animate-pulse" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 border-t border-outline-variant/10">
                <div className="h-4 w-full bg-surface-container-low rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

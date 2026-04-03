export default function PropertiesLoading() {
  return (
    <div className="pt-8 pb-12 px-12 min-h-screen">
      {/* Header skeleton */}
      <header className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <div className="h-10 w-72 bg-surface-container rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-surface-container-low rounded animate-pulse" />
        </div>
      </header>

      {/* Metrics skeleton */}
      <section className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col items-start gap-4 rounded-[3rem] p-10"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-low animate-pulse" />
            <div>
              <div className="h-3 w-24 bg-surface-container-low rounded animate-pulse mb-3" />
              <div className="h-8 w-12 bg-surface-container rounded animate-pulse" />
            </div>
          </div>
        ))}
      </section>

      {/* Section title skeleton */}
      <div className="h-7 w-48 bg-surface-container rounded animate-pulse mb-8" />

      {/* Property cards skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border border-outline-variant/10"
          >
            <div className="h-64 bg-surface-container-low animate-pulse" />
            <div className="p-8 space-y-4">
              <div>
                <div className="h-6 w-48 bg-surface-container rounded animate-pulse" />
                <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse mt-2" />
              </div>
              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-surface-container-low rounded animate-pulse" />
                  <div className="h-5 w-20 bg-surface-container rounded animate-pulse" />
                </div>
                <div className="text-right space-y-1">
                  <div className="h-2 w-16 bg-surface-container-low rounded animate-pulse" />
                  <div className="h-5 w-12 bg-surface-container rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

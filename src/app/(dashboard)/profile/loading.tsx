export default function ProfileLoading() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* Profile Header skeleton */}
        <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 rounded-xl bg-surface-container animate-pulse border-4 border-white shadow-2xl"></div>
            <div className="pt-2 space-y-3">
              <div className="h-3 w-24 bg-surface-container rounded animate-pulse"></div>
              <div className="h-10 w-56 bg-surface-container rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-surface-container-low rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-surface-container rounded-lg animate-pulse"></div>
        </section>

        <div className="space-y-12">
          {/* The Wealth Architect Overview skeleton */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border-l-4 border-surface-container">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-28 bg-surface-container-low rounded-full animate-pulse"></div>
                  <div className="h-7 w-48 bg-surface-container rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-80 bg-surface-container-low rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-24 bg-surface-container-low rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-container-low p-5 rounded-lg border-l-2 border-surface-container">
                  <div className="h-3 w-16 bg-surface-container rounded animate-pulse mb-3"></div>
                  <div className="h-7 w-28 bg-surface-container rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-low p-8 rounded-xl h-48 flex flex-col justify-between">
                <div className="w-8 h-8 bg-surface-container rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-10 w-24 bg-surface-container rounded animate-pulse"></div>
                  <div className="h-3 w-28 bg-surface-container rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Account Details skeleton */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <div className="h-6 w-36 bg-surface-container rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 bg-surface-container rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-surface-container-low rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Security skeleton */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border-t-4 border-surface-container">
            <div className="h-6 w-36 bg-surface-container rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-surface-container-low rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Danger Zone skeleton */}
          <div className="max-w-3xl mx-auto pt-8">
            <div className="h-64 bg-surface-container-low rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

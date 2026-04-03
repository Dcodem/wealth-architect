export default function CaseDetailLoading() {
  return (
    <div className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-3 w-16 bg-surface-container rounded animate-pulse"></div>
          <div className="h-3 w-4 bg-surface-container rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-surface-container rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <div className="h-12 w-[500px] bg-surface-container rounded-lg animate-pulse mb-3"></div>
            <div className="h-5 w-96 bg-surface-container-low rounded animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-40 bg-surface-container rounded-full animate-pulse"></div>
            <div className="h-10 w-32 bg-surface-container rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Tenant Pill */}
          <div className="bg-surface-container-lowest rounded-full p-6 shadow-sm border border-outline-variant/20 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-surface-container animate-pulse"></div>
            <div className="flex-grow space-y-2">
              <div className="h-6 w-48 bg-surface-container rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-surface-container-low rounded animate-pulse"></div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/20">
            <div className="flex items-start gap-6 mb-10">
              <div className="w-14 h-14 rounded-xl bg-surface-container animate-pulse shrink-0"></div>
              <div className="flex-grow space-y-3">
                <div className="h-6 w-48 bg-surface-container rounded animate-pulse"></div>
                <div className="h-5 w-full bg-surface-container-low rounded animate-pulse"></div>
                <div className="h-5 w-3/4 bg-surface-container-low rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/20">
            <div className="h-6 w-48 bg-surface-container rounded animate-pulse mb-8"></div>
            <div className="space-y-8 pl-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-8">
                  <div className="w-9 h-9 rounded-full bg-surface-container animate-pulse shrink-0"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 w-48 bg-surface-container rounded animate-pulse"></div>
                    <div className="h-3 w-full bg-surface-container-low rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Log */}
          <div className="bg-surface-container-low rounded-2xl p-10 h-[500px] shadow-sm border border-outline-variant/20">
            <div className="h-6 w-56 bg-surface-container rounded animate-pulse mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[60%] space-y-2">
                    <div className="h-3 w-32 bg-surface-container rounded animate-pulse"></div>
                    <div className="h-20 w-full bg-surface-container-lowest rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/20">
            <div className="h-4 w-28 bg-surface-container rounded animate-pulse mb-8"></div>
            <div className="space-y-6">
              <div className="h-12 w-full bg-surface-container-low rounded-lg animate-pulse"></div>
              <div className="h-20 w-full bg-surface-container-low rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-surface-container rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-surface-container-low rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-10 shadow-sm border border-outline-variant/20">
            <div className="h-4 w-32 bg-surface-container rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-surface-container rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-surface-container rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
            <div className="h-56 bg-surface-container animate-pulse"></div>
            <div className="p-8 space-y-4">
              <div className="h-5 w-40 bg-surface-container rounded animate-pulse"></div>
              <div className="h-4 w-56 bg-surface-container-low rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

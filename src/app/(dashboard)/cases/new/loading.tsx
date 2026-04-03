export default function NewCaseLoading() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-surface-container rounded animate-pulse"></div>
        <div className="h-4 w-4 bg-surface-container-low rounded animate-pulse"></div>
        <div className="h-4 w-28 bg-surface-container rounded animate-pulse"></div>
      </div>

      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-10 w-80 bg-surface-container rounded animate-pulse"></div>
        <div className="h-4 w-[500px] bg-surface-container-low rounded animate-pulse"></div>
      </div>

      {/* Section 1 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
          <div className="h-6 w-40 bg-surface-container rounded animate-pulse"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="space-y-6">
            <div className="h-12 w-full bg-surface-container-low rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-12 bg-surface-container-low rounded-2xl animate-pulse"></div>
              <div className="h-10 bg-surface-container-low rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
          <div className="h-6 w-44 bg-surface-container rounded animate-pulse"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="h-32 w-full bg-surface-container-low rounded-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Section 3 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
          <div className="h-6 w-24 bg-surface-container rounded animate-pulse"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="grid grid-cols-2 gap-8">
            <div className="h-12 bg-surface-container-low rounded-2xl animate-pulse"></div>
            <div className="h-12 bg-surface-container-low rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Section 4 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
          <div className="h-6 w-20 bg-surface-container rounded animate-pulse"></div>
        </div>
        <div className="h-40 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-surface-container animate-pulse"></div>
      </div>

      {/* Section 5 skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
          <div className="h-6 w-48 bg-surface-container rounded animate-pulse"></div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
          <div className="h-12 w-full bg-surface-container-low rounded-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center justify-end gap-4 pt-8 border-t border-outline-variant/10">
        <div className="h-12 w-24 bg-surface-container-low rounded-lg animate-pulse"></div>
        <div className="h-12 w-40 bg-surface-container rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

export function SkeletonPulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-surface-container-high rounded ${className}`} style={style} />;
}

export function KPISkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-surface-container-lowest p-6 rounded-xl card-shadow">
          <div className="flex items-start justify-between">
            <SkeletonPulse className="w-10 h-10 rounded-xl" />
            <SkeletonPulse className="w-14 h-5 rounded-full" />
          </div>
          <div className="mt-6 space-y-2">
            <SkeletonPulse className="w-24 h-3" />
            <SkeletonPulse className="w-32 h-7" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl card-shadow">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <SkeletonPulse className="w-48 h-6" />
          <SkeletonPulse className="w-64 h-4" />
        </div>
        <div className="flex gap-4">
          <SkeletonPulse className="w-20 h-4" />
          <SkeletonPulse className="w-20 h-4" />
        </div>
      </div>
      <div className="flex items-end gap-4 h-[280px] pt-8">
        {[65, 85, 50, 95, 75, 100].map((h, i) => (
          <div key={i} className="flex-1 flex gap-1 items-end">
            <SkeletonPulse className="flex-1 rounded-t" style={{ height: `${h}%` }} />
            <SkeletonPulse className="flex-1 rounded-t" style={{ height: `${h * 0.6}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl card-shadow">
      <div className="flex items-center justify-between mb-8">
        <SkeletonPulse className="w-48 h-6" />
        <SkeletonPulse className="w-36 h-4" />
      </div>
      <div className="space-y-0">
        <div className="flex gap-6 py-4 px-6 bg-surface-container-low rounded-lg mb-2">
          {[1, 2, 3, 4, 5, 6].map((c) => (
            <SkeletonPulse key={c} className="flex-1 h-3" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-6 py-6 px-6 border-b border-surface">
            <div className="flex-1 flex items-center gap-3">
              <SkeletonPulse className="w-10 h-10 rounded" />
              <SkeletonPulse className="w-24 h-4" />
            </div>
            <SkeletonPulse className="flex-1 h-4" />
            <SkeletonPulse className="flex-1 h-4" />
            <SkeletonPulse className="flex-1 h-4" />
            <SkeletonPulse className="flex-1 h-4" />
            <div className="flex-1 flex justify-end">
              <SkeletonPulse className="w-16 h-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="w-56 h-8" />
          <SkeletonPulse className="w-32 h-4" />
        </div>
        <SkeletonPulse className="w-32 h-10 rounded-lg" />
      </div>
      <KPISkeletons />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <SkeletonPulse className="h-[400px] rounded-2xl" />
      </div>
      <TableSkeleton />
    </div>
  );
}

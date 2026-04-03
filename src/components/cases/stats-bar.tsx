"use client";

interface StatsBarProps {
  totalCases: number;
  openCases: number;
  propertyCount: number;
  onOpenCasesClick?: () => void;
}

export function StatsBar({ totalCases, openCases, propertyCount, onOpenCasesClick }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest rounded-2xl p-5 card-shadow border border-outline-variant/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
          <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">folder</span>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-on-surface">{totalCases}</p>
          <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Total Cases</p>
        </div>
      </div>
      <button
        onClick={onOpenCasesClick}
        className="bg-surface-container-lowest rounded-2xl p-5 card-shadow border border-outline-variant/10 flex items-center gap-4 text-left hover:ring-2 hover:ring-orange-300 transition-all cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <span aria-hidden="true" className="material-symbols-outlined text-orange-600">pending_actions</span>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-on-surface">{openCases}</p>
          <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Open Cases</p>
        </div>
        {openCases > 0 && (
          <div className="ml-auto flex items-center text-orange-600 text-[10px] font-bold">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse" />
            Active
          </div>
        )}
      </button>
      <div className="bg-surface-container-lowest rounded-2xl p-5 card-shadow border border-outline-variant/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">domain</span>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-on-surface">{propertyCount}</p>
          <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Properties</p>
        </div>
      </div>
    </div>
  );
}

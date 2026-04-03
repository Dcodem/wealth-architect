"use client";
import Link from "next/link";

export default function OnboardingStep1() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-xl">
        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-[0_12px_32px_rgba(20,27,43,0.04)] flex flex-col items-center text-center">
          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/40 text-primary">1</div>
            <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-surface-container-high text-on-surface-variant">2</div>
            <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-surface-container-high text-on-surface-variant">3</div>
            <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-surface-container-high text-on-surface-variant">4</div>
          </div>

          {/* Logo */}
          <span className="text-xl font-extrabold tracking-tight text-primary mb-8">
            The Wealth Architect
          </span>

          {/* Headline */}
          <div className="mb-10 space-y-3">
            <h1 className="font-bold text-[28px] leading-tight text-on-surface">
              Upload Your Documents
            </h1>
            <p className="text-on-surface-variant text-base">
              Import your financial records to get started
            </p>
          </div>

          {/* Upload Zone */}
          <div className="w-full h-[240px] border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors group cursor-pointer flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#0F766E 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">
                  cloud_upload
                </span>
              </div>
              <p className="font-semibold text-lg text-on-surface mb-1">
                Drag &amp; Drop files here
              </p>
              <p className="text-primary font-medium hover:underline">
                or Browse Files
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest/50">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-base">description</span>
                <span className="text-xs font-medium text-on-surface-variant">PDF</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest/50">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-base">table_chart</span>
                <span className="text-xs font-medium text-on-surface-variant">CSV</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest/50">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-base">grid_on</span>
                <span className="text-xs font-medium text-on-surface-variant">Excel</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-12 w-full space-y-6">
            <button
              disabled
              className="w-full py-4 px-8 rounded-lg bg-surface-container-highest text-on-surface-variant font-bold text-base cursor-not-allowed tracking-wide"
            >
              Continue
            </button>
            <div className="flex justify-center">
              <Link
                href="/onboarding/step-2"
                className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors"
              >
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/2 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-fixed to-transparent rounded-full blur-[120px]" />
      </div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/3 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-fixed-dim to-transparent rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

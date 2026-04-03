"use client";
import Link from "next/link";
import { useState } from "react";

export default function OnboardingStep2() {
  const [fileRemoved, setFileRemoved] = useState(false);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(20,27,43,0.04)] p-10 md:p-12 relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/10 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Step Indicator */}
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">1</div>
              <div className="w-10 h-1 rounded-full bg-primary/40" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/40 text-primary">2</div>
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-surface-container-high text-on-surface-variant">3</div>
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-surface-container-high text-on-surface-variant">4</div>
            </div>

            {/* Back + Logo */}
            <div className="w-full flex items-center justify-between mb-8">
              <Link
                href="/onboarding/step-1"
                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back
              </Link>
              <span className="text-lg font-extrabold tracking-tight text-primary">
                The Wealth Architect
              </span>
              <div className="w-14" />
            </div>

            {/* Title */}
            <h1 className="font-extrabold text-[2rem] leading-tight mb-4 text-on-surface">
              File Uploaded
            </h1>
            <p className="text-on-surface-variant max-w-md mb-10">
              Your transaction history has been successfully parsed. We are ready to structure your estate ledger.
            </p>

            {/* Upload Zone */}
            {fileRemoved ? (
              <div className="w-full bg-surface-container-low rounded-xl p-6 mb-10 flex items-center justify-center border-2 border-dashed border-outline-variant/40 transition-all">
                <div className="text-center py-4">
                  <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant/40 text-4xl mb-2">upload_file</span>
                  <p className="text-sm text-on-surface-variant font-medium">File removed. Upload a new file to continue.</p>
                </div>
              </div>
            ) : (
              <div className="w-full bg-surface-container-low rounded-xl p-6 mb-10 flex items-center justify-between border-2 border-dashed border-transparent transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                    <span aria-hidden="true" className="material-symbols-outlined">description</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-on-surface">
                      2023_property_transactions.csv
                    </div>
                    <div className="text-xs text-on-surface-variant">2.4 MB</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-on-success-container font-semibold text-sm">
                    <span
                      aria-hidden="true" className="material-symbols-outlined mr-1"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    Verified
                  </div>
                  <button
                    onClick={() => setFileRemoved(true)}
                    className="text-sm font-semibold text-error hover:opacity-80 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Action Area */}
            <div className="w-full space-y-6">
              <Link
                href="/onboarding/step-3"
                className="block w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150 text-center"
              >
                Continue
              </Link>
              <Link
                href="/onboarding/step-3"
                className="inline-block text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

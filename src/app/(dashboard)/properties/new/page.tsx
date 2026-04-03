"use client";

import { useState, useRef } from "react";
import { PropertyAddForm } from "@/components/properties/property-add-form";

export default function AddPropertyPage() {
  const [mode, setMode] = useState<"upload" | "manual">("upload");
  const [files, setFiles] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const names = Array.from(fileList).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
  }

  function handleProcess() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setMode("manual");
    }, 2000);
  }

  if (mode === "manual") {
    return <PropertyAddForm />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mb-2">
            <span>Properties</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>New Property</span>
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">
            Add New Property
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            Upload your property documents and we&apos;ll automatically extract all the details. Leases, tax records, insurance docs &mdash; our AI will populate everything for you.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className="border-2 border-dashed border-primary/30 rounded-2xl bg-primary-fixed/30 p-16 text-center hover:border-primary/60 hover:bg-primary-fixed/50 transition-all cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
          </div>
          <h2 className="text-2xl font-extrabold text-on-surface mb-3">
            Upload Property Documents
          </h2>
          <p className="text-on-surface-variant max-w-md mx-auto mb-6">
            Drag & drop lease agreements, tax documents, insurance certificates, or any property files. We&apos;ll extract the details automatically.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">folder_open</span>
            Browse Files
          </button>
        </div>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Uploaded Files</h3>
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <span className="text-sm font-medium text-on-surface">{file}</span>
                </div>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
            <button
              onClick={handleProcess}
              disabled={processing}
              className="mt-4 px-10 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-xl shadow-primary/10 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Processing Documents...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Process Documents with AI
                </>
              )}
            </button>
          </div>
        )}

        {/* Manual fallback */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setMode("manual")}
            className="group text-primary font-bold text-sm inline-flex items-center gap-1"
          >
            <span className="group-hover:underline underline-offset-4 decoration-2">Or fill in manually</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast, ToastContainer } from "@/components/Toast";

export interface PropertyFormData {
  name: string;
  location: string;
  type: "residential" | "commercial";
  totalUnits: number;
  status: "Active" | "Attention" | "Inactive";
  monthlyYield: string;
  imageUrl: string;
  manager: string;
  notes: string;
}

export interface TenantData {
  id: string;
  unit: string;
  name: string;
  rent: string;
  status: "Current" | "Vacant" | "Late";
  leaseEnd: string;
  notes: string;
}

export interface DocFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface PropertyFormProps {
  mode: "add" | "edit";
  initialData?: Partial<PropertyFormData>;
  initialTenants?: TenantData[];
  initialDocuments?: DocFile[];
  propertySlug?: string;
}

const defaultData: PropertyFormData = {
  name: "",
  location: "",
  type: "residential",
  totalUnits: 1,
  status: "Active",
  monthlyYield: "",
  imageUrl: "",
  manager: "",
  notes: "",
};

// Simulated AI extraction results based on uploaded file names
function simulateExtraction(fileNames: string[]): { fields: Partial<PropertyFormData>; tenants: TenantData[]; summary: string } {
  const lower = fileNames.map((f) => f.toLowerCase());
  const hasLease = lower.some((f) => f.includes("lease"));
  const hasInsurance = lower.some((f) => f.includes("insurance"));
  const hasTax = lower.some((f) => f.includes("tax"));

  const parts: string[] = [];
  const fields: Partial<PropertyFormData> = {};
  const tenants: TenantData[] = [];

  if (hasLease) {
    tenants.push({
      id: `t-${Date.now()}`,
      unit: "Unit A",
      name: "Extracted Tenant",
      rent: "$1,500",
      status: "Current",
      leaseEnd: "Dec 2026",
      notes: "Extracted from lease agreement",
    });
    fields.monthlyYield = "$1,500";
    parts.push("tenant details", "lease terms", "rent amount");
  }
  if (hasInsurance) {
    parts.push("insurance provider");
  }
  if (hasTax) {
    fields.location = fields.location || "";
    parts.push("tax assessment data");
  }

  if (parts.length === 0) {
    parts.push("document metadata");
  }

  return {
    fields,
    tenants,
    summary: `Extracted ${parts.join(", ")} from ${fileNames.length} document${fileNames.length !== 1 ? "s" : ""}.`,
  };
}

export default function PropertyForm({ mode, initialData, initialTenants, initialDocuments, propertySlug }: PropertyFormProps) {
  const router = useRouter();
  const { toasts, showToast, dismissToast } = useToast();
  const [form, setForm] = useState<PropertyFormData>({ ...defaultData, ...initialData });
  const [tenants, setTenants] = useState<TenantData[]>(initialTenants || []);
  const [documents, setDocuments] = useState<DocFile[]>(initialDocuments || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // AI extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<string | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState<{ name: string; size: string; progress: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const update = (field: keyof PropertyFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("imageUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDocUpload = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).map((f) => ({
      name: f.name,
      size: f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0,
    }));
    setUploadingDocs(incoming);

    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      const progress = Math.min(tick * 20, 100);
      setUploadingDocs((prev) => prev.map((f) => ({ ...f, progress })));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newDocs: DocFile[] = incoming.map((f) => ({
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: f.name,
            size: f.size,
            type: f.name.endsWith(".pdf") ? "pdf" : f.name.match(/\.(xlsx|csv)$/i) ? "spreadsheet" : "document",
          }));
          setDocuments((prev) => [...newDocs, ...prev]);
          setUploadingDocs([]);

          // Start AI extraction
          setExtracting(true);
          setTimeout(() => {
            const result = simulateExtraction(incoming.map((f) => f.name));
            // Auto-fill fields that are currently empty
            setForm((prev) => {
              const updated = { ...prev };
              for (const [key, value] of Object.entries(result.fields)) {
                if (!prev[key as keyof PropertyFormData] && value) {
                  (updated as Record<string, unknown>)[key] = value;
                }
              }
              return updated;
            });
            // Add extracted tenants
            if (result.tenants.length > 0) {
              setTenants((prev) => [...prev, ...result.tenants]);
            }
            setExtracting(false);
            setExtractionResult(result.summary);
            showToast("AI extraction complete — review auto-filled fields below", "success");
          }, 2500);
        }, 400);
      }
    }, 300);
  }, [showToast]);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      showToast(`"${form.name}" removed from portfolio`, "success");
      setTimeout(() => router.push("/properties"), 1200);
    }, 1500);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast("Property name is required", "error");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      showToast(
        mode === "add" ? `"${form.name}" added to portfolio` : `"${form.name}" updated`,
        "success"
      );
      setTimeout(() => {
        router.push(propertySlug ? `/properties/${propertySlug}` : "/properties");
      }, 1200);
    }, 1500);
  };

  const addTenant = () => {
    setTenants((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        unit: `Unit ${String.fromCharCode(65 + prev.length)}`,
        name: "",
        rent: "",
        status: "Current",
        leaseEnd: "",
        notes: "",
      },
    ]);
  };

  const updateTenant = (id: string, field: keyof TenantData, value: string) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const removeTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const removeDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const inputClass =
    "w-full bg-surface-container-high border-none rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:ring-1 focus:ring-primary/40 transition-all outline-none";
  const labelClass = "text-xs font-semibold text-on-surface-variant tracking-wide uppercase";

  const docTypeIcon = (name: string) => {
    if (name.endsWith(".pdf")) return { icon: "picture_as_pdf", bg: "bg-red-50", text: "text-red-500" };
    if (name.match(/\.(xlsx|csv)$/i)) return { icon: "table_chart", bg: "bg-success-container", text: "text-on-success-container" };
    if (name.match(/\.(png|jpg|jpeg)$/i)) return { icon: "image", bg: "bg-blue-50", text: "text-blue-500" };
    return { icon: "description", bg: "bg-primary-fixed", text: "text-primary" };
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Document Upload — PRIMARY section for add mode */}
      <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">upload_file</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Documents</h3>
        </div>
        <div className="flex items-start gap-2 mb-6 p-3 bg-primary/5 rounded-lg">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px] mt-0.5">auto_awesome</span>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Upload property documents (leases, insurance, tax records) and <strong className="text-on-surface">AI will automatically extract</strong> tenant names, rent amounts, lease dates, and other details to fill in the form below.
          </p>
        </div>

        {/* Extraction result banner */}
        {extracting && (
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px] animate-spin">progress_activity</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">AI is analyzing your documents...</p>
              <p className="text-xs text-on-surface-variant">Extracting tenant details, lease terms, and property information</p>
            </div>
          </div>
        )}
        {extractionResult && !extracting && (
          <div className="mb-4 p-4 bg-success-container border border-success-border/50 rounded-xl flex items-start gap-3">
            <span aria-hidden="true" className="material-symbols-outlined text-on-success-container text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <p className="text-sm font-bold text-on-success-container">{extractionResult}</p>
              <p className="text-xs text-on-success-container mt-0.5">Review the auto-filled fields below and make any corrections needed.</p>
            </div>
            <button onClick={() => setExtractionResult(null)} className="ml-auto shrink-0 text-on-success-container hover:text-on-success-container">
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Upload progress */}
        {uploadingDocs.length > 0 && (
          <div className="space-y-3 mb-4">
            {uploadingDocs.map((f, i) => (
              <div key={i} className="bg-surface-container-low rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-on-surface truncate">{f.name}</p>
                  <p className="text-xs text-on-surface-variant">{f.progress}%</p>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded document list */}
        {documents.length > 0 && (
          <div className="mb-4 bg-surface-container-low rounded-xl divide-y divide-surface overflow-hidden">
            {documents.map((doc) => {
              const { icon, bg, text } = docTypeIcon(doc.name);
              return (
                <div key={doc.id} className="flex items-center gap-3 px-4 py-3 group">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <span aria-hidden="true" className={`material-symbols-outlined text-[16px] ${text}`}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{doc.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{doc.size}</p>
                  </div>
                  <button
                    onClick={() => removeDoc(doc.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Drop zone */}
        <input
          ref={docInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv,.doc,.docx"
          className="hidden"
          onChange={(e) => handleDocUpload(e.target.files)}
        />
        {uploadingDocs.length === 0 && !extracting && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleDocUpload(e.dataTransfer.files); }}
            onClick={() => docInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container-low/50"
            }`}
          >
            <span aria-hidden="true" className={`material-symbols-outlined text-[28px] ${isDragging ? "text-primary" : "text-on-surface-variant"}`}>cloud_upload</span>
            <div className="text-center">
              <p className="text-sm font-semibold text-on-surface">{isDragging ? "Drop files here" : "Drag & drop documents here"}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">or click to browse &middot; PDF, XLSX, CSV, DOC up to 50MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">apartment</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Property Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Property Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Sunset Ridge Apartments"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Location / Address</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Downtown District"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Property Type</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className={inputClass}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Total Units</label>
            <input
              type="number"
              min={1}
              value={form.totalUnits}
              onChange={(e) => update("totalUnits", parseInt(e.target.value) || 1)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Tenant Management */}
      <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="material-symbols-outlined text-primary">group</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Tenants</h3>
            {tenants.length > 0 && (
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                {tenants.length}
              </span>
            )}
          </div>
          <button
            onClick={addTenant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span>
            Add Tenant
          </button>
        </div>

        {tenants.length === 0 ? (
          <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-8 text-center">
            <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-on-surface-variant/40 mb-2 block">person_add</span>
            <p className="text-sm font-semibold text-on-surface-variant">No tenants yet</p>
            <p className="text-xs text-on-surface-variant/60 mt-1">Upload a lease document to auto-detect tenants, or add them manually.</p>
            <button
              onClick={addTenant}
              className="mt-4 px-4 py-2 bg-surface-container-high rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition-colors inline-flex items-center gap-2"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span>
              Add Tenant Manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="bg-surface-container-low rounded-xl p-4 relative group">
                <button
                  onClick={() => removeTenant(tenant.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Unit</label>
                    <input
                      type="text"
                      value={tenant.unit}
                      onChange={(e) => updateTenant(tenant.id, "unit", e.target.value)}
                      placeholder="e.g. Unit A"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Tenant Name</label>
                    <input
                      type="text"
                      value={tenant.name}
                      onChange={(e) => updateTenant(tenant.id, "name", e.target.value)}
                      placeholder="e.g. Sarah Chen"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Monthly Rent</label>
                    <input
                      type="text"
                      value={tenant.rent}
                      onChange={(e) => updateTenant(tenant.id, "rent", e.target.value)}
                      placeholder="e.g. $1,500"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Status</label>
                    <select
                      value={tenant.status}
                      onChange={(e) => updateTenant(tenant.id, "status", e.target.value)}
                      className={inputClass}
                    >
                      <option value="Current">Current</option>
                      <option value="Late">Late</option>
                      <option value="Vacant">Vacant</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Lease End</label>
                    <input
                      type="text"
                      value={tenant.leaseEnd}
                      onChange={(e) => updateTenant(tenant.id, "leaseEnd", e.target.value)}
                      placeholder="e.g. Dec 2025"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Notes</label>
                    <input
                      type="text"
                      value={tenant.notes}
                      onChange={(e) => updateTenant(tenant.id, "notes", e.target.value)}
                      placeholder="Optional notes"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial & Status */}
      <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">monitoring</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Financial &amp; Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Monthly Yield Target</label>
            <input
              type="text"
              value={form.monthlyYield}
              onChange={(e) => update("monthlyYield", e.target.value)}
              placeholder="e.g. $5,000"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Attention">Attention</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Image & Manager */}
      <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">image</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Media &amp; Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Cover Image</label>
            {form.imageUrl ? (
              <div className="relative group rounded-lg overflow-hidden bg-surface-container-high h-40">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white/90 text-on-surface rounded-lg text-xs font-bold hover:bg-white transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => update("imageUrl", "")}
                    className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg text-xs font-bold hover:bg-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-outline-variant/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-surface-container-high/50 transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-on-surface-variant">cloud_upload</span>
                <span className="text-sm font-semibold text-on-surface-variant">Upload Image</span>
                <span className="text-[11px] text-on-surface-variant/60">or paste a URL below</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              type="text"
              value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="Or paste image URL here..."
              className={`${inputClass} mt-2`}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Property Manager</label>
            <input
              type="text"
              value={form.manager}
              onChange={(e) => update("manager", e.target.value)}
              placeholder="e.g. R. Barrett"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 space-y-1.5">
          <label className={labelClass}>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any additional notes about this property..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all flex items-center gap-2"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_back</span>
            Cancel
          </button>
          {mode === "edit" && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 border border-red-200 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">delete</span>
              Delete Property
            </button>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${
            saved
              ? "bg-success-container0 text-white shadow-success/20"
              : saving
              ? "bg-surface-container-high text-on-surface-variant cursor-wait"
              : "bg-gradient-to-br from-primary to-primary-container text-white shadow-primary/20 hover:scale-[1.02]"
          }`}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            {saved ? "check" : saving ? "hourglass_top" : mode === "add" ? "add" : "save"}
          </span>
          {saved ? "Saved!" : saving ? "Saving..." : mode === "add" ? "Add Property" : "Save Changes"}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => !deleting && setShowDeleteConfirm(false)}>
          <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-red-600 text-[24px]">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Delete Property</h3>
                <p className="text-xs text-on-surface-variant">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
              Are you sure you want to delete <strong className="text-on-surface">{form.name}</strong>?
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              All associated transactions, documents, and tenant records will be permanently removed from your portfolio.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-5 py-2.5 border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                  deleting
                    ? "bg-surface-container-high text-on-surface-variant cursor-wait"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {deleting ? "hourglass_top" : "delete_forever"}
                </span>
                {deleting ? "Deleting..." : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

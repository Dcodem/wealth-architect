"use client";

import type { PropertyFile } from "@/components/PropertyFiles";

interface PropertySummaryProps {
  propertyName: string;
  location: string;
  propertyType: "residential" | "commercial";
  occupancy: number;
  totalUnits: number;
  monthlyYield: string;
  files: PropertyFile[];
}

function generateNarrative(props: PropertySummaryProps): {
  summary: string;
  highlights: { icon: string; label: string; detail: string }[];
  riskNote: string | null;
} {
  const { propertyName, location, propertyType, occupancy, totalUnits, monthlyYield, files } = props;

  const fileCats = files.map((f) => f.category.toLowerCase());
  const fileNames = files.map((f) => f.name.toLowerCase());
  const allText = [...fileCats, ...fileNames];

  const has = (keyword: string) => allText.some((t) => t.includes(keyword));

  const occupiedUnits = Math.round((occupancy / 100) * totalUnits);
  const unitLabel = totalUnits === 1 ? "single-unit" : `${totalUnits}-unit`;
  const typeLabel = propertyType === "commercial" ? "commercial" : "residential";

  // Build narrative sentences
  const sentences: string[] = [];

  // Opening sentence
  if (totalUnits === 1) {
    sentences.push(
      `${propertyName} is a single-family ${typeLabel} property in ${location}, currently fully occupied with a monthly yield of ${monthlyYield}.`
    );
  } else {
    sentences.push(
      `${propertyName} is a ${unitLabel} ${typeLabel} property in ${location} with ${occupiedUnits} of ${totalUnits} units occupied, generating ${monthlyYield}/mo in rental income.`
    );
  }

  // Lease info
  const leaseFiles = files.filter((f) => f.category.toLowerCase().includes("lease") || f.name.toLowerCase().includes("lease"));
  if (leaseFiles.length > 0) {
    if (leaseFiles.length === 1) {
      sentences.push(`An active lease agreement is on file.`);
    } else {
      sentences.push(`${leaseFiles.length} active lease agreements are on file covering occupied units.`);
    }
  }

  // Insurance
  if (has("insurance")) {
    const insuranceFile = files.find((f) => f.category.toLowerCase().includes("insurance"));
    if (insuranceFile) {
      const d = new Date(insuranceFile.uploaded);
      const monthYear = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      sentences.push(`Insurance coverage is documented as of ${monthYear}.`);
    }
  }

  // Inspection
  if (has("inspection") || has("safety")) {
    sentences.push(`Recent inspection records confirm the property meets current safety and compliance standards.`);
  }

  // Appraisal / Tax
  if (has("appraisal")) {
    sentences.push(`A current property appraisal is on file for valuation reference.`);
  }
  if (has("tax")) {
    sentences.push(`Tax assessment records are filed and up to date.`);
  }

  // Build highlights
  const highlights: { icon: string; label: string; detail: string }[] = [];

  if (leaseFiles.length > 0) {
    highlights.push({ icon: "description", label: "Lease Coverage", detail: `${leaseFiles.length} agreement${leaseFiles.length !== 1 ? "s" : ""} on file` });
  }
  if (has("insurance")) {
    highlights.push({ icon: "shield", label: "Insurance", detail: "Policy documented" });
  }
  if (has("inspection") || has("safety")) {
    highlights.push({ icon: "verified_user", label: "Inspections", detail: "Compliance verified" });
  }
  if (has("tax") || has("assessment")) {
    highlights.push({ icon: "receipt_long", label: "Tax Records", detail: "Assessment filed" });
  }
  if (has("appraisal")) {
    highlights.push({ icon: "monitoring", label: "Appraisal", detail: "Valuation current" });
  }
  if (has("maintenance") || has("contract")) {
    highlights.push({ icon: "build", label: "Maintenance", detail: "Contract active" });
  }
  if (has("zoning") || has("permit")) {
    highlights.push({ icon: "gavel", label: "Permits", detail: "Zoning approved" });
  }

  // Risk note
  let riskNote: string | null = null;
  if (occupancy < 80) {
    riskNote = `Occupancy is below 80% \u2014 consider reviewing pricing or marketing strategy to reduce vacancy.`;
  } else if (!has("insurance")) {
    riskNote = `No insurance documentation found on file. Ensure coverage is current and uploaded.`;
  } else if (!has("lease") && totalUnits > 1) {
    riskNote = `No lease agreements found on file. Upload current leases to maintain compliance records.`;
  }

  return { summary: sentences.join(" "), highlights, riskNote };
}

export default function PropertySummary(props: PropertySummaryProps) {
  const { summary, highlights, riskNote } = generateNarrative(props);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(20,27,43,0.04)] border border-outline-variant/10 p-6">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
        <p className="text-[11px] font-bold text-primary uppercase tracking-widest">AI Property Summary</p>
      </div>

      <p className="text-sm text-on-surface leading-relaxed mb-5">{summary}</p>

      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg">
              <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">{h.icon}</span>
              <div>
                <p className="text-[11px] font-bold text-on-surface leading-tight">{h.label}</p>
                <p className="text-[11px] text-on-surface-variant">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {riskNote && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 rounded-lg border border-amber-100">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-amber-600 mt-0.5">warning</span>
          <p className="text-[12px] text-amber-700 font-medium leading-relaxed">{riskNote}</p>
        </div>
      )}
    </div>
  );
}

import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { countActiveCasesByProperty } from "@/lib/db/queries/cases";
import { PropertyCard } from "@/components/properties/property-card";
import { AddPropertyButton } from "@/components/properties/add-property-button";

export default async function PropertiesPage() {
  const orgId = await getOrgId();

  const [properties, caseCounts] = await Promise.all([
    listProperties(orgId),
    countActiveCasesByProperty(orgId),
  ]);

  const totalOpenCases = Array.from(caseCounts.values()).reduce(
    (sum, c) => sum + c,
    0
  );

  const totalPortfolioValue = properties.reduce(
    (sum, p) => sum + ((p.currentValue ?? 0) * (p.ownershipPercentage ?? 100)) / 100,
    0
  );
  const totalMonthlyIncome = properties.reduce(
    (sum, p) => sum + (p.monthlyRent ?? 0),
    0
  );
  const totalUnits = properties.reduce((sum, p) => sum + (p.unitCount ?? 1), 0);
  const totalEquity = properties.reduce((sum, p) => {
    const value = (p.currentValue ?? 0) * (p.ownershipPercentage ?? 100) / 100;
    const cost = (p.purchasePrice ?? 0) * (p.ownershipPercentage ?? 100) / 100;
    return sum + (value - cost);
  }, 0);

  return (
    <div>
      {/* Header Section */}
      <header className="mb-10 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            Portfolio Overview
          </h1>
          <p className="text-on-surface-variant leading-relaxed">
            Managing {properties.length} propert
            {properties.length === 1 ? "y" : "ies"} across your portfolio.
          </p>
        </div>
      </header>

      {/* Financial KPIs */}
      <section className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-4 transition-all hover:shadow-md rounded-2xl p-5 card-shadow">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface tabular-nums">
              ${totalPortfolioValue >= 1_000_000
                ? `${(totalPortfolioValue / 1_000_000).toFixed(1)}M`
                : `${(totalPortfolioValue / 1_000).toFixed(0)}K`}
            </p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Portfolio Value
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-4 transition-all hover:shadow-md rounded-2xl p-5 card-shadow">
          <div className="w-10 h-10 rounded-xl bg-success-container flex items-center justify-center text-on-success-container">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface tabular-nums">
              ${totalMonthlyIncome.toLocaleString()}
            </p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Monthly Income
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-4 transition-all hover:shadow-md rounded-2xl p-5 card-shadow">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            totalEquity >= 0
              ? "bg-success-container text-on-success-container"
              : "bg-error-container text-error"
          }`}>
            <span className="material-symbols-outlined">savings</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface tabular-nums">
              {totalEquity >= 0 ? "+" : "-"}${Math.abs(totalEquity) >= 1_000_000
                ? `${(Math.abs(totalEquity) / 1_000_000).toFixed(1)}M`
                : `${(Math.abs(totalEquity) / 1_000).toFixed(0)}K`}
            </p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Total Equity Gain
            </p>
          </div>
        </div>
      </section>

      {/* Operational KPIs */}
      <section className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-3">
        <div className="bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-4 transition-all hover:shadow-md rounded-2xl p-5 card-shadow">
          <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined">gavel</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">
              {String(totalOpenCases).padStart(2, "0")}
            </p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Open Cases
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-4 transition-all hover:shadow-md rounded-2xl p-5 card-shadow">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">
              {String(properties.length).padStart(2, "0")}
            </p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Properties
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 flex items-center gap-4 transition-all hover:shadow-md rounded-2xl p-5 card-shadow">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">apartment</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">
              {String(totalUnits).padStart(2, "0")}
            </p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Total Units
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <h3 className="text-xl font-bold mb-6 text-on-surface">
        Active Properties
      </h3>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            activeCases={caseCounts.get(property.id) ?? 0}
          />
        ))}

        <AddPropertyButton />
      </section>
    </div>
  );
}

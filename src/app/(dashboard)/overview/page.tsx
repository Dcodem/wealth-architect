import { getOrgId } from "@/lib/db/queries/helpers";
import { listCases } from "@/lib/db/queries/cases";
import { listProperties } from "@/lib/db/queries/properties";
import { listTenants } from "@/lib/db/queries/tenants";
import { listVendors } from "@/lib/db/queries/vendors";
import { OverviewClient } from "./overview-client";

export const metadata = { title: "Dashboard | The Wealth Architect" };

export default async function OverviewPage() {
  const orgId = await getOrgId();

  const [cases, properties, tenants, vendors] = await Promise.all([
    listCases(orgId),
    listProperties(orgId),
    listTenants(orgId),
    listVendors(orgId),
  ]);

  // Compute portfolio KPIs from properties
  const portfolioKPIs = {
    totalValue: properties.reduce((sum, p) => {
      const value = p.currentValue ?? p.purchasePrice ?? 0;
      const ownership = (p.ownershipPercentage ?? 100) / 100;
      return sum + value * ownership;
    }, 0),
    totalEquity: properties.reduce((sum, p) => {
      const value = p.currentValue ?? p.purchasePrice ?? 0;
      const ownership = (p.ownershipPercentage ?? 100) / 100;
      // Simplified equity = ownership share of current value
      return sum + value * ownership;
    }, 0),
    monthlyIncome: properties.reduce((sum, p) => {
      const rent = p.monthlyRent ?? 0;
      const ownership = (p.ownershipPercentage ?? 100) / 100;
      return sum + rent * ownership;
    }, 0),
    propertyCount: properties.length,
    totalUnits: properties.reduce((sum, p) => sum + (p.unitCount ?? 1), 0),
  };

  return (
    <OverviewClient
      cases={cases}
      properties={properties}
      tenants={tenants}
      vendorCount={vendors.length}
      portfolioKPIs={portfolioKPIs}
    />
  );
}

import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { listVendors } from "@/lib/db/queries/vendors";
import { CaseCreateForm } from "@/components/cases/case-create-form";

export const metadata = { title: "Log Maintenance Entry | The Wealth Architect" };

export default async function NewCasePage() {
  const orgId = await getOrgId();

  const [properties, vendors] = await Promise.all([
    listProperties(orgId),
    listVendors(orgId),
  ]);

  return (
    <CaseCreateForm
      properties={properties}
      vendors={vendors}
    />
  );
}

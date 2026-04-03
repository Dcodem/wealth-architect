import { getOrgId } from "@/lib/db/queries/helpers";
import { listProperties } from "@/lib/db/queries/properties";
import { TenantAddForm } from "@/components/tenants/tenant-add-form";

export default async function AddTenantPage() {
  const orgId = await getOrgId();
  const properties = await listProperties(orgId);

  return (
    <TenantAddForm
      properties={properties.map((p) => ({ id: p.id, address: p.address }))}
    />
  );
}

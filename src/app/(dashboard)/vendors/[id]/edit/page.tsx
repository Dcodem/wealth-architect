import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getVendor } from "@/lib/db/queries/vendors";
import { VendorEditForm } from "@/components/vendors/vendor-edit-form";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();

  const vendor = await getVendor(id, orgId);
  if (!vendor) notFound();

  return <VendorEditForm vendor={vendor} />;
}

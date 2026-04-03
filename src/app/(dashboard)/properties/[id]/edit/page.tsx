import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getProperty } from "@/lib/db/queries/properties";
import { PropertyEditForm } from "@/components/properties/property-edit-form";

export default async function PropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();
  const property = await getProperty(id, orgId);
  if (!property) notFound();
  return <PropertyEditForm property={property} />;
}
